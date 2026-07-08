import React from "react";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
}) => {
  const theme = useTheme();

  return (
    <Portal>
      <Modal visible={visible}>
        <View style={styles.container}>
          <View
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <ActivityIndicator size={70} />
            <Text style={styles.text}>{message}</Text>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  card: {
    padding: 100,
    borderRadius: 10,
    alignItems: "center",
  },

  text: {
    marginTop: 30,
    fontWeight: "bold",
  },
});

export default LoadingOverlay;
