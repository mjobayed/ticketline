import { AuthProvider, useAuth } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";

function NavigationGuard() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, segments]);

  return (
    <Stack>
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="bus-results" options={{ headerShown: false }} />
      <Stack.Screen name="select-seats" options={{ headerShown: false }} />
      <Stack.Screen name="ticket-confirm" options={{ headerShown: false }} />
      <Stack.Screen name="payment" options={{ headerShown: false }} />
      <Stack.Screen name="ticket" options={{ headerShown: false }} />
      <Stack.Screen name="recent-tickets" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <BookingProvider>
          <NavigationGuard />
        </BookingProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
