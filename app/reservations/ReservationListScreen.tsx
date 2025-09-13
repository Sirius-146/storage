import { useMemo, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ReservationSection from "./components/ReservationSection";
import TotalsCard from "./components/TotalsCard";
import useReservations from "./hooks/useReservations";
import { buildMealSections, buildSimpleSection } from "./utils/reservationSection";
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

    // const sections = [
    //     { title: "Para chegar:", data: [], subgroups: arrivalsByMeal },
    //     { title: "Para sair:", data: [], subgroups: leavingsByMeal },
    //     { title: "Permanece:", data: active, subgroups: null },
    // ];

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
                    <ScrollView>
                        <View style={{ paddingBottom: insets.bottom }}>
                            <ReservationSection
                                title="Chegadas"
                                sections={buildMealSections(arrivalsByMeal)}
                            />

                            <ReservationSection
                                title="Saídas"
                                sections={buildMealSections(leavingsByMeal)}
                            />

                            <ReservationSection
                                title="Permanece"
                                sections={buildSimpleSection("Total", active)}
                            />
                        </View>
                    </ScrollView>
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
});