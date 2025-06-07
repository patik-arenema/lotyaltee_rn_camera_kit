import React, {useEffect} from 'react';
import {Image} from 'react-native';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const Loader = () => {
  const fillHeight = useSharedValue(0);
  const steamOpacity = useSharedValue(0);

  useEffect(() => {
    fillHeight.value = withTiming(80, {duration: 3000, easing: Easing.ease});
    steamOpacity.value = withTiming(1, {duration: 2500, easing: Easing.ease});
  }, []);

  const animatedFillStyle = useAnimatedStyle(() => ({
    height: (fillHeight.value * 80) / 100, // Scale fill height
  }));

  const animatedSteamStyle = useAnimatedStyle(() => ({
    opacity: steamOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/loader.gif')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  cupContainer: {
    position: 'relative',
    width: 100,
    height: 120,
    overflow: 'hidden',
    alignItems: 'center',
  },
  fill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#6D4C41',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  steam: {
    position: 'absolute',
    top: -30,
    left: 20,
  },
  loadingText: {
    marginTop: 20,
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Loader;
