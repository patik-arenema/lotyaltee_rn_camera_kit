import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../utils/colors';
import {fonts} from '../utils/fonts';
import {WifiOff} from 'lucide-react-native';

const {width, height} = Dimensions.get('window');

const Offline = ({retryAction}: any) => {
  return (
    <View style={styles.container}>
      <WifiOff />
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>
        Please check your connection and try again.
      </Text>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => retryAction()}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundIvory,
  },
  mainBackgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.button,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.white,
  },
});

export default Offline;
