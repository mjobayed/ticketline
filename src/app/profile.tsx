import LoadingOverlay from "@/components/LoadingOverlay";
import { useAuth } from "@/context/AuthContext";
import useDelayedNavigation from "@/utils/DelayedNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  List,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [ticketCount, setTicketCount] = useState(0);
  const { isLoading, navigateWithDelay } = useDelayedNavigation();

  useEffect(() => {
    const getStats = async () => {
      try {
        const history = await AsyncStorage.getItem("ticket_history");
        if (history) {
          const parsed = JSON.parse(history);
          setTicketCount(parsed.length);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getStats();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await logout();
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <LoadingOverlay visible={isLoading} message="Loading recent tickets" />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="My Profile" />
        <Appbar.Action icon="home" onPress={() => router.navigate("/")} />
      </Appbar.Header>

      <ScrollView>
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={user.name.substring(0, 2).toUpperCase() || "U"}
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.primary}
          />
          <Text variant="headlineSmall" style={styles.userName}>
            {user.name}
          </Text>
          <Text variant="bodyMedium" style={styles.userPhone}>
            +88 {user.phone}
          </Text>

          <View
            style={[
              { backgroundColor: theme.colors.onSecondary },
              styles.statsRow,
            ]}
          >
            <View style={styles.statsBox}>
              <Text
                variant="titleLarge"
                style={{ fontWeight: "bold", color: theme.colors.primary }}
              >
                {ticketCount}
              </Text>
              <Text variant="labelSmall" style={styles.statsLabel}>
                TRIPS
              </Text>
            </View>
            <View
              style={[
                styles.statsDivider,
                { backgroundColor: theme.colors.primary },
              ]}
            />
            <View style={styles.statsBox}>
              <Text
                variant="titleLarge"
                style={{ fontWeight: "bold", color: theme.colors.primary }}
              >
                GOLD
              </Text>
              <Text variant="labelSmall" style={styles.statsLabel}>
                MEMBER
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="labelLarge" style={styles.sectionTitle}>
            Travel Management
          </Text>
          <Surface style={styles.sectionSurface}>
            <List.Item
              title="Booking History"
              description="View and download old tickets"
              left={(props) => <List.Icon {...props} icon="ticket-account" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigateWithDelay("/recent-tickets", 1000)}
            />
          </Surface>
        </View>

        <View style={styles.section}>
          <Button
            mode="contained-tonal"
            onPress={handleLogout}
            icon="logout"
            buttonColor={theme.colors.errorContainer}
            textColor={theme.colors.error}
            style={styles.logoutButton}
          >
            Logout Session
          </Button>
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
          TicketLine v{Constants.expoConfig?.version}
        </Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },
  header: {
    alignItems: "center",
    paddingVertical: 30,
  },

  userName: {
    fontWeight: "bold",
    marginTop: 15,
  },

  userPhone: {
    opacity: 0.5,
    letterSpacing: 1.1,
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 25,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },

  statsBox: { alignItems: "center" },
  statsLabel: {
    opacity: 0.5,
    fontSize: 10,
    fontWeight: "bold",
  },

  statsDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 30,
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },

  sectionTitle: {
    marginBottom: 10,
    marginLeft: 5,
    opacity: 0.6,
    fontWeight: "bold",
  },

  sectionSurface: { borderRadius: 16 },
  logoutButton: {
    borderRadius: 12,
    paddingVertical: 4,
  },

  footerContainer: {
    alignItems: "center",
    paddingBottom: 16,
  },
});

export default Profile;
