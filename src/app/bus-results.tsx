import InfoCard from "@/components/InfoCard";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useBooking } from "@/context/BookingContext";
import { BusTicketData, generateBusData, TripDetailsType } from "@/data/data";
import useDelayedNavigation from "@/utils/DelayedNavigation";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  Appbar,
  Card,
  Divider,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BusResults = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const [buses, setBuses] = useState<BusTicketData[]>([]);
  const { tripDetails, setBus, setTripDetails, setTotalPrice, setSeats } =
    useBooking();
  const { isLoading, navigateWithDelay } = useDelayedNavigation();
  if (!tripDetails) return null;
  const { from, to, month, day } = tripDetails;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const criteria: TripDetailsType = {
      from,
      to,
      month,
      day,
    };

    const data = generateBusData(criteria);
    setBuses(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardPress = (item: BusTicketData) => {
    setTripDetails({ from, to, month, day });
    setBus(item);
    setTotalPrice(0);
    setSeats([]);
    navigateWithDelay("/select-seats", 1000);
  };

  const renderBusCard: ListRenderItem<BusTicketData> = ({ item }) => {
    const availableSeats = item.totalSeats - item.unavailableSeats.length;

    return (
      <Pressable onPress={() => handleCardPress(item)}>
        <Card mode="outlined" style={styles.busCard}>
          <Card.Content>
            <View>
              <Text variant="titleMedium">{item.company}</Text>
            </View>
            <View style={styles.busCardSubtitle}>
              <Text variant="labelSmall">{item.busNumber}</Text>
              <Text
                style={{
                  color:
                    item.type === "AC"
                      ? theme.colors.primary
                      : theme.colors.error,
                  fontWeight: "bold",
                }}
              >
                {" • "}
                {item.type}
              </Text>
            </View>
            <View style={styles.busCardBody}>
              <View style={styles.busCardTime}>
                <Text
                  variant="titleMedium"
                  style={{ fontWeight: "bold", color: theme.colors.primary }}
                >
                  {item.startingTime}
                </Text>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.secondary }}
                >
                  (Rep: {item.reportingTime})
                </Text>
              </View>
              <View>
                <Text
                  variant="titleMedium"
                  style={{ fontWeight: "bold", color: theme.colors.primary }}
                >
                  Boarding Point
                </Text>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.secondary }}
                >
                  {item.boardingPoint}
                </Text>
              </View>
            </View>

            <Divider style={styles.busCardDivider} />

            <View style={styles.busCardFooter}>
              <View>
                <Text
                  variant="titleLarge"
                  style={{ fontWeight: "bold", color: theme.colors.primary }}
                >
                  ৳{item.price}
                </Text>
              </View>
              <View>
                <Text style={{ color: theme.colors.error }}>
                  {availableSeats} Seats Left
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Pressable>
    );
  };

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <LoadingOverlay visible={isLoading} message="Loading seat layout" />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Pick a bus" />
        <Appbar.Action icon="home" onPress={() => router.navigate("/")} />
      </Appbar.Header>
      <InfoCard from={from} to={to} month={month} day={day} />

      <View style={styles.listContainer}>
        <FlatList
          data={buses}
          keyExtractor={(item) => item.busId}
          renderItem={renderBusCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: {
    flex: 1,
  },

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

  listContainer: {
    flex: 1,
  },

  listContent: {
    padding: 8,
  },

  busCard: {
    marginBottom: 8,
  },

  busCardSubtitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  busCardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },

  busCardTime: {
    flex: 1,
    alignItems: "flex-start",
  },

  busCardDivider: {
    marginBottom: 12,
  },

  busCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default BusResults;
