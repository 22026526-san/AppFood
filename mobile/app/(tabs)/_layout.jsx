import {  Tabs,Redirect } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "@clerk/clerk-expo";

export default function TabLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) return <Redirect href={"/(auth)/Login"} />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'HomeScreen') iconName = 'home';
          else if (route.name === 'FavouriteScreen') iconName = 'heart';
          else if (route.name === 'NoticeScreen') iconName = 'notifications';
          else if (route.name === 'ProfileScreen') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f97416cf',
        tabBarInactiveTintColor: '#8f8f8f91',
        headerShown: false,
      })}
    >
      <Tabs.Screen name="HomeScreen" options={{title: "Home"}}/>
      <Tabs.Screen name="FavouriteScreen" options={{title: "Favourite"}} />
      <Tabs.Screen name="NoticeScreen" options={{title: "Notice"}}/>
      <Tabs.Screen name="ProfileScreen" options={{title: "Profile"}}/>
    </Tabs>
  );
}
