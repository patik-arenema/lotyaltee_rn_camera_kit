import React, {useEffect, useRef, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useForm} from 'react-hook-form';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetUserPassword,
} from '../../../services/api/api';
import InputField from '../../../components/formComponents/InputField';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';
import {Lock, Mail} from 'lucide-react-native';
import Offline from '../../../components/Offline';

const ForgotPasswordScreen = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'new-password'>('email');
  const [loading, setLoading] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [securePassword, setSecurePassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  // ⏱️ Resend OTP timer
  const [resendTimer, setResendTimer] = useState(60);
  const resendInterval = useRef<NodeJS.Timeout | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: {errors},
  } = useForm();

  const startResendTimer = () => {
    setResendTimer(60);
    if (resendInterval.current) clearInterval(resendInterval.current);

    resendInterval.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1 && resendInterval.current) {
          clearInterval(resendInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < 5) inputsRef.current[index + 1]?.focus();
    } else if (text === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
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

  const onSubmitEmail = async (data: any) => {
    clearErrors();
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await sendForgotPasswordOtp({email: data.email});
      if (response.status === 200) {
        setEmailValue(data.email);
        setStep('otp');
        startResendTimer(); // start countdown
      } else {
        setError('email', {
          type: 'manual',
          message: response.message || 'Failed to send OTP',
        });
      }
    } catch (error: any) {
      setError('email', {
        type: 'manual',
        message: error?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async () => {
    clearErrors();
    setErrorMessage('');
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setErrorMessage('Please enter all 6 digits');
      return;
    }
    setLoading(true);
    try {
      const response = await verifyForgotPasswordOtp({
        email: emailValue,
        otp: fullOtp,
      });
      if (response.status === 200) {
        setStep('new-password');
      } else {
        setErrorMessage(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      setErrorMessage(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitNewPassword = async (data: any) => {
    clearErrors();
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await resetUserPassword({
        email: emailValue,
        new_password: data.new_password,
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Password reset successful. Please log in.');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      } else {
        setError('new_password', {
          type: 'manual',
          message: response.message || 'Password reset failed',
        });
      }
    } catch (error: any) {
      setError('new_password', {
        type: 'manual',
        message: error?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    reset();
    setStep('email');
  };

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    setUnsubscribe(() => unsubscribeNetInfo);

    return () => {
      unsubscribeNetInfo();
      if (resendInterval.current) clearInterval(resendInterval.current);
    };
  }, []);

  if (!isConnected) return <Offline retryAction={handleRetry} />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {step === 'email' && (
        <>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email address</Text>

          <InputField
            control={control}
            name="email"
            placeholder="Enter your email"
            icon={<Mail size={20} color="gray" />}
            secureTextEntry={false}
            error={errors.email?.message}
          />

          {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmitEmail)}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {step === 'otp' && (
        <>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            We’ve sent a 6-digit verification code to your email
          </Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={text => handleOtpChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                ref={ref => {
                  inputsRef.current[index] = ref;
                }}
              />
            ))}
          </View>
          {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={onSubmitOtp}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleChangeEmail}>
              <Text style={{color: colors.primary}}>Change Email</Text>
            </TouchableOpacity>
          </View>

          {resendTimer > 0 ? (
            <Text style={styles.resendText}>Resend OTP in {resendTimer}s</Text>
          ) : (
            <TouchableOpacity
              onPress={() => {
                let data = {email: emailValue};
                onSubmitEmail(data);
                startResendTimer();
              }}>
              <Text style={[styles.resendText, {color: colors.primary}]}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {step === 'new-password' && (
        <>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter a new password</Text>

          <InputField
            control={control}
            name="new_password"
            placeholder="New password"
            icon={<Lock size={20} color="gray" />}
            secureTextEntry={securePassword}
            toggleSecure={() => setSecurePassword(prev => !prev)}
            error={errors.new_password?.message}
          />

          {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmitNewPassword)}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundIvory,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: fonts.bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 30,
    fontFamily: fonts.medium,
  },
  button: {
    backgroundColor: colors.button,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: fonts.medium,
    marginBottom: 8,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: fonts.bold,
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    textAlign: 'center',
    marginTop: 16,
    fontFamily: fonts.medium,
    color: 'gray',
  },
});

export default ForgotPasswordScreen;
