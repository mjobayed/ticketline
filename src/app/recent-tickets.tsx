import LoadingOverlay from "@/components/LoadingOverlay";
import { useBooking } from "@/context/BookingContext";
import useDelayedNavigation from "@/utils/DelayedNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Divider,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TicketHistoryItem {
  txnId: string;
  bus: any;
  seats: string[];
  trip: any;
  amount: number;
  method: string;
  date: string;
  time: string;
}

const RecentTickets = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { setBus, setSeats, setTripDetails, setTotalPrice, setTxnId } =
    useBooking();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<TicketHistoryItem[]>([]);
  const { isLoading, navigateWithDelay } = useDelayedNavigation();

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem("ticket_history");
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const handleViewTicket = (item: TicketHistoryItem) => {
    setBus(item.bus);
    setSeats(item.seats);
    setTripDetails(item.trip);
    setTotalPrice(item.amount);
    setTxnId(item.txnId);
    navigateWithDelay("/ticket", 1000);
  };

  const renderTicketItem = ({ item }: { item: TicketHistoryItem }) => (
    <Card
      mode="outlined"
      style={styles.card}
      onPress={() => handleViewTicket(item)}
    >
      <Card.Content>
        <View style={styles.cardTitle}>
          <View>
            <Text variant="titleMedium" style={styles.routeText}>
              {item.trip.from} to {item.trip.to}
            </Text>
            <Text variant="bodySmall" style={styles.dateText}>
              {item.trip.day} {item.trip.month} • {item.bus.startingTime}
            </Text>
          </View>
          <View
            style={[
              { backgroundColor: theme.colors.secondaryContainer },
              styles.amountBadge,
            ]}
          >
            <Text variant="labelLarge" style={{ color: theme.colors.error }}>
              ৳{item.amount}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Text variant="labelSmall" style={styles.footerLabel}>
              OPERATOR
            </Text>
            <Text variant="bodySmall" style={styles.footerText}>
              {item.bus.company}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text variant="labelSmall" style={styles.footerLabel}>
              BUS NO.
            </Text>
            <Text variant="bodySmall" style={styles.footerText}>
              {item.bus.busNumber}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Text variant="labelSmall" style={styles.footerLabel}>
              SEATS
            </Text>
            <Text variant="bodySmall" style={styles.footerText}>
              {item.seats.join(", ")}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text variant="labelSmall" style={styles.footerLabel}>
              TYPE
            </Text>
            <Text variant="bodySmall" style={styles.footerText}>
              {item.bus.type}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <LoadingOverlay visible={isLoading} message="Loading Ticket" />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Recent Tickets" />
        <Appbar.Action icon="home" onPress={() => router.navigate("/")} />
      </Appbar.Header>

      {history.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Avatar.Icon size={80} icon="ticket-outline" />
          <Text variant="titleLarge" style={styles.emptyTitle}>
            No Tickets Yet
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtitle}>
            Your booked tickets will appear here
          </Text>
          <Button
            mode="contained"
            onPress={() => router.navigate("/")}
            style={styles.emptyButton}
          >
            Book Now
          </Button>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.txnId}
          renderItem={renderTicketItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  emptyTitle: {
    marginTop: 20,
    fontWeight: "bold",
  },

  emptySubtitle: {
    opacity: 0.5,
    textAlign: "center",
    marginTop: 8,
  },

  emptyButton: {
    marginTop: 24,
    borderRadius: 8,
  },

  listContainer: { padding: 16 },
  card: { marginBottom: 16 },
  cardTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  routeText: { fontWeight: "bold" },
  dateText: {
    opacity: 0.6,
    marginTop: 2,
  },

  amountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  divider: {
    marginVertical: 12,
    opacity: 0.6,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerItem: { flex: 1 },
  footerLabel: {
    opacity: 0.4,
    fontSize: 9,
  },

  footerText: {
    fontWeight: "bold",
    marginTop: 2,
  },
});

export default RecentTickets;
