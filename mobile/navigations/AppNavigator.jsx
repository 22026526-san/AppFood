// components/navigations/AppNavigator.js
import React from 'react';
import { useAuth, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import LoadingScreen from '../screens/LoadingScreen'; 

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <>
      <SignedIn>
        {/* <MainTabNavigator /> */}
        <AuthNavigator />
      </SignedIn>
      <SignedOut>
        {/* <AuthNavigator /> */}
        <MainTabNavigator />
      </SignedOut>
    </>
  );
};

export default AppNavigator;