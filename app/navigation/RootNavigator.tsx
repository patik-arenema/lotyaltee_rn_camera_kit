// app/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import UpdatePasswordScreen from '../screens/auth/UpdatePasswordScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import BottomTabNavigator from './BottomTabNavigator';
import UserPassHistory from '../screens/pass/UserPassHistory';
import StoreConfigScreen from '../screens/store/StoreConfigScreen';
import StampConfigScreen from '../screens/store/StampConfigScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Change Password" component={UpdatePasswordScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="UserHistory" component={UserPassHistory} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="Store Configuration" component={StoreConfigScreen} />
      <Stack.Screen name="Stamp Configuration" component={StampConfigScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
    </Stack.Navigator>
  );
}
