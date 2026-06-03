import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Gently floats its children up/down in a loop — the React Native equivalent
 * of the `er-float-*` CSS keyframes from the prototype.
 */
const FloatingBox = ({
  children,
  style,
  duration = 4500,
  delay = 0,
  amplitude = 6,
  ...rest
}) => {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const half = Math.max(800, duration / 2);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: half,
          delay,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: half,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value, duration, delay]);

  const translateY = value.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -amplitude],
  });

  return (
    <Animated.View style={[{ transform: [{ translateY }] }, style]} {...rest}>
      {children}
    </Animated.View>
  );
};

export default FloatingBox;
