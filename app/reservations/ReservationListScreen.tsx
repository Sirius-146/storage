import { useMemo, useState } from "react";
import { Button, Modal, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useReservations from "./hooks/useReservations";
import Reservation from "./types/reservation";
import { calculateMealTotals, groupArrivalByMeal, groupDepartureByMeal } from "./utils/reservationUtils";

export default function ReservationListScreen() {
    const [date, setDate] = useState(new Date());
    const { arriving, leaving, active, loading } = useReservations(date);
    const insets = useSafeAreaInsets();
    const [showTotals, setShowTotals] = useState(false);
    const mealTotals = calculateMealTotals(arriving, leaving, active);

    const previousDay = () => setDate(new Date(date.setDate(date.getDate() - 1)));
    const nextDay = () => setDate(new Date(date.setDate(date.getDate() + 1)));

    // Agrupar por refeição
    const arrivalsByMeal = useMemo(() => groupArrivalByMeal(arriving), [arriving]);
    const leavingsByMeal = useMemo(() => groupDepartureByMeal(leaving), [leaving]);

    // Totais (chegadas + ativos)
    const totalApartments = arriving.length + active.length;
    const totalGuests = arriving.reduce((sum, r) => sum + r.guests, 0) +
                        active.reduce((sum, r) => sum + r.guests, 0);
    
    const sections = [
        { title: "Para chegar:", data: [], subgroups: arrivalsByMeal },
        { title: "Para sair:", data: [], subgroups: leavingsByMeal },
        { title: "Permanece:", data: active, subgroups: null }, // permanece não tem subgrupo
    ];
    
    return (
        <View style={styles.container}>
            <Text style={styles.header}>HOTEL</Text>

            {/* Navegação de data */}
            <View style={styles.dateNav}>
                <Button title="«" onPress={previousDay} />
                <Text style={styles.date}>{date.toLocaleDateString()}</Text>
                <Button title="»" onPress={nextDay} />
            </View>
            
            {loading ? (
                <Text>Carregando...</Text>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item: Reservation, index) => `${item.id}-${index}`}
                    renderItem={({ item, section }) => {
                        if (!item) return null;
                        return (
                            <Text style={styles.item}>
                                {item.apartment.number} ({item.guests}) - {item.client.name}
                            </Text>
                        );
                    }}
                    renderSectionHeader={({ section }) => (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            {/* Subgrupos de refeição */}
                            {section.subgroups &&
                                Object.entries(section.subgroups).map(([meal, list]) => {
                                    if (list.length === 0) return null;
                                    const totalApts = list.length;
                                    const totalGuests = list.reduce(
                                        (sum, r) => sum + r.guests,
                                        0
                                    );
                                    return (
                                        <View key={meal} style={styles.subGroup}>
                                            <Text style={styles.subGroupTitle}>
                                                {meal} — {totalApts} apts | {totalGuests} hóspedes
                                            </Text>
                                            {list.map((r) => (
                                                <Text key={r.id} style={styles.item}>
                                                    {r.apartment.number} ({r.guests}) - {r.client.name}
                                                </Text>
                                            ))}
                                        </View>
                                    );
                                })
                            }
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.empty}>Nenhuma reserva para esta data.</Text>
                    }
                    contentContainerStyle={{ paddingBottom: insets.bottom + 72, }} // espaço p/ rodapé fixo
                />
            )}
    
            {/* Footer com total de apts e hóspedes */}
            <TouchableOpacity style={styles.footer} onPress={() => setShowTotals(true)}>
                <Text style={styles.footerText}>
                    Apartamentos: {totalApartments} | Total hóspedes: {totalGuests}
                </Text>
            </TouchableOpacity>
            
            {/* Modal com total por refeição */}
            <Modal visible={showTotals} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text>Café da manhã: {mealTotals.breakfast.apartments} apts | {mealTotals.breakfast.guests} hóspedes</Text>
                        <Text>Almoço: {mealTotals.lunch.apartments} apts | {mealTotals.lunch.guests} hóspedes</Text>
                        <Text>Jantar: {totalApartments} apts | {totalGuests} hóspedes</Text>
                        <Button title="Fechar" onPress={() => setShowTotals(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "white" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  dateNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  date: { fontSize: 16, fontWeight: "500" },
  sectionHeader: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  subGroup: { marginLeft: 12, marginBottom: 6 },
  subGroupTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  item: { fontSize: 15, paddingVertical: 2, paddingHorizontal: 8 },
  empty: { marginTop: 20, fontSize: 16, color: "#777", textAlign: "center" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "white",
  },
  footerText: { fontSize: 16, fontWeight: "500" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: "80%",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  modalSubTitle: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  loading: { textAlign: "center", marginTop: 20, fontSize: 16 },
});
