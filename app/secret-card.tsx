import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function SecretCardScreen() {
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Dark romantic gradient for secret card */}
      <View style={styles.darkBackground}>
        <View style={styles.gradientOverlay} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carta 11 - O Futuro</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.heartContainer}>
            <Heart size={60} color="#fff" style={styles.heartIcon} />
            <View style={styles.heartGlow} />
          </View>

          <View style={styles.letterContainer}>
            <Text style={styles.letterContent}>
              {`Amor,

Essa carta só podia estar guardada como segredo…
Porque aqui eu falo do que mais importa: do que ainda está por vir.

Quero que você saiba, com toda a certeza do mundo, que nunca me arrependi de ter vindo pra cá.
Se eu tivesse que escolher de novo, entre o conforto da distância e o desafio de estar ao seu lado, eu te escolheria mais uma vez. Sempre.
Porque você é um amor de mulher. E me faz feliz em cada pequeno detalhe.

Você me faz rir, me inspira, me fortalece.
E sim… eu amo cada momento nosso, até aqueles que a gente chama de "golpe".
Porque mesmo nisso, tem amor, entrega, cumplicidade.
Tem a gente por inteiro.

Meu maior sonho é poder realizar todos os seus sonhos — só pra ver o brilho nos seus olhos quando eles se tornarem reais.
E eu ainda vou fazer isso.
Vamos à Paris, à Suíça, e a todos os lugares que você sempre imaginou.
Mas mais do que destinos no mapa, quero ser o teu lar em qualquer lugar do mundo.

Se for pra construir uma família, que seja com você ao meu lado.
Pra que um dia possamos sentar juntos, abraçados, e contar pros nossos filhos — e pros nossos netos — a nossa história de amor.

Você é a única pessoa no mundo sobre quem eu nunca tive sombra de dúvida.
A cada dia, eu te amo mais.
E se um dia o tempo quiser me roubar alguma coisa… que ele roube tudo, menos você.

Com amor,
Victor.`}
            </Text>
          </View>

          <View style={styles.bottomMessage}>
            <Text style={styles.bottomText}>
              Esta é nossa carta mais especial...{'\n'}
              Guardada no coração para sempre ❤️
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  darkBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2c1810',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'linear-gradient(135deg, #2c1810 0%, #c2185b 50%, #ffe6eb 100%)',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heartContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  heartIcon: {
    opacity: 0.9,
    zIndex: 2,
  },
  heartGlow: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    backgroundColor: '#fff',
    borderRadius: 50,
    opacity: 0.1,
    zIndex: 1,
  },
  letterContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  letterContent: {
    fontSize: 16,
    color: '#2c1810',
    lineHeight: 24,
    textAlign: 'left',
    fontFamily: 'serif',
  },
  bottomMessage: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  bottomText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.9,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});