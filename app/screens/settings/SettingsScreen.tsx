import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Settings, Store, Lock, LogOut, Wallet} from 'lucide-react-native';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../../utils/colors';


type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  const menuItems = [
    // {
    //   title: 'Store Configuration',
    //   icon: <Store size={24} color="#007AFF" />,
    //   onPress: () => navigation.navigate('Store Configuration' as never),
    // },
    {
      title: 'Stamp Configuration',
      icon: <Wallet size={24} color="#007AFF" />,
      onPress: () => navigation.navigate('Stamp Configuration' as never),
    },
    {
      title: 'Change Password',
      icon: <Lock size={24} color="#007AFF" />,
      onPress: () => navigation.navigate('Change Password' as never),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Settings size={32} color="#007AFF" />
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}>
            {item.icon}
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={24} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:50,
    backgroundColor: colors.backgroundIvory,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 15,
    color: 'red',
  },
}); 