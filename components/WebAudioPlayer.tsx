import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Platform } from 'react-native';

interface WebAudioPlayerProps {
  src: string;
  isPlaying: boolean;
  volume: number;
  loop?: boolean;
  autoplay?: boolean;
  onStatusUpdate?: (isPlaying: boolean) => void;
}

export interface WebAudioPlayerRef {
  play: () => Promise<void>;
  pause: () => void;
}

const WebAudioPlayer = forwardRef<WebAudioPlayerRef, WebAudioPlayerProps>(
  ({ src, isPlaying, volume, loop = false, autoplay = false, onStatusUpdate }, ref) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useImperativeHandle(ref, () => ({
      play: async () => {
        if (audioRef.current && isLoaded && !hasError) {
          try {
            await audioRef.current.play();
          } catch (error) {
            console.error('Error playing audio:', error);
          }
        }
      },
      pause: () => {
        if (audioRef.current && !hasError) {
          audioRef.current.pause();
        }
      },
    }));

    useEffect(() => {
      if (Platform.OS === 'web') {
        // Create audio element
        const audio = new Audio();
        
        // Set the source to the specified path
        audio.src = src;
        audio.loop = loop;
        audio.volume = volume;
        audio.preload = 'auto';
        
        // Enable autoplay if specified
        if (autoplay) {
          audio.autoplay = true;
        }
        
        audio.addEventListener('canplaythrough', () => {
          setIsLoaded(true);
          setHasError(false);
          onStatusUpdate?.(false);
          
          // Try to autoplay if enabled
          if (autoplay) {
            audio.play().catch((error) => {
              console.log('Autoplay prevented by browser:', error);
              // Autoplay was prevented, user interaction required
            });
          }
        });
        
        audio.addEventListener('play', () => {
          onStatusUpdate?.(true);
        });
        
        audio.addEventListener('pause', () => {
          onStatusUpdate?.(false);
        });
        
        audio.addEventListener('ended', () => {
          if (loop && !hasError) {
            audio.currentTime = 0;
            audio.play().catch(console.error);
          } else {
            onStatusUpdate?.(false);
          }
        });
        
        audio.addEventListener('error', (e) => {
          console.warn('Audio file not found or failed to load:', src);
          setHasError(true);
          setIsLoaded(true); // Set loaded to true to prevent infinite loading
          onStatusUpdate?.(false);
        });
        
        audioRef.current = audio;
        
        return () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
          }
        };
      }
    }, [src, loop, autoplay]);

    useEffect(() => {
      if (audioRef.current && isLoaded && !hasError) {
        if (isPlaying) {
          audioRef.current.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
        } else {
          audioRef.current.pause();
        }
      }
    }, [isPlaying, isLoaded, hasError]);

    useEffect(() => {
      if (audioRef.current && !hasError) {
        audioRef.current.volume = Math.max(0, Math.min(1, volume));
      }
    }, [volume, hasError]);

    useEffect(() => {
      if (audioRef.current && !hasError) {
        audioRef.current.loop = loop;
      }
    }, [loop, hasError]);

    return null; // This component doesn't render anything visible
  }
);

WebAudioPlayer.displayName = 'WebAudioPlayer';

export default WebAudioPlayer;