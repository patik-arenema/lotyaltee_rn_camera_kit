import React, {useState} from 'react';
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
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

import {sendRegisterCustumerOtp, userRegister} from '../../../services/api/api';
import InputField from '../../../components/formComponents/InputField';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {
  Contact,
  Globe,
  Lock,
  Mail,
  MapPin,
  MapPinHouse,
  Pin,
  Store,
  User,
} from 'lucide-react-native';
import {RootStackParamList} from '../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RegistercreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  store_name: yup.string().required('Store name is required'),
  contact: yup.string().required('Contact is required'),
  email_store: yup
    .string()
    .email('Invalid email')
    .required('Store email is required'),
  store_url: yup
    .string()
    .url('Store URL is Must be Valid')
    .required('Store URL is required'),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  address: yup.string().required('Address is required'),
});

export default function RegisterScreen() {
  const navigation = useNavigation<RegistercreenNavigationProp>();
  const [secureEntry, setSecureEntry] = useState(true);
  const [confirmSecureEntry, setConfirmSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      store_name: '',
      contact: '',
      email_store: '',
      store_url: '',
      country: '',
      state: '',
      city: '',
      address: '',
    },
  });

  const handleLogin = () => {
    reset();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const apiData = {
      name: data.name,
      email: data.email,
      password: data.password,
      store_name: data.store_name,
      contact: data.contact,
      email_store: data.email_store,
      store_url: data.store_url,
      country: data.country,
      state: data.state,
      city: data.city,
      address: data.address,
    };

    try {
      const registerResponse = await userRegister(apiData);
      if (registerResponse.status === 200 || registerResponse.status === 201) {
        Alert.alert(registerResponse?.data?.message);
        setLoading(false);
        handleLogin();
      } else {
        setError('address', {
          type: 'manual',
          message: registerResponse?.message || 'Registration failed.',
        });
      }
    } catch (error) {
      console.error('Registration error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Image
          source={require('../../../assets/images/logo4.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Create Account</Text>

        {/* Basic Fields */}
        <InputField
          control={control}
          name="name"
          placeholder="Name"
          icon={<User size={20} color="gray" />}
          error={errors.name?.message}
        />
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
          toggleSecure={() => setSecureEntry(prev => !prev)}
          icon={<Lock size={20} color="gray" />}
          error={errors.password?.message}
        />
        <InputField
          control={control}
          name="confirmPassword"
          placeholder="Confirm Password"
          secureTextEntry={confirmSecureEntry}
          toggleSecure={() => setConfirmSecureEntry(prev => !prev)}
          icon={<Lock size={20} color="gray" />}
          error={errors.confirmPassword?.message}
        />

        {/* Store Info */}
        <InputField
          control={control}
          name="store_name"
          placeholder="Store Name"
          icon={<Store size={20} color="gray" />}
          error={errors.store_name?.message}
        />
        <InputField
          control={control}
          name="contact"
          placeholder="Contact Number"
          icon={<Contact size={20} color="gray" />}
          error={errors.contact?.message}
        />
        <InputField
          control={control}
          name="email_store"
          placeholder="Store Email"
          icon={<Mail size={20} color="gray" />}
          error={errors.email_store?.message}
        />
        <InputField
          control={control}
          name="store_url"
          placeholder="Store URL"
          icon={<Globe size={20} color="gray" />}
          error={errors.store_url?.message}
        />
        <InputField
          control={control}
          name="country"
          placeholder="Country"
          icon={<MapPin size={20} color="gray" />}
          error={errors.country?.message}
        />
        <InputField
          control={control}
          name="state"
          placeholder="State"
          icon={<MapPin size={20} color="gray" />}
          error={errors.state?.message}
        />
        <InputField
          control={control}
          name="city"
          placeholder="City"
          icon={<MapPin size={20} color="gray" />}
          error={errors.city?.message}
        />
        <InputField
          control={control}
          name="address"
          placeholder="Address"
          icon={<MapPinHouse size={20} color="gray" />}
          error={errors.address?.message}
        />

        {/* Submit */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={{color: colors.primary}}>Login</Text>
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
    marginBottom: 100,
  },
});
