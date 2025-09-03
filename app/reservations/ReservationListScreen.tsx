import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import ReservationSection from "./components/ReservationSection";
import { useReservations } from "./hooks/useReservations";

export default function ReservationListScreen() {
    const [date, setDate] = useState(new Date());
    const { arriving, leaving, active, loading } = useReservations(date);
    
    const previousDay = () => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() - 1);
        setDate(newDate);
    };
    
    const nextDay = () => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + 1);
        setDate(newDate);
    };

    const totalApartments = arriving.length + active.length;
    const totalGuests = arriving.reduce((sum, r) => sum + r.guests, 0) +
                        active.reduce((sum, r) => sum + r.guests, 0);
    
    return (
        <View style={styles.container}>
            <Text style={styles.header}>HOTEL</Text>

            {/* Navegação de data */}
            <View style={styles.dateNav}>
                <Button title="«" onPress={previousDay} />
                <Text style={styles.date}>{date.toLocaleDateString()}</Text>
                <Button title="»" onPress={nextDay} />
            </View>
            
            <ScrollView style={styles.scrollContainer}>
                {loading ? (
                    <Text>Carregando...</Text>
                ) : (
                    <>
                        <ReservationSection title="Para chegar:" reservations={arriving} />
                        <ReservationSection title="Para sair:" reservations={leaving} />
                        <ReservationSection title="Permanece:" reservations={active} />

                        {!arriving.length && !leaving.length && !active.length && (
                            <Text style={styles.empty}>Nenhuma reserva para esta data.</Text>
                        )}
                    </>
                )}
            </ScrollView>

            {/* Footer com total de apts e hóspedes */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Apartamentos ocupados: {totalApartments} | Total hóspedes: {totalGuests}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  dateNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  date: { fontSize: 16, fontWeight: "500" },
  scrollContainer: { flex: 1, paddingHorizontal: 16 },
  empty: { marginTop: 20, fontSize: 16, color: "#777" },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 12,
    alignItems: "center"
  },
  footerText: {fontSize: 16, fontWeight: "500"}
});
