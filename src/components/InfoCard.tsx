import { TripDetailsType } from "@/data/data";
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

const InfoCard: React.FC<TripDetailsType> = ({ from, to, month, day }) => {
  return (
    <Card mode="elevated" style={styles.infoCard}>
      <Card.Content style={styles.infoCardContent}>
        <Text style={styles.infoCardPrimary}>
          {from} To {to}
        </Text>
        <Text style={styles.infoCardSecondary}>
          {month} {day}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    borderRadius: 0,
  },

  infoCardContent: {
    alignSelf: "center",
  },

  infoCardPrimary: {
    fontSize: 15,
    fontWeight: "bold",
  },

  infoCardSecondary: {
    alignSelf: "center",
    fontSize: 12,
  },
});

export default InfoCard;
