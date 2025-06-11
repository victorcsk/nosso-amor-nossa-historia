import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import BackgroundMusic from '@/components/BackgroundMusic';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="card/[id]" />
        <Stack.Screen name="secret-card" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <BackgroundMusic />
      <StatusBar style="dark" />
    </>
  );
}