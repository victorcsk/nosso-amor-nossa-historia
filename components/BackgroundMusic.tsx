import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Volume2, VolumeX } from 'lucide-react-native';
import WebAudioPlayer from './WebAudioPlayer';

interface BackgroundMusicProps {
  style?: any;
}

export default function BackgroundMusic({ style }: BackgroundMusicProps) {
  const [sound, setSound] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted since no audio file
  const webAudioPlayerRef = useRef<any>(null);

  useEffect(() => {
    loadMusicPreference();
    // Skip music initialization since no audio file is available
    
    return () => {
      if (sound && Platform.OS !== 'web') {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadMusicPreference = async () => {
    try {
      const musicEnabled = await AsyncStorage.getItem('musicEnabled');
      if (musicEnabled !== null) {
        const enabled = JSON.parse(musicEnabled);
        setIsMuted(!enabled);
        // Don't auto-play since no audio file is available
        setIsPlaying(false);
      } else {
        // Default to muted since no audio file is available
        setIsMuted(true);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error loading music preference:', error);
    }
  };

  const saveMusicPreference = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('musicEnabled', JSON.stringify(enabled));
    } catch (error) {
      console.error('Error saving music preference:', error);
    }
  };

  const playMusic = async () => {
    // No audio file available, just update state
    console.log('No audio file available for playback');
    setIsPlaying(true);
  };

  const pauseMusic = async () => {
    // No audio file available, just update state
    setIsPlaying(false);
  };

  const toggleMusic = async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    await saveMusicPreference(!newMutedState);

    if (newMutedState) {
      // Mute the music
      await pauseMusic();
    } else {
      // Unmute and play the music (but no actual audio since file doesn't exist)
      await playMusic();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.musicButton,
          isMuted && styles.mutedButton,
        ]}
        onPress={toggleMusic}
      >
        {isMuted ? (
          <VolumeX size={18} color="#c2185b" />
        ) : (
          <Volume2 size={18} color="#e91e63" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 50,
  },
  musicButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'rgba(233, 30, 99, 0.2)',
  },
  mutedButton: {
    backgroundColor: 'rgba(245, 245, 245, 0.9)',
    borderColor: 'rgba(194, 24, 91, 0.3)',
  },
});