import {  Tabs,Redirect } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "@clerk/clerk-expo";
import { View } from "react-native";

export default function AdminTab() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) return <Redirect href={"/(auth)/Login"} />;

  return (
    <Tabs
      style ={{height:56}}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'DashboardScreen') iconName = 'grid-outline';
          else if (route.name === 'FoodListScreen') iconName = 'menu-outline';
          else if (route.name === 'AddNewItem') iconName = 'add-outline';
          else if (route.name === 'NoticeScreen') iconName = 'notifications-outline';
          else if (route.name === 'AdminProfile') iconName = 'person-outline';

          if (route.name === "AddNewItem") {
            return (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 27.5,
                  borderWidth: 2,
                  borderColor: "#f97416cf",
                  backgroundColor: "rgba(249, 116, 22, 0.05)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name={iconName} size={28} color="#f97416cf" />
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f97416cf',
        tabBarInactiveTintColor: '#8f8f8f91',
        headerShown: false,
      })}
    >
      <Tabs.Screen name="DashboardScreen" options={{title: ''}}/>
      <Tabs.Screen name="FoodListScreen" options={{title: ''}}/>
      <Tabs.Screen name="AddNewItem" options={{title: ''}} />
      <Tabs.Screen name="NoticeScreen" options={{title: ''}}/>
      <Tabs.Screen name="AdminProfile" options={{title: ''}}/>
    </Tabs>
  );
}
