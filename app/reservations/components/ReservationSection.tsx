import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Reservation from "../types/reservation";

interface Props {
  title: string;
  reservations: Reservation[];
}

export default function ReservationSection({ title, reservations }: Props) {
  const totalApartments = reservations.length;
  const totalGuests = reservations.reduce((sum, r) => sum + r.guests, 0);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.subTitle}>
        {`Apartamentos: ${totalApartments} | Pessoas: ${totalGuests}`}
      </Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.apartment.number} ({item.guests}) - {item.client.name}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  item: {
    fontSize: 16,
    paddingVertical: 4,
  },
});


