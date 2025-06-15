import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const Loader = () => {
  const fillHeight = useSharedValue(0);
  const steamOpacity1 = useSharedValue(0);
  const steamOpacity2 = useSharedValue(0);
  const steamOpacity3 = useSharedValue(0);
  const steamY1 = useSharedValue(0);
  const steamY2 = useSharedValue(0);
  const steamY3 = useSharedValue(0);

  useEffect(() => {
    // Animate coffee fill
    fillHeight.value = withRepeat(
      withSequence(
        withTiming(80, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(70, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Animate steam with different timings
    const animateSteam = (opacity: Animated.SharedValue<number>, y: Animated.SharedValue<number>, delay: number) => {
      setTimeout(() => {
        opacity.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 1000 }),
            withTiming(0, { duration: 1000 })
          ),
          -1,
          true
        );
        y.value = withRepeat(
          withSequence(
            withTiming(-20, { duration: 2000, easing: Easing.out(Easing.ease) }),
            withTiming(0, { duration: 0 })
          ),
          -1,
          true
        );
      }, delay);
    };

    animateSteam(steamOpacity1, steamY1, 0);
    animateSteam(steamOpacity2, steamY2, 700);
    animateSteam(steamOpacity3, steamY3, 1400);
  }, []);

  const animatedFillStyle = useAnimatedStyle(() => ({
    height: fillHeight.value,
  }));

  const createSteamStyle = (opacity: Animated.SharedValue<number>, y: Animated.SharedValue<number>) =>
    useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: y.value }],
    }));

  return (
    <View style={styles.container}>
      <View style={styles.cupContainer}>
        {/* Steam particles */}
        <Animated.View style={[styles.steam, styles.steam1, createSteamStyle(steamOpacity1, steamY1)]} />
        <Animated.View style={[styles.steam, styles.steam2, createSteamStyle(steamOpacity2, steamY2)]} />
        <Animated.View style={[styles.steam, styles.steam3, createSteamStyle(steamOpacity3, steamY3)]} />
        
        {/* Cup */}
        <View style={styles.cup}>
          <Animated.View style={[styles.coffee, animatedFillStyle]} />
        </View>
        <View style={styles.handle} />
      </View>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundIvory,
  },
  cupContainer: {
    position: "relative",
    width: 120,
    height: 140,
    alignItems: "center",
  },
  cup: {
    width: 80,
    height: 100,
    borderWidth: 6,
    borderColor: colors.primary,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFF",
  },
  coffee: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.button,
    borderRadius: 5,
  },
  handle: {
    position: "absolute",
    right: -5,
    top: 25,
    width: 25,
    height: 40,
    borderWidth: 6,
    borderLeftWidth: 0,
    borderColor: colors.primary,
    borderRadius: 20,
  },
  steam: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  steam1: {
    left: "30%",
    top: -10,
  },
  steam2: {
    left: "45%",
    top: -10,
  },
  steam3: {
    left: "60%",
    top: -10,
  },
  loadingText: {
    marginTop: 30,
    fontSize: 18,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
});

export default Loader;

