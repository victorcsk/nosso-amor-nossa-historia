import { Tabs } from 'expo-router';
import { useState, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chrome as Home, Mail } from 'lucide-react-native';

export default function TabLayout() {
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>([]);
  const [readCards, setReadCards] = useState<string[]>([]);

  const cardKeys = [
    "ComeçoDeTudo", "HakunaMatata", "SimPraSempre", "PrimeiraViagem", "MeuBB",
    "NossaMúsica", "NossoSim", "MelhorViagem", "SonhoBranco", "PraSempreNós"
  ];

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const keys = await AsyncStorage.getItem('unlockedKeys');
      const cards = await AsyncStorage.getItem('readCards');
      
      if (keys) setUnlockedKeys(JSON.parse(keys));
      if (cards) setReadCards(JSON.parse(cards));
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  // Calculate unread cards (unlocked but not read)
  const unreadCardsCount = unlockedKeys.filter(key => !readCards.includes(key)).length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#e91e63',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: '#ffc2cc',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cartas',
          tabBarIcon: ({ size, color }) => (
            <Mail size={size} color={color} />
          ),
          tabBarBadge: unreadCardsCount > 0 ? unreadCardsCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#e91e63',
            color: '#fff',
            fontSize: 10,
            minWidth: 18,
            height: 18,
          },
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          href: null, // Hide from tab bar but keep accessible via navigation
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          href: null, // Hide from tab bar - only accessible via direct navigation
        }}
      />
      <Tabs.Screen
        name="future"
        options={{
          href: null, // Hide from tab bar - only accessible via direct navigation
        }}
      />
    </Tabs>
  );
}