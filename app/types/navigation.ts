import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: NavigatorScreenParams<BottomTabParamList>;
  'Store Configuration': undefined;
  'Change Password': undefined;
  UserHistory: undefined
  "Scan Pass": undefined
};

export type BottomTabParamList = {
  Home: undefined;
  Camera: undefined;
  Settings: undefined;
}; 