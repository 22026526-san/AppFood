import React from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import AppNavigator from './navigations/AppNavigator'; 
import { NavigationContainer } from '@react-navigation/native';


const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ClerkProvider>
  );
}