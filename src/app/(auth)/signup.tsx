import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
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

const Signup = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(true);
  const [errors, setErrors] = useState({ name: "", phone: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let valid = true;
    let newErrors = { name: "", phone: "", password: "" };

    if (name.trim().length < 3) {
      newErrors.name = "Full name must be at least 3 characters.";
      valid = false;
    }

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      newErrors.phone = "Enter a valid 11-digit Bangladeshi phone number.";
      valid = false;
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const existingData = await AsyncStorage.getItem("user_accounts");
      const users = existingData ? JSON.parse(existingData) : [];
      const userExists = users.some((user: any) => user.phone === phone);

      if (userExists) {
        setErrors((prev) => ({
          ...prev,
          phone: "This phone number is already registered.",
        }));
      }

      const newUser = { name, phone, password };

      await AsyncStorage.setItem(
        "user_accounts",
        JSON.stringify([newUser, ...users]),
      );

      await login(newUser);
      router.replace("/");
    } catch (err) {
      console.error("Signup Error: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Create Account" />
      </Appbar.Header>

      <View style={styles.formContainer}>
        <Text variant="headlineSmall" style={styles.formTitle}>
          Join TicketLine
        </Text>
        <Text variant="bodyMedium" style={styles.formSubtitle}>
          Start your journey with us
        </Text>

        <View style={styles.formBody}>
          <TextInput
            mode="outlined"
            label="Full Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors({ ...errors, name: "" });
            }}
            left={<TextInput.Icon icon="account" />}
            error={!!errors.name}
          />
          {errors.name && (
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>
          )}

          <TextInput
            mode="outlined"
            label="Phone Number"
            placeholder="017XXXXXXXX"
            maxLength={11}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setErrors({ ...errors, phone: "" });
            }}
            left={<TextInput.Icon icon="phone" />}
            error={!!errors.phone}
          />
          {errors.phone && (
            <HelperText type="error" visible={!!errors.phone}>
              {errors.phone}
            </HelperText>
          )}

          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: "" });
            }}
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
            onPress={handleSignup}
            contentStyle={{ height: 50 }}
            style={styles.button}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Signup
          </Button>
        </View>

        <View style={styles.footer}>
          <Text>Already have an account?</Text>
          <Button onPress={() => router.navigate("/login")}>Login</Button>
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

export default Signup;
