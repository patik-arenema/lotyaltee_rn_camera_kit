import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { CommonActions, NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
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
} from "react-native";
import { RootStackParamList } from "../../types/navigation";
import { sendRegisterCustumerOtp, verifyRegisterCustumerOtp } from "../../../services/api/api";
import Offline from "../../../components/Offline";
import { colors } from "../../../utils/colors";
import { fonts } from "../../../utils/fonts";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;


const OTPScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'OTPScreen'>>();
  const { email } = route.params;
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const [isConnected, setIsConnected] = useState<Boolean | null>(true);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  // Countdown effect
  useEffect(() => {
    if (isResendDisabled) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [isResendDisabled]);

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < 5) inputsRef.current[index + 1]?.focus();
    } else if (text === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      Alert.alert("Please enter all 6 digits");
      return;
    }

    const otpData = { email, otp: fullOtp };
    setLoading(true);
    try {
      const res = await verifyRegisterCustumerOtp(otpData);
      if (res.status === 200) {
        Alert.alert("Please wait until we verify your store");
        navigation.navigate('Login');
      } else {
        Alert.alert(res?.message);
      }
    } catch (err) {
      Alert.alert("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResendDisabled(true);
    setTimer(60);
    console.log("otp sent ");
    let emailData = { email: email }
    try {
      const otpResponse = await sendRegisterCustumerOtp(emailData);
      if (otpResponse.status === 200) {
        Alert.alert("OTP sent again to your email.");
        setOtp(Array(6).fill(""));
        inputsRef.current[0]?.focus();
      }
    } catch (err) {
      Alert.alert("Failed to resend OTP");
      setIsResendDisabled(false);
    }
  };

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    setUnsubscribe(() => unsubscribeNetInfo); // Store the unsubscribe function

    return () => {
      unsubscribeNetInfo(); // Cleanup on unmount
    };
  }, []);

  const handleRetry = async () => {
    if (unsubscribe) {
      unsubscribe(); // Unsubscribe from previous listener
    }

    // Manually check network status
    const netState = await NetInfo.fetch();
    setIsConnected(netState.isConnected);

    // Restart network listener
    const newUnsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    setUnsubscribe(() => newUnsubscribe);
  };

  if (!isConnected) {
    return <Offline retryAction={handleRetry} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            ref={(ref) => (inputsRef.current[index] = ref)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resendButton}
        disabled={isResendDisabled}
        onPress={handleResendOtp}
      >
        <Text
          style={{
            color: isResendDisabled ? "gray" : colors.primary,
            fontFamily: fonts.medium,
            marginTop: 20,
            textAlign: "center",
          }}
        >
          {isResendDisabled
            ? `Resend OTP in ${timer}s`
            : "Didn't receive OTP? Resend"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundIvory,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: fonts.bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "gray",
    marginBottom: 30,
    fontFamily: fonts.medium,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 20,
    fontFamily: fonts.bold,
    backgroundColor: "#fff",
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
    textAlign: "center",
  },
  resendButton: {
    marginTop: 10,
    alignItems: "center",
  },
});

export default OTPScreen;