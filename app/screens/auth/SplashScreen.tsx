// app/screens/SplashScreen.tsx
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import {colors} from '../../../utils/colors';
export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 sec delay
      const token = await AsyncStorage.getItem('token');

      if (token) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'DrawerNavigator',
                state: {
                  index: 0,
                  routes: [{name: 'Home'}],
                },
              },
            ],
          }),
        );
      } else {
        navigation.dispatch(StackActions.replace('Login'));
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo4.png')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundIvory,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
});
