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
          if (route.name === 'HomeScreen') iconName = 'home-outline';
          else if (route.name === 'FavouriteScreen') iconName = 'heart-outline';
          else if (route.name === 'NoticeScreen') iconName = 'notifications-outline';
          else if (route.name === 'ProfileScreen') iconName = 'person-outline';
          else if (route.name === 'OrderScreen') iconName = 'reader-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f97416cf',
        tabBarInactiveTintColor: '#8f8f8f91',
        headerShown: false,
      })}
    >
      <Tabs.Screen name="HomeScreen" options={{title: ""}}/>
      <Tabs.Screen name="OrderScreen" options={{title: ""}}/>
      <Tabs.Screen name="FavouriteScreen" options={{title: ""}} />
      <Tabs.Screen name="NoticeScreen" options={{title: ""}}/>
      <Tabs.Screen name="ProfileScreen" options={{title: ""}}/>
    </Tabs>
  );
}
