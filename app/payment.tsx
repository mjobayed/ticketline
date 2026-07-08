import { useBooking } from "@/context/BookingContext";
import { generateTxnId } from "@/data/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  Button,
  HelperText,
  IconButton,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Step = "SELECT" | "ACCOUNT" | "PIN" | "OTP" | "SUCCESS";

const INVALID_PHONE = "01712121212";
const INVALID_PIN = "121212";
const INVALID_OTP = "121212";

const Payment = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { totalPrice, selectedBus, selectedSeats, tripDetails, setTxnId } =
    useBooking();
  const [step, setStep] = useState<Step>("SELECT");
  const [method, setMethod] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(120);

  useEffect(() => {
    let interval: NodeJS.Timeout | number;
    if (step === "OTP" && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const saveTicketHistory = async (newTxn: string) => {
    try {
      const ticketObject = {
        txnId: newTxn,
        bus: selectedBus,
        seats: selectedSeats,
        trip: tripDetails,
        amount: totalPrice,
        method: method?.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };

      const existingData = await AsyncStorage.getItem("ticket_history");
      const history = existingData ? JSON.parse(existingData) : [];
      await AsyncStorage.setItem(
        "ticket_history",
        JSON.stringify([ticketObject, ...history]),
      );
    } catch (err) {
      console.error("Storage Error: ", err);
    }
  };

  const validateAndProceed = () => {
    setError(null);
    setLoading(true);

    setTimeout(async () => {
      setLoading(false);

      if (step === "ACCOUNT") {
        const phoneRegex = /^01[3-9]\d{8}$/;

        if (!phoneRegex.test(phone)) {
          setError("Enter a valid 11-digit Bangladeshi phone number.");
        } else if (phone === INVALID_PHONE) {
          setError("This account is not registered with " + method?.name);
        } else {
          setStep("PIN");
        }
      } else if (step === "PIN") {
        if (pin === INVALID_PIN) {
          setError("Incorrect PIN, Please try again.");
        } else {
          setStep("OTP");
        }
      } else if (step === "OTP") {
        if (otp.length !== 6) {
          setError("OTP must be 6 digits.");
        } else if (otp === INVALID_OTP) {
          setError("Invalid OTP. Please check your messages.");
        } else {
          const newTxn = generateTxnId();
          setTxnId(newTxn);
          await saveTicketHistory(newTxn);

          setStep("SUCCESS");
          setTimeout(() => router.navigate("/ticket"), 2500);
        }
      }
    }, 1000);
  };

  const methods = [
    {
      name: "bKash",
      icon: require("../assets/images/bkash.png"),
    },
    {
      name: "Nagad",
      icon: require("../assets/images/nagad.webp"),
    },
    {
      name: "Rocket",
      icon: require("../assets/images/rocket.png"),
    },
    {
      name: "Upay",
      icon: require("../assets/images/upay.png"),
    },
  ];
  return (
    <Surface style={[styles.rootContainer, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        {step !== "SUCCESS" && (
          <Appbar.BackAction
            onPress={() => {
              setError(null);
              step === "SELECT" ? router.back() : setStep("SELECT");
            }}
          />
        )}
        <Appbar.Content title="Payment" />
        <Appbar.Action icon="home" onPress={() => router.navigate("/")} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {step === "SUCCESS" ? (
          <View style={styles.successWrapper}>
            <Avatar.Icon size={100} icon="check-decagram" />
            <Text variant="headlineMedium" style={styles.successTitle}>
              Payment Successful!
            </Text>
            <Text variant="bodyLarge" style={styles.successSubtitle}>
              Your seats are now confirmed!
            </Text>
            <ActivityIndicator
              animating={true}
              style={{ marginTop: 30 }}
              color={theme.colors.primary}
            />
            <Text variant="labelSmall" style={styles.successGenerating}>
              GENERATING TICKETS...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <Text variant="labelLarge" style={styles.summaryLabel}>
                PAYING FOR TICKETLINE
              </Text>
              <Text
                variant="displayMedium"
                style={[styles.summaryPrice, { color: theme.colors.primary }]}
              >
                {totalPrice}
              </Text>
              <View style={styles.secureRow}>
                <IconButton icon="lock" size={16} style={{ margin: 0 }} />
                <Text variant="labelSmall">SECURED TRANSACTION</Text>
              </View>
            </View>

            {step === "SELECT" ? (
              <View style={styles.selectionGrid}>
                <Text variant="titleMedium" style={styles.selectionTitle}>
                  Select Payment Provider
                </Text>
                <View style={styles.grid}>
                  {methods.map((m) => (
                    <View key={m.name} style={styles.gridItem}>
                      <Surface
                        style={styles.iconSurface}
                        onStartShouldSetResponder={() => true}
                        onResponderRelease={() => {
                          setMethod(m);
                          setStep("ACCOUNT");
                        }}
                      >
                        <Avatar.Image
                          size={64}
                          source={m.icon}
                          style={styles.avatar}
                        />
                      </Surface>
                      <Text variant="labelLarge" style={styles.methodLabel}>
                        {m.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Surface style={styles.getwayCard}>
                <View style={styles.getwayHeader}>
                  <Text variant="titleMedium" style={styles.getwayTitle}>
                    {method?.name} Portal
                  </Text>
                </View>

                <View style={styles.getwayBody}>
                  {step === "ACCOUNT" && (
                    <View>
                      <TextInput
                        mode="outlined"
                        label="Mobile Number"
                        placeholder="017XXXXXXXX"
                        keyboardType="phone-pad"
                        maxLength={11}
                        value={phone}
                        onChangeText={(text) => {
                          setPhone(text);
                          setError(null);
                        }}
                        error={!!error}
                      />
                      <HelperText type="error" visible={!!error}>
                        {error}
                      </HelperText>
                      <Button
                        mode="contained"
                        loading={loading}
                        style={styles.actionButton}
                        disabled={phone.length < 11 || loading}
                        onPress={validateAndProceed}
                      >
                        Proceed
                      </Button>
                    </View>
                  )}

                  {step === "PIN" && (
                    <View>
                      <TextInput
                        mode="outlined"
                        label="Account PIN"
                        secureTextEntry
                        keyboardType="number-pad"
                        value={pin}
                        onChangeText={(text) => {
                          setPin(text);
                          setError(null);
                        }}
                        error={!!error}
                      />
                      <HelperText type="error" visible={!!error}>
                        {error}
                      </HelperText>
                      <Button
                        mode="contained"
                        loading={loading}
                        style={styles.actionButton}
                        disabled={!pin || loading}
                        onPress={validateAndProceed}
                      >
                        Verify PIN
                      </Button>
                    </View>
                  )}

                  {step === "OTP" && (
                    <View>
                      <TextInput
                        mode="outlined"
                        label="6-Digit OTP"
                        placeholder="XXXXXX"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={otp}
                        onChangeText={(text) => {
                          setOtp(text);
                          setError(null);
                        }}
                        error={!!error}
                      />
                      <HelperText type="error" visible={!!error}>
                        {error}
                      </HelperText>

                      <View style={styles.timerRow}>
                        {otpTimer > 0 ? (
                          <Text variant="bodySmall">
                            Resend OTP in{" "}
                            <Text
                              style={{
                                color: theme.colors.primary,
                                fontWeight: "bold",
                              }}
                            >
                              {formatTime(otpTimer)}
                            </Text>
                          </Text>
                        ) : (
                          <Button
                            mode="text"
                            compact
                            onPress={() => setOtpTimer(120)}
                          >
                            Resend OTP
                          </Button>
                        )}
                      </View>
                      <Button
                        mode="contained"
                        loading={loading}
                        style={styles.actionButton}
                        disabled={otp.length < 6 || loading}
                        onPress={validateAndProceed}
                      >
                        Complete Payment
                      </Button>
                    </View>
                  )}
                </View>
              </Surface>
            )}
          </>
        )}
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootContainer: { flex: 1 },
  scrollContainer: { padding: 20 },
  summaryCard: {
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 10,
  },

  summaryLabel: {
    letterSpacing: 2,
    marginBottom: 4,
  },

  summaryPrice: { fontWeight: "900" },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.6,
  },

  selectionGrid: { marginTop: 20 },
  selectionTitle: {
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },

  gridItem: {
    width: "40%",
    alignItems: "center",
    marginBottom: 25,
  },

  iconSurface: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 10,
  },

  avatar: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  methodLabel: { fontWeight: "600" },
  getwayCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 10,
  },

  getwayHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  getwayTitle: { fontWeight: "bold" },
  getwayBody: { padding: 20 },
  actionButton: {
    marginTop: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  timerRow: {
    alignItems: "center",
    marginBottom: 15,
  },

  successWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },

  successTitle: {
    fontWeight: "bold",
    marginTop: 20,
  },

  successSubtitle: {
    opacity: 0.6,
    marginTop: 5,
  },

  successGenerating: {
    marginTop: 10,
    opacity: 0.5,
  },
});

export default Payment;
