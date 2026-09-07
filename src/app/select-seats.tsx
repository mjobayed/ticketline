import LoadingOverlay from "@/components/LoadingOverlay";
import SeatLayout from "@/components/SeatLayout";
import { useBooking } from "@/context/BookingContext";
import useDelayedNavigation from "@/utils/DelayedNavigation";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Appbar, Button, Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SelectSeats = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectedBus, selectedSeats, setSeats, setTotalPrice } = useBooking();
  const { isLoading, navigateWithDelay } = useDelayedNavigation();
  if (!selectedBus) return null;
  const currentTotalPrice = selectedSeats.length * selectedBus.price;

  const handleConfirm = () => {
    setTotalPrice(currentTotalPrice);
    navigateWithDelay("/ticket-confirm", 1000);
  };

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <LoadingOverlay visible={isLoading} message="Loading Ticket" />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Select seats" />
        <Appbar.Action icon="home" onPress={() => router.navigate("/")} />
      </Appbar.Header>
      <View style={{ flex: 1 }}>
        <SeatLayout
          totalSeats={selectedBus.totalSeats}
          unavailableSeats={selectedBus.unavailableSeats}
          onSelectionChange={(selected) => setSeats(selected)}
        />
      </View>

      <Surface style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text variant="labelMedium">
            {selectedSeats.length}{" "}
            {selectedSeats.length === 1 ? "Seat" : "Seats"} Selected
          </Text>
          <Text variant="headlineSmall" style={styles.priceText}>
            ৳{currentTotalPrice}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={handleConfirm}
          disabled={selectedSeats.length === 0}
          style={styles.confirmButton}
          contentStyle={styles.confirmButtonContent}
        >
          Confirm
        </Button>
      </Surface>
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: {
    flex: 1,
  },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  priceContainer: { flex: 1 },
  priceText: { fontWeight: "bold" },

  confirmButton: {
    borderRadius: 8,
    minWidth: 120,
  },

  confirmButtonContent: { height: 48 },
});

export default SelectSeats;
