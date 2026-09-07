import InfoCard from "@/components/InfoCard";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useBooking } from "@/context/BookingContext";
import useDelayedNavigation from "@/utils/DelayedNavigation";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Divider,
  Icon,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TicketConfirm = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { selectedBus, tripDetails, selectedSeats, totalPrice } = useBooking();
  const { isLoading, navigateWithDelay } = useDelayedNavigation();
  if (!selectedBus || !tripDetails) return null;
  const { from, to, month, day } = tripDetails;

  const handleConfirm = () => {
    navigateWithDelay("/payment", 1000);
  };

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => {
    return (
      <View style={styles.infoItem}>
        <Icon source={icon} size={20} color={theme.colors.primary} />
        <View style={styles.infoItemText}>
          <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
            {label}
          </Text>
          <Text variant="bodyLarge" style={styles.infoItemValue}>
            {value}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <LoadingOverlay visible={isLoading} message="Loading Payment" />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Confirm ticket" />
        <Appbar.Action icon="home" onPress={() => router.navigate("/")} />
      </Appbar.Header>
      <InfoCard from={from} to={to} month={month} day={day} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card mode="outlined" style={styles.ticketCard}>
          <Card.Content>
            <View style={styles.companyRow}>
              <View>
                <Text variant="titleLarge" style={styles.companyName}>
                  {selectedBus.company}
                </Text>
                <Text
                  variant="labelMedium"
                  style={{ color: theme.colors.outline }}
                >
                  {selectedBus.busNumber}
                </Text>
              </View>
              <Surface style={styles.typeBadge}>
                <Text
                  variant="labelSmall"
                  style={{
                    color:
                      selectedBus.type === "AC"
                        ? theme.colors.primary
                        : theme.colors.error,
                    fontWeight: "bold",
                  }}
                >
                  {selectedBus.type}
                </Text>
              </Surface>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoGrid}>
              <InfoItem
                icon="clock-check-outline"
                label="Reporting"
                value={selectedBus.reportingTime}
              />
              <InfoItem
                icon="bus-clock"
                label="Departure"
                value={selectedBus.startingTime}
              />
            </View>

            <View style={styles.infoGrid}>
              <InfoItem
                icon="map-marker-radius"
                label="Boarding Point"
                value={selectedBus.boardingPoint}
              />
            </View>

            <Divider style={styles.divider} />

            <Text variant="labelLarge" style={styles.seatLabel}>
              Selected Seats
            </Text>
            <View style={styles.seatChipContainer}>
              {selectedSeats.map((seat) => (
                <Surface
                  key={seat}
                  style={[
                    styles.seatChip,
                    {
                      borderColor: theme.colors.outline,
                    },
                  ]}
                >
                  <Text variant="labelMedium">{seat}</Text>
                </Surface>
              ))}
            </View>

            <Divider style={styles.divider} />

            <Text variant="titleMedium">Fare Breakdown</Text>
            <View style={styles.priceRow}>
              <Text variant="bodyMedium">
                {selectedSeats.length}{" "}
                {selectedSeats.length === 1 ? "Ticket" : "Tickets"}
              </Text>
              <Text variant="bodyMedium">৳{totalPrice}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text variant="bodyMedium">Service Fee</Text>
              <Text variant="bodyMedium">৳0</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.priceRow}>
              <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                Total Amount
              </Text>
              <Text
                variant="titleLarge"
                style={{ fontWeight: "bold", color: theme.colors.primary }}
              >
                ৳{totalPrice}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Surface style={styles.bottomBar}>
        <Button
          mode="contained"
          style={styles.confirmButton}
          contentStyle={styles.confirmButtonContent}
          onPress={handleConfirm}
        >
          Confirm & Pay
        </Button>
      </Surface>
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },
  scrollContainer: { paddingHorizontal: 8 },
  ticketCard: { borderRadius: 12 },
  companyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  companyName: { fontWeight: "bold" },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
  },

  divider: { marginVertical: 12 },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  infoItemText: { marginLeft: 8 },
  infoItemValue: { fontWeight: "bold" },

  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  seatLabel: { marginBottom: 12 },
  seatChipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  seatChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  confirmButton: {
    borderRadius: 8,
    minWidth: 120,
  },
  confirmButtonContent: { height: 48 },
});

export default TicketConfirm;
