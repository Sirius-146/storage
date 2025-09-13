import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Reservation from "../types/reservation";

type SectionBlockProps = {
  title: string;
  data: Reservation[];
};

export default function SectionBlock({ title, data }: SectionBlockProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.apartment.number} ({item.guests}) - {item.client.name}
          </Text>
        )}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma reserva nesta seção.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  item: { fontSize: 15, paddingVertical: 2, paddingHorizontal: 8 },
  empty: { marginTop: 10, fontSize: 14, color: "#777", textAlign: "center" },
});
