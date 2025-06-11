import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, MapPin, Lock, Heart } from 'lucide-react-native';
import AnimatedBackground from '@/components/AnimatedBackground';

const defaultCardContents = [
  {
    title: "O Começo de Tudo",
    image: "https://i.postimg.cc/xdGKNyTM/Screenshot-20190830-001224-Messenger.jpg",
    content: `Meu amor,

Em meio a tantas pessoas no mundo, de repente… ali estava você.

Lembro da primeira mensagem no Facebook, dando boa noite e dizendo que você era uma das mulheres mais lindas que eu já tinha visto. Foi no dia 2 de maio de 2019.

Foi simples. Foi ousado. E tinha uma chance real de você me ignorar… mas você não ignorou.

Tinha algo diferente naquela conversa. Estávamos em países diferentes — e mesmo assim, a distância não parecia importar.

A cada mensagem trocada, era como se o universo estivesse nos apresentando com delicadeza, preparando o terreno para tudo o que viria depois.

Mal sabíamos que aquele dia seria o primeiro capítulo da nossa história.

Estávamos longe, mas o destino já nos conectava.

Com amor,
Victor`,
    location: "55 Abbey Lane, Danbury, CT, EUA",
    mapLink: "https://www.google.com/maps/place/55+Abbey+Ln,+Danbury,+CT+06810,+USA",
    key: "ComeçoDeTudo"
  },
  {
    title: "Hakuna Matata",
    image: "https://i.postimg.cc/GtfYnXqw/20190907-233533-1.jpg",
    content: `Princesa,

Eu lembro do frio na barriga como se fosse hoje.

O Monte Carmo Shopping virou cenário de um momento único: a primeira vez que te vi pessoalmente.

Assistimos juntos ao live action de O Rei Leão. E ali, naquela sala escura, cercados por vozes, pessoas e a musica "Hakuna Matata", eu tive certeza de que aquele momento estaria guardado pra sempre.

E o melhor de tudo? Você me agarrou e me beijou.

Naquele instante, não era só um beijo — era como se tudo tivesse se encaixado.

Para sempre seu,
Victor`,
    location: "Monte Carmo Shopping, Betim – MG",
    mapLink: "https://www.google.com/maps/search/Monte+Carmo+Shopping+Betim+MG",
    key: "HakunaMatata"
  },
  {
    title: "Sim Pra Sempre",
    image: "https://i.postimg.cc/tT2W2q6g/20200104-201325.jpg",
    content: `Vida,

O cenário era simples: o Açaí Jeribá, perto do seu trabalho.

Mas naquele lugar comum, algo extraordinário aconteceu.

Eu te pedi em namoro… e você disse sim.

Sem enrolação, sem dúvida. Um sim firme, verdadeiro e cheio de sentimento.

A partir dali, o "eu e você" virou "nós".

SimPraSempre... porque naquele açaí, nasceu um amor de verdade.

Eternamente seu,
Victor`,
    location: "Açaí Jeribá, Av. Amazonas, Centro, Betim – MG",
    mapLink: "https://www.google.com/maps/search/A%C3%A7a%C3%AD+Jerib%C3%A1+Av+Amazonas+Centro+Betim+MG",
    key: "SimPraSempre"
  },
  {
    title: "Primeira Viagem",
    image: "https://i.postimg.cc/prr8Sw-QJ/20230112-180247.jpg",
    content: `Minha companheira de aventuras,

Nossa primeira viagem juntos teve um propósito forte: te acompanhar na tentativa de tirar o visto.

Foi a primeira vez que você viajou sem sua família. No avião, você agarrou meu braço — e ali eu me senti seu guardião.

Visitamos o Museu do Amanhã, pegamos sol nas praias, rimos, cansamos e até tivemos insolação.

Ah… e me perdoa por não termos comido no Dunkin' Donuts. Ainda vou compensar isso.

PrimeiraViagem... e o primeiro momento em que entendi o que era ser "nós" em tudo.

Seu protetor,
Victor`,
    location: "Museu do Amanhã, Rio de Janeiro – RJ",
    mapLink: "https://www.google.com/maps/place/Museu+do+Amanh%C3%A3,+Pra%C3%A7a+Mau%C3%A1,+1+-+Centro,+Rio+de+Janeiro+-+RJ",
    key: "PrimeiraViagem"
  },
  {
    title: "Meu BB",
    image: "https://i.postimg.cc/k4nWQ6BZ/IMG-1393.jpg",
    content: `BB,

Entre tantas palavras que poderiam representar o que você é pra mim, eu escolhi uma com apenas duas letras: BB.

BB virou mais do que apelido. Virou aconchego. Virou riso. Virou lar.

Pode parecer pouco… mas pra mim, cada vez que eu te chamo de BB, é como se dissesse:

"Você é meu amor, meu bem, meu tudo."

MeuBB... porque às vezes, só 2 letras bastam pra dizer tudo.

Para sempre seu,
Victor`,
    location: "Betim, MG",
    mapLink: "https://www.google.com/maps/place/Betim,+MG",
    key: "MeuBB"
  },
  {
    title: "Nossa Música",
    image: "https://i.postimg.cc/k5PQ5h97/20230109-115354.jpg",
    content: `Minha melodia,

Essa música representa mais pra mim do que pra você…

Porque ela me lembra todas as vezes em que precisei partir, te deixando ali, tentando ser forte.

E todas as vezes em que voltei — e você estava esperando por mim.

Mesmo longe, era o seu amor que me mantinha com os pés no chão.

NossaMúsica... porque, mesmo longe, seu amor sempre me trouxe de volta.

Scat Love Terminal – Jazztronik

Eternamente conectado,
Victor`,
    location: "Aeroporto Internacional de Confins, MG",
    mapLink: "https://www.google.com/maps/place/Aeroporto+Internacional+de+Belo+Horizonte+-+Confins+-+Tancredo+Neves",
    key: "NossaMúsica"
  },
  {
    title: "Nosso Sim",
    image: "https://i.postimg.cc/gk5yC2TX/20230325-231258.jpg",
    content: `Meu amor,

Eu queria ter feito uma surpresa grandiosa…

Mas naquele dia, eu não consegui esperar.

O amor transbordava, e eu só queria uma coisa: você.

Foi simples, direto, sem espetáculo. Mas foi de verdade.

E você disse sim.

NossoSim... porque o amor não espera — ele só pede pra ser vivido.

25 de março de 2023

Para sempre seu noivo,
Victor`,
    location: "Rua Joana Escolástica Rosa, 442 – Jardim das Alterosas, Betim – MG",
    mapLink: "https://www.google.com/maps/place/Rua+Joana+Escol%C3%A1stica+Rosa,+442,+Betim+-+MG",
    key: "NossoSim"
  },
  {
    title: "Melhor Viagem",
    image: "https://i.postimg.cc/t4xdpGKr/20240828-190514.jpg",
    content: `Minha aventureira,

Foi mais do que uma viagem.

Foi a realização de um sonho, nosso mundo particular no meio do frio.

Visitamos museus, praias geladas, rimos muito, e nos perdemos um no outro.

E sim… ainda me arrependo de não termos parado no Dunkin' Donuts.

MelhorViagem... porque estar com você fez do Chile o lugar mais bonito que já vi.

Julho de 2023

Seu companheiro de aventuras,
Victor`,
    location: "Santiago, Chile",
    mapLink: "https://www.google.com/maps/place/Santiago,+Chile",
    key: "MelhorViagem"
  },
  {
    title: "Sonho Branco",
    image: "https://i.postimg.cc/ncMYSD0f/20240829-095959.jpg",
    content: `Minha deusa das neves,

Você sonhava em ver a neve.

E eu sonhava em ver seus olhos brilhando quando esse momento chegasse.

E quando chegou… eu entendi:

Realizar seu sonho foi o maior presente que eu já me dei.

Portillo, Chile - onde seus sonhos se tornaram realidade.

Realizador de sonhos,
Victor`,
    location: "Portillo, Chile",
    mapLink: "https://www.google.com/maps/place/Portillo,+Chile",
    key: "SonhoBranco"
  },
  {
    title: "Pra Sempre Nós",
    image: "https://i.postimg.cc/Bb75QSZz/Captura-de-tela-2025-06-11-154800.png",
    content: `Minha vida,

A gente já foi tudo: Começo, meio, tropeço, silêncio, saudade, reencontro.

A gente já se perdeu — e ainda assim, nunca deixamos de se pertencer.

Houve um tempo em que não éramos mais "nós". As conversas pararam, o toque sumiu, a cama ficou vazia, e até os dias mais ensolarados pareciam cinzas.

Mas mesmo assim, você estava em tudo. Em cada canto da minha vida.

E então veio o reencontro. 25 de maio de 2025. Um dia comum pra quem vê de fora… mas pra mim, foi como se o tempo tivesse voltado a girar do jeito certo.

Escolhemos continuar. Escolhemos recomeçar. Escolhemos ser nós.

PraSempreNós... porque mesmo quebrados, decidimos ser inteiros — juntos.

Eternamente seu,
Victor`,
    location: "Betim, MG (local simbólico do reencontro)",
    mapLink: "https://www.google.com/maps/place/Betim,+MG",
    key: "PraSempreNós"
  }
];

