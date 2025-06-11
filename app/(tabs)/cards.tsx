import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, Lock, X, BookOpen, CircleHelp as HelpCircle } from 'lucide-react-native';
import AnimatedBackground from '@/components/AnimatedBackground';

const cardTitles = [
  "O Começo de Tudo",
  "Hakuna Matata", 
  "Sim Pra Sempre",
  "Primeira Viagem",
  "Meu BB",
  "Nossa Música",
  "Nosso Sim",
  "Melhor Viagem",
  "Sonho Branco",
  "Pra Sempre Nós"
];

const cardKeys = [
  "ComeçoDeTudo",
  "HakunaMatata",
  "SimPraSempre", 
  "PrimeiraViagem",
  "MeuBB",
  "NossaMúsica",
  "NossoSim",
  "MelhorViagem",
  "SonhoBranco",
  "PraSempreNós"
];

export default function CardsScreen() {
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>([]);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [readCards, setReadCards] = useState<string[]>([]);

  useEffect(() => {
    loadUnlockedKeys();
    loadReadCards();
  }, []);

  const loadUnlockedKeys = async () => {
    try {
      const keys = await AsyncStorage.getItem('unlockedKeys');
      if (keys) {
        setUnlockedKeys(JSON.parse(keys));
      }
    } catch (error) {
      console.error('Error loading keys:', error);
    }
  };

  const loadReadCards = async () => {
    try {
      const cards = await AsyncStorage.getItem('readCards');
      if (cards) {
        setReadCards(JSON.parse(cards));
      }
    } catch (error) {
      console.error('Error loading read cards:', error);
    }
  };

  const markCardAsRead = async (cardKey: string) => {
    try {
      const updatedReadCards = [...readCards, cardKey];
      await AsyncStorage.setItem('readCards', JSON.stringify(updatedReadCards));
      setReadCards(updatedReadCards);
      
      // Check if all cards are now read and show map unlock message
      if (updatedReadCards.length === cardKeys.length) {
        setTimeout(() => {
          Alert.alert(
            "🗺️ Mapa Desbloqueado!",
            "Parabéns, BB! Você leu todas as nossas memórias especiais!\n\nAgora você pode ver o mapa dos lugares que marcaram nossa história. 💕",
            [
              { text: "Ver Mapa Agora", onPress: () => router.push('/(tabs)/map') },
              { text: "Ver Depois", style: "cancel" }
            ]
          );
        }, 1000);
      }
    } catch (error) {
      console.error('Error marking card as read:', error);
    }
  };

  const unlockCard = async (cardKey: string) => {
    try {
      const updatedKeys = [...unlockedKeys, cardKey];
      await AsyncStorage.setItem('unlockedKeys', JSON.stringify(updatedKeys));
      setUnlockedKeys(updatedKeys);
    } catch (error) {
      console.error('Error unlocking card:', error);
    }
  };

  const handleCardPress = (index: number) => {
    const cardKey = cardKeys[index];
    
    if (unlockedKeys.includes(cardKey)) {
      // Card is unlocked, mark as read and open
      markCardAsRead(cardKey);
      router.push(`/card/${index + 1}`);
    } else {
      // Card is locked, show key input modal
      setSelectedCard(index);
      setShowKeyModal(true);
    }
  };

  const handleKeySubmit = async () => {
    if (selectedCard === null) return;

    const correctKey = cardKeys[selectedCard];
    
    if (keyInput.trim() === correctKey) {
      // Correct key: unlock card, mark as read, and open
      await unlockCard(correctKey);
      await markCardAsRead(correctKey);
      setShowKeyModal(false);
      setKeyInput('');
      router.push(`/card/${selectedCard + 1}`);
    } else {
      Alert.alert(
        "Hmm... 💌",
        "Parece que essa não é a chave certa pra essa lembrança...\n\nTente novamente ou complete o quiz para obter as chaves! 💕",
        [{ text: "OK ❤️" }]
      );
    }
  };

  const closeModal = () => {
    setShowKeyModal(false);
    setSelectedCard(null);
    setKeyInput('');
  };

  const handleGoToQuiz = () => {
    router.push('/(tabs)/quiz');
  };

  const getCardStatus = (index: number) => {
    const cardKey = cardKeys[index];
    const isUnlocked = unlockedKeys.includes(cardKey);
    const isRead = readCards.includes(cardKey);
    
    if (!isUnlocked) return 'locked';
    if (isRead) return 'read';
    return 'unread';
  };

  // Calculate progress stats
  const totalCards = cardKeys.length;
  const unlockedCount = unlockedKeys.length;
  const readCount = readCards.length;
  const unreadCount = unlockedKeys.filter(key => !readCards.includes(key)).length;

  return (
    <AnimatedBackground>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>💌 Cartas do Nosso Amor</Text>
            <Text style={styles.headerSubtitle}>
              {unlockedCount} de {totalCards} cartas desbloqueadas
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(readCount / totalCards) * 100}%` }
              ]} 
            />
          </View>
          {readCount > 0 ? (
            <Text style={styles.progressText}>
              {readCount} de {totalCards} cartas lidas
              {unreadCount > 0 && ` • ${unreadCount} novas para ler`}
            </Text>
          ) : (
            <Text style={styles.progressText}>
              Complete o quiz para desbloquear as primeiras cartas
            </Text>
          )}
        </View>

        <View style={styles.cardsGrid}>
          {cardTitles.map((title, index) => {
            const status = getCardStatus(index);
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.cardContainer,
                  status === 'locked' && styles.lockedCard,
                  status === 'unread' && styles.unreadCard,
                  status === 'read' && styles.readCard,
                ]}
                onPress={() => handleCardPress(index)}
              >
                <View style={styles.cardContent}>
                  {status === 'locked' ? (
                    <Lock size={40} color="#ffc2cc" />
                  ) : status === 'unread' ? (
                    <Mail size={40} color="#e91e63" />
                  ) : (
                    <BookOpen size={40} color="#4caf50" />
                  )}
                  <Text style={styles.cardNumber}>{index + 1}</Text>
                  <Text style={[
                    styles.cardTitle,
                    status === 'locked' && styles.lockedTitle,
                    status === 'unread' && styles.unreadTitle,
                    status === 'read' && styles.readTitle,
                  ]}>
                    {title}
                  </Text>
                  {status === 'unread' && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NOVA</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.quizButton}
            onPress={handleGoToQuiz}
          >
            <Text style={styles.quizButtonText}>
              {unlockedCount === 0 ? '❓ Começar Quiz' : '❓ Continuar Quiz'}
            </Text>
          </TouchableOpacity>

          {readCount === totalCards && (
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => router.push('/(tabs)/map')}
            >
              <Text style={styles.mapButtonText}>🗺️ Ver o Mapa do Nosso Amor</Text>
            </TouchableOpacity>
          )}

          <View style={styles.helpSection}>
            <HelpCircle size={16} color="#e91e63" />
            <Text style={styles.helpText}>
              Complete o quiz para desbloquear as chaves das cartas especiais
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showKeyModal}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <X size={24} color="#c2185b" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>🔑 Chave da Carta</Text>
            <Text style={styles.modalSubtitle}>
              Digite a chave para desbloquear esta carta:
            </Text>
            
            <TextInput
              style={styles.keyInput}
              value={keyInput}
              onChangeText={setKeyInput}
              placeholder="Digite a chave aqui..."
              placeholderTextColor="#ffc2cc"
            />
            
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleKeySubmit}
            >
              <Text style={styles.submitButtonText}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quizHintButton}
              onPress={() => {
                closeModal();
                handleGoToQuiz();
              }}
            >
              <Text style={styles.quizHintText}>Fazer quiz para obter chaves</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c2185b',
    marginBottom: 5,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e91e63',
    fontStyle: 'italic',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e91e63',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#c2185b',
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  lockedCard: {
    backgroundColor: 'rgba(245, 245, 245, 0.9)',
    borderWidth: 2,
    borderColor: '#ffc2cc',
    borderStyle: 'dashed',
  },
  unreadCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 8,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#e91e63',
  },
  readCard: {
    backgroundColor: 'rgba(240, 248, 240, 0.95)',
    elevation: 5,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
    marginTop: 10,
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  lockedTitle: {
    color: '#ffc2cc',
  },
  unreadTitle: {
    color: '#c2185b',
  },
  readTitle: {
    color: '#4caf50',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#e91e63',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    gap: 15,
  },
  quizButton: {
    backgroundColor: '#e91e63',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mapButton: {
    backgroundColor: '#4caf50',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#e91e63',
    textAlign: 'center',
    fontStyle: 'italic',
    flex: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c2185b',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#e91e63',
    textAlign: 'center',
    marginBottom: 20,
  },
  keyInput: {
    borderWidth: 2,
    borderColor: '#ffc2cc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#c2185b',
    width: '100%',
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  submitButton: {
    backgroundColor: '#e91e63',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 15,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizHintButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e91e63',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  quizHintText: {
    color: '#e91e63',
    fontSize: 14,
    fontWeight: '600',
  },
});