import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, Check, Mail, Clock, Heart, RotateCcw } from 'lucide-react-native';
import AnimatedBackground from '@/components/AnimatedBackground';

const quizData = [
  {
    id: 1,
    question: "Onde trocamos mensagens pela primeira vez e quando?",
    options: [
      "Instagram em abril de 2020",
      "WhatsApp em março de 2019",
      "Facebook no dia 2 de maio de 2019",
      "Telegram em janeiro de 2020"
    ],
    correct: 2,
    key: "ComeçoDeTudo"
  },
  {
    id: 2,
    question: "Onde foi nosso primeiro encontro?",
    options: [
      "Praça da Liberdade",
      "Cinema do Partage",
      "Monte Carmo Shopping vendo o Rei Leão",
      "Feira da Estrela"
    ],
    correct: 2,
    key: "HakunaMatata"
  },
  {
    id: 3,
    question: "Quando você aceitou meu pedido de namoro?",
    options: [
      "20 de setembro de 2019",
      "12 de setembro de 2019",
      "05 de outubro de 2019",
      "30 de agosto de 2019"
    ],
    correct: 1,
    key: "SimPraSempre"
  },
  {
    id: 4,
    question: "Para onde foi nossa primeira viagem juntos?",
    options: [
      "São Paulo",
      "Rio de Janeiro",
      "Poços de Caldas",
      "Capitólio"
    ],
    correct: 1,
    key: "PrimeiraViagem"
  },
  {
    id: 5,
    question: "Qual apelido carinhoso eu mais uso com você?",
    options: [
      "Onça brava",
      "Leoa",
      "Tribulação",
      "BB"
    ],
    correct: 3,
    key: "MeuBB"
  },
  {
    id: 6,
    question: "Qual foi a primeira música que marquei como \"nossa\"?",
    options: [
      "Perfect – Ed Sheeran",
      "Até o Fim – Engenheiros",
      "Scat Love Terminal – Jazztronik",
      "Te Assumi pro Brasil – Matheus & Kauan"
    ],
    correct: 2,
    key: "NossaMúsica"
  },
  {
    id: 7,
    question: "Quando te pedi em noivado?",
    options: [
      "14 de fevereiro de 2023",
      "25 de março de 2023",
      "12 de junho de 2023",
      "30 de abril de 2023"
    ],
    correct: 1,
    key: "NossoSim"
  },
  {
    id: 8,
    question: "Para onde foi nossa melhor viagem?",
    options: [
      "Argentina",
      "Chile",
      "Bahia",
      "Minas Gerais"
    ],
    correct: 1,
    key: "MelhorViagem"
  },
  {
    id: 9,
    question: "Onde realizei seu sonho de ver a neve?",
    options: [
      "Santiago",
      "Machu Picchu",
      "Portillo, Chile",
      "Caldas Novas"
    ],
    correct: 2,
    key: "SonhoBranco"
  },
  {
    id: 10,
    question: "Quando decidimos ficar juntos para sempre, mesmo após tudo?",
    options: [
      "25 de maio de 2025",
      "1º de junho de 2025",
      "24 de abril de 2025",
      "12 de julho de 2025"
    ],
    correct: 0,
    key: "PraSempreNós"
  }
];

interface GlobalQuizTimeout {
  blockedUntil: number;
  totalErrors: number;
}

