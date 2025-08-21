import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import LoadingScreen from "../../components/LoadingScreen";
import { UserContext } from '../../services/UserContextAPI'
import { useContext } from 'react';
import { useClerk } from '@clerk/clerk-expo'
import { Alert } from 'react-native';

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { role, active } = useContext(UserContext);
  const { signOut } = useClerk();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (active === 0) {
    signOut();
    Alert.alert(
      "Tài khoản của bạn đã bị khóa",
      "Vui lòng liên hệ quản trị viên để biết thêm chi tiết.",
    );
  }

  if (isSignedIn) {
    if (role === 'manager') {
      return <Redirect href="/(adminTabs)/DashboardScreen" />;
    } else if (role === 'customer') {
      return <Redirect href="/(tabs)/HomeScreen" />;
    } else {
      return <LoadingScreen />;
    }
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
