import { useMemo, useState } from "react";
import { Button, SectionList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TotalsCard from "./components/TotalsCard";
import useReservations from "./hooks/useReservations";
import Reservation from "./types/reservation";
import { calculateMealTotals, groupArrivalByMeal, groupDepartureByMeal } from "./utils/reservationUtils";

export default function ReservationListScreen() {
    const [date, setDate] = useState(new Date());
    const { arriving, leaving, active, loading } = useReservations(date);
    const insets = useSafeAreaInsets();
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
        <View style={{flex: 1}}>
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
                        contentContainerStyle={{ paddingBottom: insets.bottom }} // espaço p/ rodapé fixo
                    />
                )}
            </View>
            <TotalsCard
                    mealTotals={mealTotals}
                    totalApartments={totalApartments}
                    totalGuests={totalGuests}
                />
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, backgroundColor: "white" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  dateNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    padding: 10,
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
  
  loading: { textAlign: "center", marginTop: 20, fontSize: 16 },
});
