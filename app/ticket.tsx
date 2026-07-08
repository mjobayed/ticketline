import { useBooking } from "@/context/BookingContext";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Divider,
  IconButton,
  Modal,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";

const Ticket = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { txnId, selectedBus, selectedSeats, tripDetails, totalPrice } =
    useBooking();
  const viewShotRef = useRef<View>(null);
  const [showQR, setShowQR] = useState(false);
  if (!selectedBus || !tripDetails) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const qrValue = useMemo(() => {
    return JSON.stringify({
      t: txnId,
      b: selectedBus.busNumber,
      s: selectedSeats,
      r: `${tripDetails.from}-${tripDetails.to}`,
      d: `${tripDetails.day} ${tripDetails.month}`,
    });
  }, [txnId, selectedBus, selectedSeats, tripDetails]);

  const handleSaveImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Enable gallery access to save your ticket.",
        );
        return;
      }

      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 0.9,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success!", "Ticket saved to gallery for offline boarding.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save ticket image.");
    }
  };

  const handleDone = () => {
    router.replace("/");
  };

  const InfoBlock = ({
    label,
    value,
    align = "flex-start",
  }: {
    label: string;
    value: string;
    align?: any;
  }) => (
    <View style={[styles.infoBlock, { alignItems: align }]}>
      <Text variant="labelSmall" style={styles.routeLabel}>
        {label}
      </Text>
      <Text variant="bodyMedium" style={styles.boldText}>
        {value}
      </Text>
    </View>
  );

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        <Appbar.Content title="Ticket" />
        <Appbar.Action icon="home" onPress={() => router.navigate("/")} />
        <Appbar.Action icon="download" onPress={handleSaveImage} />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card ref={viewShotRef} mode="outlined">
          <View>
            <View style={styles.ticketTop}>
              <View style={styles.headerRow}>
                <View>
                  <Text variant="headlineSmall" style={styles.brandText}>
                    TicketLine
                  </Text>
                  <Text variant="labelSmall" style={{ opacity: 0.6 }}>
                    OFFICIAL BOARDING PASS
                  </Text>
                </View>
                <Avatar.Image
                  size={50}
                  source={require("../assets/images/icon.png")}
                  style={{ backgroundColor: "#25232a" }}
                />
              </View>
              <View
                style={[
                  { backgroundColor: theme.colors.secondaryContainer },
                  styles.txnBadge,
                ]}
              >
                <Text variant="labelMedium">TXN ID: {txnId}</Text>
              </View>
            </View>

            <Divider />

            <View style={styles.ticketBottom}>
              <View style={styles.routeRow}>
                <View>
                  <Text variant="labelSmall" style={styles.routeLabel}>
                    FROM
                  </Text>
                  <Text variant="titleLarge" style={styles.routeText}>
                    {tripDetails.from}
                  </Text>
                </View>
                <IconButton
                  icon="bus-double-decker"
                  size={24}
                  iconColor={theme.colors.primary}
                />
                <View>
                  <Text variant="labelSmall" style={styles.routeLabel}>
                    TO
                  </Text>
                  <Text variant="titleLarge" style={styles.routeText}>
                    {tripDetails.to}
                  </Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.infoGrid}>
                <InfoBlock
                  label="DATE"
                  value={`${tripDetails.day} ${tripDetails.month}`}
                />
                <InfoBlock label="DEPARTURE" value={selectedBus.startingTime} />
              </View>

              <View style={styles.infoGrid}>
                <InfoBlock label="BUS OPERATOR" value={selectedBus.company} />
                <InfoBlock label="BUS NO." value={selectedBus.busNumber} />
              </View>

              <View style={styles.infoGrid}>
                <InfoBlock label="SEATS" value={selectedSeats.join(", ")} />
                <InfoBlock label="CLASS" value={selectedBus.type} />
              </View>

              <Divider style={styles.divider} />

              <View style={styles.priceFooter}>
                <Text variant="bodyLarge" style={styles.boldText}>
                  Total Amount Paid
                </Text>
                <Text
                  variant="headlineSmall"
                  style={[styles.boldText, { color: theme.colors.primary }]}
                >
                  ৳{totalPrice}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
      <View style={styles.buttonGroup}>
        <Button
          mode="contained"
          icon="qrcode"
          style={styles.mainButton}
          onPress={() => setShowQR(true)}
        >
          Show QR Code
        </Button>
        <Button mode="outlined" onPress={handleDone} style={styles.mainButton}>
          Back to Home
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showQR}
          onDismiss={() => setShowQR(false)}
          style={[{ backgroundColor: theme.colors.background }, styles.qrModal]}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Boarding QR
          </Text>
          <Surface style={styles.qrSurface}>
            <QRCode
              value={qrValue}
              size={220}
              color="black"
              backgroundColor="white"
            />
          </Surface>
          <Text variant="bodySmall" style={styles.modalNote}>
            Present this code to the bus supervisor
          </Text>
          <Button mode="outlined" onPress={() => setShowQR(false)}>
            Close
          </Button>
        </Modal>
      </Portal>
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },
  scrollContainer: { padding: 20 },
  ticketTop: {
    padding: 24,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brandText: {
    fontWeight: "bold",
    letterSpacing: -0.5,
  },

  txnBadge: {
    marginTop: 15,
    padding: 6,
    alignSelf: "flex-start",
    borderRadius: 4,
  },

  divider: {
    marginVertical: 20,
    opacity: 0.5,
  },

  ticketBottom: { padding: 24 },
  routeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  routeLabel: {
    opacity: 0.4,
    marginBottom: 2,
    fontWeight: "bold",
  },

  routeText: {
    fontWeight: "bold",
    fontSize: 18,
  },

  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoBlock: {
    flex: 1,
    marginBottom: 16,
  },

  boldText: { fontWeight: "bold" },
  priceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  buttonGroup: {
    marginTop: 20,
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  mainButton: {
    borderRadius: 8,
    paddingVertical: 4,
  },

  qrModal: {
    padding: 20,
    alignItems: "center",
  },

  modalTitle: {
    marginBottom: 15,
    fontWeight: "bold",
  },

  qrSurface: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 12,
  },

  modalNote: {
    marginVertical: 15,
    opacity: 0.5,
    textAlign: "center",
  },
});

export default Ticket;
