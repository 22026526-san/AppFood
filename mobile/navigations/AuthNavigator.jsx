
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import GetStartScreen from '../screens/GetStartScreen';
import LogIn from '../screens/Login';
import SignUp from '../screens/SignUp';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import CompleteProfileScreen from '../screens/CompleteProfileScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStarted" component={GetStartScreen}/>
      <Stack.Screen name="Login" component={LogIn} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;