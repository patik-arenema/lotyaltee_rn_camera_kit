import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './app/navigation/RootNavigator';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
