import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {CommonActions, useNavigation} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as yup from 'yup';
import {userLogin} from '../../../services/api/api';
import InputField from '../../../components/formComponents/InputField';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';
import {Lock, Mail} from 'lucide-react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import Offline from '../../../components/Offline';
type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email('Invalid email')
    .required('Email is required'),
  password: yup.string().min(6).trim().required('Password is required'),
});

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleRedirection = () => {
    reset();
    // navigation.navigate('HomeScreen');

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            state: {
              index: 0,
              routes: [{name: 'Home'}],
            },
          },
        ],
      }),
    );
  };

  const onSubmit = async (data: any) => {
    const apiData = {
      email: data.email,
      password: data.password,
    };
    setLoading(true);
    console.log(apiData);

    try {
      const loginResponse = await userLogin(apiData);

      console.log(loginResponse);

      if (loginResponse.status == 200 || loginResponse.status == 201) {
        if (loginResponse.data.role_name == 'store_admin') {
          await AsyncStorage.setItem('token', loginResponse.data.token);
          await AsyncStorage.setItem('userId', loginResponse.data.user_id);
          await AsyncStorage.setItem('storeId', loginResponse.data.store_id);
          await AsyncStorage.setItem(
            'storeName',
            loginResponse.data.store_name,
          );
          handleRedirection();
        } else {
          setError('password', {
            type: 'manual',
            message: 'This user is not a Store Admin',
          });
          return;
        }
      } else {
        setError('password', {
          type: 'manual',
          message: loginResponse?.message || 'Login failed. Try again.',
        });
        return;
      }
    } catch (error) {
      Alert.alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPass = () => {
    reset();
    navigation.navigate('ForgotPassword');
  };

  const handleSignup = () => {
    reset();
    navigation.navigate('Register');
  };
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image
          source={require('../../../assets/images/logo4.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Login</Text>

        <InputField
          control={control}
          name="email"
          placeholder="Email"
          icon={<Mail size={20} color="gray" />}
          error={errors.email?.message}
        />

        <InputField
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry={secureEntry}
          icon={<Lock size={20} color="gray" />}
          toggleSecure={() => setSecureEntry(!secureEntry)}
          error={errors.password?.message}
        />

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleForgotPass}>
            <Text style={{color: colors.primary}}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>Don’t have an account? </Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={{color: colors.primary}}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.backgroundIvory, padding: 20},
  scroll: {flexGrow: 1, justifyContent: 'center'},
  logo: {width: 180, height: 180, alignSelf: 'center', marginBottom: 0},
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.button,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});
