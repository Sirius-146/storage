import { FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type MealTotals = {
    breakfast: { apartments: number; guests: number };
    lunch: { apartments: number; guests: number };
};

type TotalsCardProps = {
    mealTotals: MealTotals;
    totalApartments: number;
    totalGuests: number;
};

export default function TotalsCard({
    mealTotals,
    totalApartments,
    totalGuests
}: TotalsCardProps){
    const [showTotals, setShowTotals] = useState(false)
    return (
        <View>
            {/* Footer com total de apts e hóspedes */}
            <TouchableOpacity style={styles.footer} onPress={() => setShowTotals((prev) => !prev)}>
                <FontAwesome5
                    name={showTotals ? null : "chevron-up"}
                    size={16}
                    color="#333"
                />
                <Text style={styles.footerText}>
                    Apartamentos: {totalApartments} | Total hóspedes: {totalGuests}
                </Text>
            </TouchableOpacity>
            
            {/* Modal com total por refeição */}
            {showTotals && (
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.pressable} onPress={() => setShowTotals(false)}>
                        <FontAwesome5
                            name={showTotals ? "chevron-down" : null}
                            size={16}
                            color="#333"
                        />
                        <Text style={styles.cardText}>
                            Café da manhã: {mealTotals.breakfast.apartments} apts | {mealTotals.breakfast.guests} hóspedes
                        </Text>
                        <Text style={styles.cardText}>
                            Almoço: {mealTotals.lunch.apartments} apts | {mealTotals.lunch.guests} hóspedes
                        </Text>
                        <Text style={styles.cardText}>
                            Jantar: {totalApartments} apts | {totalGuests} hóspedes
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: '#5fbcffff',
    },
    footerText: { fontSize: 16, fontWeight: "500" },
    modalOverlay: {
        marginBottom: 45,
        justifyContent: "center",
        paddingBottom: 5,
        backgroundColor: '#f2f1f1ff'
    },
    pressable:{
        alignItems: "center",
    },
    cardText:{
        width: 300,
        fontSize: 16,
        padding: 4,
        margin: 4,
        borderWidth: 1,
        borderColor: '#2f95dc',
        borderRadius: 10
    }
})