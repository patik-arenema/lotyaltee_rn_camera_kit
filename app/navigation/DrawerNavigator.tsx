import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import HomeScreen from '../screens/home/HomeScreen';
import PassDetailsScreen from '../screens/pass/PassDetailsScreen';
import StoreConfigScreen from '../screens/store/StoreConfigScreen';
import {RootStackParamList, DrawerParamList} from '../types/navigation';
import {LogOut} from 'lucide-react-native';
import Offline from '../../components/Offline';
import UpdatePasswordScreen from '../screens/auth/UpdatePasswordScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  const [isConnected, setIsConnected] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);
  const handleRetry = async () => {
    if (unsubscribe) unsubscribe();

    const netState = await NetInfo.fetch();
    setIsConnected(!!netState.isConnected);

    const newUnsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!netState.isConnected);
    });

    setUnsubscribe(() => newUnsubscribe);
  };

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    setUnsubscribe(() => unsubscribeNetInfo);

    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  if (!isConnected) return <Offline retryAction={handleRetry} />;

  function CustomDrawerContent(props: any) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleLogout = async () => {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    };

    return (
      <View style={{flex: 1}}>
        <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
          <View style={{flex: 1}}>
            <DrawerItemList {...props} />
          </View>

          {/* Logout at bottom */}
          <View style={styles.logoutContainer}>
            <DrawerItem
              label="Logout"
              onPress={handleLogout}
              labelStyle={{color: 'red'}}
              icon={({color, size}) => <LogOut color={color} size={size} />}
            />
          </View>
        </DrawerContentScrollView>
      </View>
    );
  }

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Pass Details" component={PassDetailsScreen} />
      <Drawer.Screen name="Store Configuration" component={StoreConfigScreen} />
      <Drawer.Screen name="Change Password" component={UpdatePasswordScreen} />
    </Drawer.Navigator>
  );
}
const styles = StyleSheet.create({
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 0,
  },
});
