import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react-native';
import AnimatedBackground from '@/components/AnimatedBackground';

const loveLocations = [
  {
    name: "55 Abbey Lane, Danbury, CT, EUA",
    description: "De onde partiu a primeira mensagem - casa do Victor",
    mapLink: "https://www.google.com/maps/place/55+Abbey+Ln,+Danbury,+CT+06810,+USA"
  },
  {
    name: "Monte Carmo Shopping, Betim – MG",
    description: "Nosso primeiro encontro - cinema do Rei Leão",
    mapLink: "https://www.google.com/maps/search/Monte+Carmo+Shopping+Betim+MG"
  },
  {
    name: "Açaí Jeribá, Av. Amazonas, Centro, Betim – MG",
    description: "Onde você disse sim para namorar comigo",
    mapLink: "https://www.google.com/maps/search/A%C3%A7a%C3%AD+Jerib%C3%A1+Av+Amazonas+Centro+Betim+MG"
  },
  {
    name: "Museu do Amanhã, Rio de Janeiro – RJ",
    description: "Nossa primeira viagem - tentativa do visto",
    mapLink: "https://www.google.com/maps/place/Museu+do+Amanh%C3%A3,+Pra%C3%A7a+Mau%C3%A1,+1+-+Centro,+Rio+de+Janeiro+-+RJ"
  },
  {
    name: "Betim, MG",
    description: "Onde nasceu o apelido BB - nossa base de amor",
    mapLink: "https://www.google.com/maps/place/Betim,+MG"
  },
  {
    name: "Aeroporto Internacional de Confins, MG",
    description: "Nossa música especial - despedidas e reencontros",
    mapLink: "https://www.google.com/maps/place/Aeroporto+Internacional+de+Belo+Horizonte+-+Confins+-+Tancredo+Neves"
  },
  {
    name: "Rua Joana Escolástica Rosa, 442 – Jardim das Alterosas, Betim – MG",
    description: "Onde eu te pedi em noivado - 25 de março de 2023",
    mapLink: "https://www.google.com/maps/place/Rua+Joana+Escol%C3%A1stica+Rosa,+442,+Betim+-+MG"
  },
  {
    name: "Santiago, Chile",
    description: "Nossa melhor viagem - julho de 2023",
    mapLink: "https://www.google.com/maps/place/Santiago,+Chile"
  },
  {
    name: "Portillo, Chile",
    description: "Onde você realizou seu sonho de ver a neve",
    mapLink: "https://www.google.com/maps/place/Portillo,+Chile"
  },
  {
    name: "Betim, MG (reencontro)",
    description: "Local simbólico do nosso reencontro - 25 de maio de 2025",
    mapLink: "https://www.google.com/maps/place/Betim,+MG"
  }
];

export default function MapScreen() {
  useEffect(() => {
    markMapAsVisited();
  }, []);

  const markMapAsVisited = async () => {
    try {
      await AsyncStorage.setItem('mapVisited', JSON.stringify(true));
    } catch (error) {
      console.error('Error marking map as visited:', error);
    }
  };

  const openMap = (mapLink: string) => {
    Linking.openURL(mapLink);
  };

  const handleWhatNow = () => {
    router.push('/(tabs)/future');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <AnimatedBackground>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#c2185b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🗺️ Mapa do Nosso Amor</Text>
        </View>

        <View style={styles.introSection}>
          <Text style={styles.introText}>
            Lugares especiais da nossa história juntos...{'\n'}
            Cada ponto no mapa guarda uma memória nossa 💕
          </Text>
        </View>

        <View style={styles.locationsContainer}>
          {loveLocations.map((location, index) => (
            <TouchableOpacity
              key={index}
              style={styles.locationCard}
              onPress={() => openMap(location.mapLink)}
            >
              <View style={styles.locationInfo}>
                <MapPin size={24} color="#e91e63" style={styles.locationIcon} />
                <View style={styles.locationText}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationDescription}>{location.description}</Text>
                </View>
                <ArrowRight size={20} color="#ffc2cc" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.bottomText}>
            Cada lugar tem uma memória especial nossa...{'\n'}
            E ainda temos muitos lugares para descobrir juntos!
          </Text>
          
          <TouchableOpacity style={styles.whatNowButton} onPress={handleWhatNow}>
            <View style={styles.buttonContent}>
              <Text style={styles.whatNowButtonText}>E agora? 💖</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c2185b',
    flex: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  introSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  introText: {
    fontSize: 16,
    color: '#c2185b',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  locationsContainer: {
    paddingHorizontal: 20,
  },
  locationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  locationIcon: {
    marginRight: 15,
  },
  locationText: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#c2185b',
    marginBottom: 5,
  },
  locationDescription: {
    fontSize: 14,
    color: '#e91e63',
    lineHeight: 20,
  },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  bottomText: {
    fontSize: 16,
    color: '#c2185b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    fontStyle: 'italic',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  whatNowButton: {
    width: '70%',
    borderRadius: 30,
    overflow: 'hidden',
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
    alignItems: 'center',
  },
  whatNowButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});