import { getSeatLabel } from "@/data/data";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";

interface SeatLayoutProps {
  totalSeats: number;
  unavailableSeats: string[];
  onSelectionChange: (selected: string[]) => void;
}

const SeatLayout: React.FC<SeatLayoutProps> = ({
  totalSeats,
  unavailableSeats,
  onSelectionChange,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const theme = useTheme();

  const toggleSeat = (label: string) => {
    let newSelection = [...selectedSeats];

    if (newSelection.includes(label)) {
      newSelection = newSelection.filter((item) => item !== label);
    } else {
      newSelection.push(label);
    }
    setSelectedSeats(newSelection);
    onSelectionChange(newSelection);
  };

  const renderSeat = (index: number) => {
    const label = getSeatLabel(index);
    const isUnavailable = unavailableSeats.includes(label);
    const isSelected = selectedSeats.includes(label);

    return (
      <Button
        key={label}
        mode={isSelected ? "contained" : "outlined"}
        disabled={isUnavailable}
        onPress={() => toggleSeat(label)}
        style={[
          styles.seat,
          isUnavailable && { backgroundColor: theme.colors.surface },
        ]}
        labelStyle={styles.seatLabel}
        contentStyle={styles.seatContent}
      >
        {label}
      </Button>
    );
  };

  const rows = [];
  for (let i = 0; i < totalSeats; i += 4) {
    rows.push(
      <View key={`row-${i}`} style={styles.row}>
        {renderSeat(i)}
        {renderSeat(i + 1)}
        <View style={{ width: 40 }} />
        {renderSeat(i + 2)}
        {renderSeat(i + 3)}
      </View>,
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={[
          styles.busChasis,
          {
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.driverSection,
            {
              borderBottomColor: theme.colors.outline,
            },
          ]}
        >
          <Text variant="labelSmall" style={styles.driverText}>
            Entry
          </Text>
          <IconButton icon="steering" size={30} style={styles.steering} />
        </View>
        {rows}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
  },

  busChasis: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    width: "100%",
  },

  driverSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },

  driverText: { fontWeight: "bold" },
  steering: { margin: 0 },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    alignItems: "center",
  },

  seat: {
    marginHorizontal: 2,
    borderRadius: 8,
  },

  seatLabel: { fontSize: 12 },
  seatContent: { height: 45 },
});

export default SeatLayout;
