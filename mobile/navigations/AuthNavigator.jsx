
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import GetStartScreen from '../screens/GetStartScreen';
import LogIn from '../screens/Login';
import SignUp from '../screens/SignUp';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: fasle }}>
      <Stack.Screen name="GetStarted" component={GetStartScreen}/>
      <Stack.Screen name="Login" component={LogIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;