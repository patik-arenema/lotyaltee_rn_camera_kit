import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View} from 'react-native';
import HomeScreen from '../screens/home/HomeScreen';
import PassDetailsScreen from '../screens/pass/PassDetailsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import {Home, Camera, Settings} from 'lucide-react-native';
import { colors } from '../../utils/colors';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.button,
        tabBarInactiveTintColor: colors.darkGray,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown:false
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => <Home color={color} size={size} />,
        }}
      />
  <Tab.Screen
        name="Scan Pass"
        component={PassDetailsScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <View style={[
                styles.scanButton,
                {backgroundColor: focused ? colors.white : colors.white}
              ]}>
              <Camera color={color} size={size} />
            </View>
          ),
          tabBarLabel: () => null, 
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({color, size}) => <Settings color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingBottom: 20,
    paddingTop: 5,
  },
  scanButton: {
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
    borderColor:colors.darkGray
  },
}); 