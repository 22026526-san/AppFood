// components/navigations/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Cart') iconName = 'cart';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f97316', 
        tabBarInactiveTintColor: '#8f8f8fff', 
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{title: "Home"}}/>
      <Tab.Screen name="Cart" component={CartScreen} options={{title: "Cart"}}/>
    </Tab.Navigator>
  );
};

export default MainTabNavigator;