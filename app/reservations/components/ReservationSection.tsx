import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Reservation from "../types/reservation";
import SectionBlock from "./SectionBlock";

type Section = {
  title: string;
  data: Reservation[];
};

type ReservationSectionProps = {
  title: string;
  sections: Section[];
};

export default function ReservationSection({ title, sections }: ReservationSectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <View style={styles.section}>
      {/* Cabeçalho com toggle */}
      <TouchableOpacity
        onPress={() => setOpen((prev) => !prev)}
        style={styles.sectionHeader}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <FontAwesome5
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color="#333"
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.sectionContent}>
          {sections.map((section) => (
            <SectionBlock
              key={section.title}
              title={section.title}
              data={section.data}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  sectionHeader: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  sectionContent: {
    padding: 12,
    backgroundColor: "#fafafa",
  },
});
