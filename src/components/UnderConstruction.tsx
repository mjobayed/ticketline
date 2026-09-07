import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Surface, Text, useTheme } from "react-native-paper";

const UnderConstruction = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Surface style={styles.rootSurface}>
      <View style={styles.mainSection}>
        <Avatar.Icon
          size={120}
          icon="hammer-wrench"
          style={{ backgroundColor: theme.colors.primaryContainer }}
          color={theme.colors.primary}
        />

        <View style={styles.bodyContent}>
          <Text variant="headlineMedium" style={styles.bodyTitle}>
            Under Construction
          </Text>
          <Text variant="bodyLarge" style={styles.bodyText}>
            Fueling the bus and printing the tickets. This page will be ready
            for your next journey!
          </Text>
        </View>

        <Button
          mode="contained-tonal"
          onPress={() => router.back()}
          style={styles.backButton}
          icon="arrow-left"
        >
          Go Back
        </Button>
      </View>

      <View style={styles.footerContainer}>
        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
          {Constants.expoConfig?.name} v{Constants.expoConfig?.version}
        </Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },
  mainSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  bodyContent: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },

  bodyTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },

  bodyText: { textAlign: "center" },
  backButton: { paddingHorizontal: 16 },

  footerContainer: {
    alignItems: "center",
    paddingBottom: 16,
  },
});

export default UnderConstruction;
