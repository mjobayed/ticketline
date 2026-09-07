import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  HelperText,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface UserDataType {
  name: string;
  phone: string;
  password: string;
}

const Login = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({ phone: "", password: "" });
  const [allUsers, setAllUsers] = useState<UserDataType[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loadAllAccounts = async () => {
    setFetchingData(true);
    try {
      const data = await AsyncStorage.getItem("user_accounts");
      if (data) {
        setAllUsers(JSON.parse(data));
      }
    } catch (err) {
      console.error("Falied to load user data", err);
    } finally {
      setFetchingData(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAllAccounts();
    }, []),
  );

  const handleLogin = async () => {
    let valid = true;
    let newErrors = { phone: "", password: "" };

    if (!phone) {
      newErrors.phone = "Phone number is required.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    setIsLoggingIn(true);

    const foundUser = allUsers.find((user) => user.phone === phone);

    if (!foundUser || foundUser.password !== password) {
      newErrors.phone = "Invalid phone or password.";
      newErrors.password = "Invalid phone or password.";
      setErrors(newErrors);
      setIsLoggingIn(false);
      return;
    }

    try {
      await login({ name: foundUser.name, phone: foundUser.phone });
      router.replace("/");
    } catch (err) {
      console.error("Login session failed: ", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        <Appbar.Content title="Welcome Back" />
      </Appbar.Header>

      <View style={styles.formContainer}>
        <Text variant="headlineSmall" style={styles.formTitle}>
          TicketLine
        </Text>
        <Text variant="bodyMedium" style={styles.formSubtitle}>
          Your next journey awaits!
        </Text>

        <View style={{ gap: 8 }}>
          <TextInput
            label="Phone Number"
            placeholder="017XXXXXXXX"
            keyboardType="phone-pad"
            maxLength={11}
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setErrors({ ...errors, phone: "" });
            }}
            mode="outlined"
            left={<TextInput.Icon icon="phone" />}
            error={!!errors.phone}
          />
          {errors.phone && (
            <HelperText type="error" visible={!!errors.phone}>
              {errors.phone}
            </HelperText>
          )}

          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: "" });
            }}
            mode="outlined"
            secureTextEntry={!showPass}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPass ? "eye-off" : "eye"}
                onPress={() => setShowPass(!showPass)}
              />
            }
            error={!!errors.password}
          />

          {errors.password && (
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>
          )}
          <Button
            mode="contained"
            onPress={handleLogin}
            contentStyle={{ height: 50 }}
            style={styles.button}
            disabled={fetchingData || isLoggingIn}
            loading={isLoggingIn}
          >
            Login
          </Button>
        </View>

        <View style={styles.footer}>
          <Text>New to TicketLine?</Text>
          <Button onPress={() => router.navigate("/signup")}>Sign Up</Button>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },

  formContainer: {
    padding: 25,
    flex: 1,
  },

  formTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },

  formSubtitle: {
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 10,
  },

  formBody: {
    gap: 8,
    marginTop: 20,
  },

  button: {
    marginTop: 10,
    borderRadius: 8,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default Login;
