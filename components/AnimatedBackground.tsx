import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface FloatingElement {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  rotation: Animated.Value;
}

export default function AnimatedBackground({ children }: { children: React.ReactNode }) {
  const floatingElements = useRef<FloatingElement[]>([]);
  const sparkles = useRef<FloatingElement[]>([]);

  useEffect(() => {
    // Create floating hearts
    for (let i = 0; i < 8; i++) {
      const element: FloatingElement = {
        id: i,
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(height + 100),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0.5 + Math.random() * 0.5),
        rotation: new Animated.Value(0),
      };
      floatingElements.current.push(element);
    }

    // Create sparkles
    for (let i = 0; i < 12; i++) {
      const sparkle: FloatingElement = {
        id: i,
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(Math.random() * height),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0.3 + Math.random() * 0.4),
        rotation: new Animated.Value(0),
      };
      sparkles.current.push(sparkle);
    }

    // Start animations
    startFloatingAnimation();
    startSparkleAnimation();
  }, []);

  const startFloatingAnimation = () => {
    floatingElements.current.forEach((element, index) => {
      const animateElement = () => {
        // Reset position
        element.y.setValue(height + 100);
        element.x.setValue(Math.random() * width);
        element.opacity.setValue(0);

        // Animate upward movement
        Animated.sequence([
          Animated.timing(element.opacity, {
            toValue: 0.3 + Math.random() * 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(element.y, {
              toValue: -100,
              duration: 8000 + Math.random() * 4000,
              useNativeDriver: true,
            }),
            Animated.timing(element.x, {
              toValue: element.x._value + (Math.random() - 0.5) * 200,
              duration: 8000 + Math.random() * 4000,
              useNativeDriver: true,
            }),
            Animated.loop(
              Animated.timing(element.rotation, {
                toValue: 360,
                duration: 6000 + Math.random() * 4000,
                useNativeDriver: true,
              })
            ),
          ]),
          Animated.timing(element.opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Restart animation with delay
          setTimeout(animateElement, Math.random() * 3000);
        });
      };

      // Start with random delay
      setTimeout(animateElement, index * 1000 + Math.random() * 2000);
    });
  };

  const startSparkleAnimation = () => {
    sparkles.current.forEach((sparkle, index) => {
      const animateSparkle = () => {
        sparkle.opacity.setValue(0);
        sparkle.scale.setValue(0.1);

        Animated.sequence([
          Animated.parallel([
            Animated.timing(sparkle.opacity, {
              toValue: 0.6 + Math.random() * 0.4,
              duration: 800 + Math.random() * 400,
              useNativeDriver: true,
            }),
            Animated.timing(sparkle.scale, {
              toValue: 0.3 + Math.random() * 0.4,
              duration: 800 + Math.random() * 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(sparkle.opacity, {
            toValue: 0,
            duration: 800 + Math.random() * 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Move to new position and restart
          sparkle.x.setValue(Math.random() * width);
          sparkle.y.setValue(Math.random() * height);
          setTimeout(animateSparkle, Math.random() * 4000);
        });
      };

      // Start with random delay
      setTimeout(animateSparkle, index * 500 + Math.random() * 2000);
    });
  };

  return (
    <View style={styles.container}>
      {/* Main gradient background */}
      <LinearGradient
        colors={[
          '#ffeef2', // Very light pink
          '#ffe1e8', // Light pink
          '#ffd1dc', // Soft pink
          '#ffb3c6', // Medium pink
          '#ff9bb0', // Deeper pink
          '#e91e63', // Main pink
        ]}
        locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        style={styles.gradient}
      />

      {/* Overlay gradient for depth */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.3)',
          'rgba(255, 255, 255, 0.1)',
          'rgba(233, 30, 99, 0.1)',
          'rgba(194, 24, 91, 0.2)',
        ]}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.overlay}
      />

      {/* Floating hearts */}
      {floatingElements.current.map((element) => (
        <Animated.View
          key={`heart-${element.id}`}
          style={[
            styles.floatingElement,
            {
              transform: [
                { translateX: element.x },
                { translateY: element.y },
                { scale: element.scale },
                {
                  rotate: element.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
              opacity: element.opacity,
            },
          ]}
        >
          <Heart size={20} color="#ff69b4" fill="#ff69b4" />
        </Animated.View>
      ))}

      {/* Sparkles */}
      {sparkles.current.map((sparkle) => (
        <Animated.View
          key={`sparkle-${sparkle.id}`}
          style={[
            styles.sparkle,
            {
              left: sparkle.x._value,
              top: sparkle.y._value,
              transform: [{ scale: sparkle.scale }],
              opacity: sparkle.opacity,
            },
          ]}
        >
          <View style={styles.sparkleShape} />
        </Animated.View>
      ))}

      {/* Decorative corner elements */}
      <View style={styles.topLeftDecor}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
          style={styles.cornerGradient}
        />
      </View>

      <View style={styles.bottomRightDecor}>
        <LinearGradient
          colors={['rgba(233, 30, 99, 0.3)', 'rgba(233, 30, 99, 0)']}
          style={styles.cornerGradient}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    zIndex: 1,
  },
  sparkleShape: {
    width: 8,
    height: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    shadowColor: '#ff69b4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  topLeftDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    zIndex: 1,
  },
  bottomRightDecor: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 150,
    height: 150,
    zIndex: 1,
  },
  cornerGradient: {
    flex: 1,
    borderRadius: 100,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
});