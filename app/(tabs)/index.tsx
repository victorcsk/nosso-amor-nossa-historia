import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Heart, Play, Settings } from 'lucide-react-native';
import AnimatedBackground from '@/components/AnimatedBackground';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const handleStart = () => {
    router.push('/(tabs)/quiz');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
          <Settings size={24} color="#c2185b" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <View style={styles.heartIconContainer}>
            <Heart size={60} color="#e91e63" style={styles.heartIcon} />
            <View style={styles.heartGlow} />
          </View>
          <Text style={styles.title}>
            Nosso Amor,{'\n'}
            Nossa História
          </Text>
          <Text style={styles.subtitle}>
            Em Cada Lembrança
          </Text>
        </View>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Você está prestes a reviver cada momento{'\n'}
            que nos trouxe até aqui...
          </Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <View style={styles.buttonContent}>
            <Play size={24} color="#fff" style={styles.playIcon} />
            <Text style={styles.buttonText}>Começar</Text>
          </View>
          <View style={styles.buttonGlow} />
        </TouchableOpacity>
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 25,
    zIndex: 10,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  heartIconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  heartIcon: {
    zIndex: 2,
  },
  heartGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: '#e91e63',
    borderRadius: 40,
    opacity: 0.2,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#c2185b',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#e91e63',
    fontStyle: 'italic',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  descriptionContainer: {
    marginBottom: 80,
  },
  description: {
    fontSize: 16,
    color: '#c2185b',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  startButton: {
    width: width * 0.7,
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContent: {
    backgroundColor: '#e91e63',
    paddingVertical: 18,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  buttonGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    backgroundColor: '#e91e63',
    borderRadius: 35,
    opacity: 0.3,
    zIndex: 1,
  },
  playIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});