export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>([]);
  const [quizProgress, setQuizProgress] = useState(0);
  const [globalErrorCount, setGlobalErrorCount] = useState(0);
  const [globalTimeout, setGlobalTimeout] = useState<GlobalQuizTimeout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    loadProgress();
    checkGlobalTimeout();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (globalTimeout && timeRemaining > 0) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, globalTimeout.blockedUntil - now);
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          clearGlobalTimeout();
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [globalTimeout, timeRemaining]);

  const loadProgress = async () => {
    try {
      const keys = await AsyncStorage.getItem('unlockedKeys');
      const progress = await AsyncStorage.getItem('quizProgress');
      const errorCount = await AsyncStorage.getItem('globalErrorCount');
      
      if (keys) {
        setUnlockedKeys(JSON.parse(keys));
      }
      if (progress) {
        const savedProgress = parseInt(progress);
        setQuizProgress(savedProgress);
        setCurrentQuestion(savedProgress);
      }
      if (errorCount) {
        setGlobalErrorCount(parseInt(errorCount));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const checkGlobalTimeout = async () => {
    try {
      const timeoutData = await AsyncStorage.getItem('globalQuizTimeout');
      if (timeoutData) {
        const timeout: GlobalQuizTimeout = JSON.parse(timeoutData);
        const now = Date.now();
        
        if (timeout.blockedUntil > now) {
          setGlobalTimeout(timeout);
          setTimeRemaining(timeout.blockedUntil - now);
          setGlobalErrorCount(timeout.totalErrors);
        } else {
          // Timeout expired, clear it
          await AsyncStorage.removeItem('globalQuizTimeout');
        }
      }
    } catch (error) {
      console.error('Error checking global timeout:', error);
    }
  };

  const clearGlobalTimeout = async () => {
    try {
      await AsyncStorage.removeItem('globalQuizTimeout');
      setGlobalTimeout(null);
      setTimeRemaining(0);
    } catch (error) {
      console.error('Error clearing global timeout:', error);
    }
  };

  const saveProgress = async (questionIndex: number) => {
    try {
      await AsyncStorage.setItem('quizProgress', questionIndex.toString());
      setQuizProgress(questionIndex);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const saveGlobalErrorCount = async (count: number) => {
    try {
      await AsyncStorage.setItem('globalErrorCount', count.toString());
      setGlobalErrorCount(count);
    } catch (error) {
      console.error('Error saving global error count:', error);
    }
  };

  const saveUnlockedKey = async (key: string) => {
    try {
      const updatedKeys = [...unlockedKeys, key];
      await AsyncStorage.setItem('unlockedKeys', JSON.stringify(updatedKeys));
      setUnlockedKeys(updatedKeys);
    } catch (error) {
      console.error('Error saving key:', error);
    }
  };

  const resetCompleteQuiz = async () => {
    try {
      await AsyncStorage.multiRemove([
        'quizProgress',
        'globalErrorCount',
        'unlockedKeys',
        'globalQuizTimeout'
      ]);
      
      setCurrentQuestion(0);
      setQuizProgress(0);
      setGlobalErrorCount(0);
      setUnlockedKeys([]);
      setGlobalTimeout(null);
      setTimeRemaining(0);
      setSelectedAnswer(null);
      setShowResult(false);
      
      Alert.alert(
        "Quiz Reiniciado! 🔄",
        "Agora você pode começar novamente, BB! 💕\n\nVamos relembrar nossa história juntos?",
        [{ text: "Vamos lá!" }]
      );
    } catch (error) {
      console.error('Error resetting quiz:', error);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (globalTimeout && timeRemaining > 0) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNext = async () => {
    if (selectedAnswer === null || (globalTimeout && timeRemaining > 0)) return;

    const currentQ = quizData[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct;

    if (isCorrect) {
      await saveUnlockedKey(currentQ.key);
      setShowResult(true);
    } else {
      // Increment global error count
      const newErrorCount = globalErrorCount + 1;
      await saveGlobalErrorCount(newErrorCount);

      if (newErrorCount >= 3) {
        // Block quiz for 10 minutes
        const blockedUntil = Date.now() + (10 * 60 * 1000); // 10 minutes
        const timeout: GlobalQuizTimeout = {
          blockedUntil,
          totalErrors: newErrorCount
        };
        
        try {
          await AsyncStorage.setItem('globalQuizTimeout', JSON.stringify(timeout));
          setGlobalTimeout(timeout);
          setTimeRemaining(blockedUntil - Date.now());
          
          Alert.alert(
            "Paciência, meu BB... 😔",
            "Você errou 3 vezes no total, BB…\n\nPreciso respirar um pouco, mas ainda quero continuar com você.\n\nTente de novo daqui a 10 minutinhos. 💗",
            [{ text: "OK, vou esperar 💕" }]
          );
        } catch (error) {
          console.error('Error setting global timeout:', error);
        }
      } else {
        const remainingErrors = 3 - newErrorCount;
        const messages = [
          "Que vergonha, BB... 😳\nMas por eu te amar, você tem mais uma chance 💗",
          "Eita, BB! 😅\nÚltima chance... pense bem na nossa história! 💕"
        ];
        
        Alert.alert(
          "Ops!",
          messages[newErrorCount - 1] + `\n\n(${remainingErrors} erro${remainingErrors > 1 ? 's' : ''} restante${remainingErrors > 1 ? 's' : ''} no total)`,
          [{ text: "OK" }]
        );
      }
      
      setSelectedAnswer(null);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      saveProgress(nextQuestion);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed - show special completion message
      Alert.alert(
        "💕 Você chegou até aqui...",
        "Reviveu cada lembrança.\nAgora, quer criar a próxima comigo?",
        [
          { 
            text: "Ver o Mapa do Nosso Amor ❤️", 
            onPress: () => router.push('/(tabs)/map')
          },
          { 
            text: "Ver Cartas Primeiro", 
            onPress: () => router.push('/(tabs)/cards'),
            style: "cancel"
          }
        ]
      );
    }
  };

  const handleGoToCards = () => {
    router.push('/(tabs)/cards');
  };

  const handleBack = () => {
    router.back();
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentQ = quizData[currentQuestion];
  const isLastQuestion = currentQuestion === quizData.length - 1;
  const isBlocked = globalTimeout && timeRemaining > 0;
  const timeoutExpired = globalTimeout && timeRemaining === 0;

  return (
    <AnimatedBackground>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#c2185b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>❓ Quiz do Nosso Amor</Text>
          <Text style={styles.questionCounter}>
            {currentQuestion + 1} de {quizData.length}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestion + 1) / quizData.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            Progresso: {currentQuestion + 1} de {quizData.length} perguntas respondidas
          </Text>
          {globalErrorCount > 0 && !isBlocked && (
            <View style={styles.errorCounter}>
              <Heart size={16} color="#ff5722" />
              <Text style={styles.errorCountText}>
                {globalErrorCount} de 3 erros no total
              </Text>
            </View>
          )}
        </View>

        {isBlocked && (
          <View style={styles.timeoutContainer}>
            <Clock size={40} color="#ff9800" />
            <Text style={styles.timeoutTitle}>Quiz Bloqueado</Text>
            <Text style={styles.timeoutMessage}>
              Tempo restante: {formatTime(timeRemaining)}
            </Text>
            <Text style={styles.timeoutSubtext}>
              Use esse tempo para pensar na nossa história... 💕
            </Text>
          </View>
        )}

        {timeoutExpired && (
          <View style={styles.resetContainer}>
            <RotateCcw size={40} color="#e91e63" />
            <Text style={styles.resetTitle}>Tempo Esgotado!</Text>
            <Text style={styles.resetMessage}>
              Agora você pode tentar novamente, BB! 💕
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetCompleteQuiz}>
              <Text style={styles.resetButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.content}>
          {!showResult && !timeoutExpired ? (
            <>
              <View style={[styles.questionContainer, isBlocked && styles.disabledContainer]}>
                <Text style={[styles.question, isBlocked && styles.disabledText]}>
                  {currentQ.question}
                </Text>
              </View>

              <View style={styles.optionsContainer}>
                {currentQ.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      selectedAnswer === index && styles.selectedOption,
                      isBlocked && styles.disabledOption,
                    ]}
                    onPress={() => handleAnswerSelect(index)}
                    disabled={isBlocked}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedAnswer === index && styles.selectedOptionText,
                        isBlocked && styles.disabledText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.nextButton,
                  (selectedAnswer === null || isBlocked) && styles.disabledButton,
                ]}
                onPress={handleNext}
                disabled={selectedAnswer === null || isBlocked}
              >
                <Text style={styles.nextButtonText}>
                  {isBlocked ? 'Aguarde...' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </>
          ) : showResult && !timeoutExpired ? (
            <View style={styles.resultContainer}>
              <Check size={80} color="#4caf50" style={styles.checkIcon} />
              <Text style={styles.resultTitle}>Parabéns!</Text>
              <Text style={styles.resultText}>
                Você desbloqueou a chave:
              </Text>
              <Text style={styles.keyText}>{currentQ.key}</Text>
              <Text style={styles.keyDescription}>
                Agora você pode abrir uma das cartas especiais! 💕
              </Text>

              <View style={styles.navigationButtons}>
                {!isLastQuestion && (
                  <TouchableOpacity 
                    style={styles.continueButton} 
                    onPress={handleNextQuestion}
                  >
                    <Text style={styles.continueButtonText}>Próxima Pergunta</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[styles.cardsButton, isLastQuestion && styles.singleButton]} 
                  onPress={handleGoToCards}
                >
                  <Mail size={20} color="#fff" style={styles.cardsIcon} />
                  <Text style={styles.cardsButtonText}>💌 Ir para as Cartas</Text>
                </TouchableOpacity>

                {isLastQuestion && (
                  <TouchableOpacity 
                    style={styles.mapButton} 
                    onPress={() => router.push('/(tabs)/map')}
                  >
                    <Text style={styles.mapButtonText}>🗺️ Ver o Mapa do Nosso Amor</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : null}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c2185b',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  questionCounter: {
    fontSize: 14,
    color: '#e91e63',
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  progressContainer: {
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
    fontSize: 14,
    color: '#c2185b',
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  errorCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  errorCountText: {
    fontSize: 12,
    color: '#ff5722',
    marginLeft: 6,
    fontWeight: '600',
  },
  timeoutContainer: {
    backgroundColor: 'rgba(255, 243, 224, 0.95)',
    borderRadius: 15,
    padding: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff9800',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  timeoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff9800',
    marginTop: 10,
    marginBottom: 10,
  },
  timeoutMessage: {
    fontSize: 18,
    color: '#ff9800',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeoutSubtext: {
    fontSize: 14,
    color: '#ff9800',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resetContainer: {
    backgroundColor: 'rgba(255, 230, 235, 0.95)',
    borderRadius: 15,
    padding: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e91e63',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  resetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e91e63',
    marginTop: 10,
    marginBottom: 10,
  },
  resetMessage: {
    fontSize: 16,
    color: '#c2185b',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  resetButton: {
    backgroundColor: '#e91e63',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  disabledContainer: {
    backgroundColor: 'rgba(245, 245, 245, 0.8)',
    opacity: 0.6,
  },
  question: {
    fontSize: 18,
    color: '#c2185b',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
  },
  disabledText: {
    color: '#bbb',
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ffc2cc',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#e91e63',
    backgroundColor: 'rgba(255, 230, 235, 0.95)',
    shadowOpacity: 0.3,
    elevation: 4,
  },
  disabledOption: {
    backgroundColor: 'rgba(245, 245, 245, 0.8)',
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color: '#c2185b',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#e91e63',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#e91e63',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ffc2cc',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  checkIcon: {
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 15,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  resultText: {
    fontSize: 18,
    color: '#c2185b',
    marginBottom: 10,
  },
  keyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e91e63',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  keyDescription: {
    fontSize: 16,
    color: '#c2185b',
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  navigationButtons: {
    width: '100%',
    gap: 15,
  },
  continueButton: {
    backgroundColor: '#e91e63',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardsButton: {
    backgroundColor: '#c2185b',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#c2185b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  singleButton: {
    backgroundColor: '#e91e63',
  },
  cardsIcon: {
    marginRight: 8,
  },
  cardsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapButton: {
    backgroundColor: '#4caf50',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
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
});