export default function CardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cardIndex = parseInt(id || '1') - 1;
  const [cardContents, setCardContents] = useState(defaultCardContents);
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    checkCardAccess();
  }, [unlockedKeys, cardIndex]);

  const loadData = async () => {
    try {
      // Load custom cards if available
      const customCards = await AsyncStorage.getItem('customCards');
      if (customCards) {
        setCardContents(JSON.parse(customCards));
      }

      // Load unlocked keys
      const keys = await AsyncStorage.getItem('unlockedKeys');
      if (keys) {
        setUnlockedKeys(JSON.parse(keys));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCardAccess = () => {
    const card = cardContents[cardIndex];
    if (!card) {
      setIsUnlocked(false);
      return;
    }

    // Check if the card's key is in the unlocked keys
    const cardKey = card.key || defaultCardContents[cardIndex]?.key;
    const hasAccess = unlockedKeys.includes(cardKey);
    setIsUnlocked(hasAccess);
  };

  const handleBack = () => {
    router.back();
  };

  const handleGoToQuiz = () => {
    router.push('/(tabs)/quiz');
  };

  const handleGoToCards = () => {
    router.push('/(tabs)/cards');
  };

  const openMap = () => {
    const card = cardContents[cardIndex];
    if (card?.mapLink) {
      Linking.openURL(card.mapLink);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <AnimatedBackground>
        <View style={styles.loadingContainer}>
          <Heart size={40} color="#e91e63" />
          <Text style={styles.loadingText}>Carregando lembrança...</Text>
        </View>
      </AnimatedBackground>
    );
  }

  const card = cardContents[cardIndex];

  // Show error if card doesn't exist
  if (!card) {
    return (
      <AnimatedBackground>
        <View style={styles.errorContainer}>
          <Lock size={60} color="#ffc2cc" />
          <Text style={styles.errorTitle}>Carta não encontrada</Text>
          <Text style={styles.errorText}>
            Essa carta não existe em nossa história...
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={handleGoToCards}>
            <Text style={styles.backButtonText}>Voltar às cartas</Text>
          </TouchableOpacity>
        </View>
      </AnimatedBackground>
    );
  }

  // Show locked state if card is not unlocked
  if (!isUnlocked) {
    return (
      <AnimatedBackground>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerBackButton} onPress={handleBack}>
              <ArrowLeft size={24} color="#c2185b" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Carta {cardIndex + 1}</Text>
          </View>

          <View style={styles.lockedContainer}>
            <View style={styles.lockedIconContainer}>
              <Lock size={80} color="#ffc2cc" />
              <View style={styles.lockGlow} />
            </View>
            
            <Text style={styles.lockedTitle}>Essa lembrança ainda está trancada... 💌</Text>
            <Text style={styles.lockedText}>
              Você precisa da chave certa para abri-la.{'\n\n'}
              Complete o quiz para obter as chaves das nossas memórias especiais! 💕
            </Text>

            <View style={styles.lockedActions}>
              <TouchableOpacity style={styles.quizButton} onPress={handleGoToQuiz}>
                <Text style={styles.quizButtonText}>❓ Fazer Quiz</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cardsButton} onPress={handleGoToCards}>
                <Text style={styles.cardsButtonText}>💌 Voltar às Cartas</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </AnimatedBackground>
    );
  }

  // Show unlocked card content
  return (
    <AnimatedBackground>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#c2185b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{card.title}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: card.image }} style={styles.cardImage} />
            <View style={styles.imageOverlay} />
          </View>
          
          <View style={styles.letterContainer}>
            <Text style={styles.letterContent}>{card.content}</Text>
          </View>

          <TouchableOpacity style={styles.mapButton} onPress={openMap}>
            <MapPin size={20} color="#fff" />
            <Text style={styles.mapButtonText}>📍 {card.location}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backToCardsButton} onPress={handleBack}>
            <Text style={styles.backToCardsText}>Voltar às cartas</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#c2185b',
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c2185b',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e91e63',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  lockedIconContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  lockGlow: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    backgroundColor: '#ffc2cc',
    borderRadius: 50,
    opacity: 0.2,
    zIndex: 1,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c2185b',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  lockedText: {
    fontSize: 16,
    color: '#e91e63',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    fontStyle: 'italic',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  lockedActions: {
    width: '100%',
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
  cardsButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e91e63',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cardsButtonText: {
    color: '#e91e63',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerBackButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c2185b',
    flex: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
  width: '100%',
  height: undefined,
  aspectRatio: 3 / 2, // largura 3, altura 2 (ajuste conforme necessário)
  resizeMode: 'cover', // ou 'contain' se preferir mostrar tudo
},
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
  },
  letterContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.1)',
  },
  letterContent: {
    fontSize: 16,
    color: '#c2185b',
    lineHeight: 24,
    textAlign: 'left',
  },
  mapButton: {
    backgroundColor: '#e91e63',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    textAlign: 'center',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  backToCardsButton: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#c2185b',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#c2185b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  backToCardsText: {
    color: '#c2185b',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  backButton: {
    backgroundColor: '#e91e63',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
