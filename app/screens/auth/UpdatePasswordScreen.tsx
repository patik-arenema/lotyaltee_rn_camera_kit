import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { changeCustumerPassword } from '../../../services/api/api';
import InputField from '../../../components/formComponents/InputField';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import Offline from '../../../components/Offline';
import { updatePasswordSchema } from '../../../utils/validationSchema';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabParamList } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
type ConfigNavigationProp = NativeStackNavigationProp<
  BottomTabParamList,
  'Settings'
>;
export default function UpdatePasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(updatePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });
  const navigation = useNavigation<ConfigNavigationProp>();


  const [loading, setLoading] = useState(false);
  const [secureEntryOld, setSecureEntryOld] = useState(true);
  const [secureEntryNew, setSecureEntryNew] = useState(true);
  const [secureEntryConfirm, setSecureEntryConfirm] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  const onSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const payload = {
        old_password: formData.old_password,
        new_password: formData.new_password,
      };
      const res = await changeCustumerPassword(payload);
      if (res.status === 200 || res.status === 201) {
        Alert.alert('Password updated successfully!');
        reset();
      } else {
        Alert.alert(res?.message || 'Failed to update password');
      }
    } catch (err: any) {
      Alert.alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <ArrowLeft size={24} color={colors.primary} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Update Password</Text>

        <InputField
          control={control}
          name="old_password"
          placeholder="Old Password"
          secureTextEntry={secureEntryOld}
          toggleSecure={() => setSecureEntryOld(!secureEntryOld)}
          error={errors.old_password?.message}
        />

        <InputField
          control={control}
          name="new_password"
          placeholder="New Password"
          secureTextEntry={secureEntryNew}
          toggleSecure={() => setSecureEntryNew(!secureEntryNew)}
          error={errors.new_password?.message}
        />

        <InputField
          control={control}
          name="confirm_password"
          placeholder="Confirm Password"
          secureTextEntry={secureEntryConfirm}
          toggleSecure={() => setSecureEntryConfirm(!secureEntryConfirm)}
          error={errors.confirm_password?.message}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundIvory,
    padding: 20,
    paddingTop: 50
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: colors.primary,
    fontFamily: fonts.medium,
    fontSize: 16,
    marginLeft: 8,
  },
});
