// components/navigations/AppNavigator.js
import React from 'react';
import { useAuth, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import LoadingScreen from '../screens/LoadingScreen'; 
import CartScreen from '../screens/CartScreen'; 

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <>
      <SignedIn>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Đây là màn hình có Tab bar */}
          <Stack.Screen name="Main" component={MainTabNavigator} />

          {/* Các màn hình không có Tab bar */}
          <Stack.Screen name="Cart" component={CartScreen}/>
        </Stack.Navigator>
      </SignedIn>
      <SignedOut>
        <AuthNavigator />
      </SignedOut>
    </>
  );
};

export default AppNavigator;