import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import LoadingScreen from "../../components/LoadingScreen";

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <LoadingScreen />; 

  if (isSignedIn) {
    return <Redirect href="/(tabs)/HomeScreen" />; 
  }

  return (
    <Stack>
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" options={{ headerShown: false }} />
      <Stack.Screen name="GetStartScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPasswordScreen" options={{ headerShown: false }} />
      <Stack.Screen name="CompleteProfileScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
