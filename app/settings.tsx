import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, Lock, CreditCard as Edit3, Camera, Gift, Key, RotateCcw, Save, X, Trash2, Plus, Minus } from 'lucide-react-native';
import AnimatedBackground from '@/components/AnimatedBackground';

interface CardData {
  title: string;
  content: string;
  image: string;
  location: string;
  mapLink: string;
  key: string;
}

interface PhotoData {
  id: number;
  image: string;
  caption: string;
}

const defaultCardContents: CardData[] = [
  {
    title: "O Começo de Tudo",
    image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800",
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
    image: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: `Princesa,

Eu lembro do frio na barriga como se fosse hoje.

O Monte Carmo Shopping virou cenário de um momento único: a primeira vez que te vi pessoalmente.

Assistimos juntos ao live action de O Rei Leão. E ali, naquela sala escura, cercados por vozes cantando "Hakuna Matata", eu tive certeza de que aquele momento estaria guardado pra sempre.

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
    image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800",
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
    image: "https://images.pexels.com/photos/1702238/pexels-photo-1702238.jpeg?auto=compress&cs=tinysrgb&w=800",
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
    image: "https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=800",
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
    image: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800",
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
    image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800",
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
    image: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
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
    image: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: `Minha sereia das neves,

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
    image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800",
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
  },
  {
    title: "O Futuro (Carta Secreta)",
    image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: `Amor,

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
Victor.`,
    location: "Nosso futuro juntos",
    mapLink: "https://www.google.com/maps/place/Betim,+MG",
    key: "OFuturo"
  }
];

const defaultPhotos = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800",
    caption: "Nosso primeiro encontro - você estava linda de rosa"
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800",
    caption: "Dançando na sala - nossa música tocando"
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
    caption: "Primeira viagem - pôr do sol na praia"
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/4099238/pexels-photo-4099238.jpeg?auto=compress&cs=tinysrgb&w=800",
    caption: "Você fazendo brigadeiro - concentrada e linda"
  }
];

const defaultPromises = [
  "Prometo continuar te escolhendo mesmo nos dias difíceis.",
  "Prometo cuidar do seu coração como se fosse o meu.",
  "Prometo nunca deixar de lutar por nós.",
  "Prometo rir com você, chorar com você e viver tudo com você.",
  "Prometo estar do seu lado em cada sonho que realizarmos juntos.",
  "Prometo continuar te chamando de BB até ficarmos velhinhos.",
  "Prometo fazer do seu sorriso minha missão diária.",
  "Prometo que nunca vou me arrepender de ter te amado.",
  "Prometo que o nosso amor será sempre o meu lar.",
  "Prometo que nosso \"pra sempre\" será de verdade."
];

export default function SettingsScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showPromisesModal, setShowPromisesModal] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [showCardEditModal, setShowCardEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState<number | null>(null);
  const [cardData, setCardData] = useState<CardData[]>(defaultCardContents);
  const [photoData, setPhotoData] = useState<PhotoData[]>(defaultPhotos);
  const [promises, setPromises] = useState<string[]>(defaultPromises);
  const [settingsPassword, setSettingsPassword] = useState('Se031017');
  const [secretPassword, setSecretPassword] = useState('eu te amo');
  const [newSettingsPassword, setNewSettingsPassword] = useState('');
  const [newSecretPassword, setNewSecretPassword] = useState('');

  // Card editing states
  const [editCardTitle, setEditCardTitle] = useState('');
  const [editCardContent, setEditCardContent] = useState('');
  const [editCardImage, setEditCardImage] = useState('');
  const [editCardLocation, setEditCardLocation] = useState('');
  const [editCardMapLink, setEditCardMapLink] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedCards = await AsyncStorage.getItem('customCards');
      const savedPhotos = await AsyncStorage.getItem('customPhotos');
      const savedPromises = await AsyncStorage.getItem('customPromises');
      const savedSettingsPassword = await AsyncStorage.getItem('settingsPassword');
      const savedSecretPassword = await AsyncStorage.getItem('secretPassword');

      if (savedCards) {
        const parsedCards = JSON.parse(savedCards);
        // Ensure we have all 11 cards by merging with defaults
        const completeCards = defaultCardContents.map((defaultCard, index) => {
          return parsedCards[index] || defaultCard;
        });
        setCardData(completeCards);
      }
      if (savedPhotos) setPhotoData(JSON.parse(savedPhotos));
      if (savedPromises) setPromises(JSON.parse(savedPromises));
      if (savedSettingsPassword) setSettingsPassword(savedSettingsPassword);
      if (savedSecretPassword) setSecretPassword(savedSecretPassword);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === settingsPassword) {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setPassword('');
    } else {
      Alert.alert('Senha Incorreta', 'Tente novamente.');
      setPassword('');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleEditCard = (index: number) => {
    setEditingCard(index);
    const card = cardData[index];
    setEditCardTitle(card.title);
    setEditCardContent(card.content);
    setEditCardImage(card.image);
    setEditCardLocation(card.location);
    setEditCardMapLink(card.mapLink);
    setShowCardEditModal(true);
  };

  const saveCardEdit = async () => {
    if (editingCard === null) return;

    try {
      const updatedCards = [...cardData];
      updatedCards[editingCard] = {
        ...updatedCards[editingCard],
        title: editCardTitle,
        content: editCardContent,
        image: editCardImage,
        location: editCardLocation,
        mapLink: editCardMapLink,
      };

      await AsyncStorage.setItem('customCards', JSON.stringify(updatedCards));
      setCardData(updatedCards);
      Alert.alert('✅ Carta Salva!', `A Carta ${editingCard + 1} foi salva com sucesso! 💕\n\nSuas alterações já estão ativas no app.`);
      setShowCardEditModal(false);
      setEditingCard(null);
    } catch (error) {
      console.error('Error saving card:', error);
      Alert.alert('Erro', 'Erro ao salvar carta. Tente novamente.');
    }
  };

  const addPhoto = () => {
    const newPhoto: PhotoData = {
      id: Date.now(),
      image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Nova memória especial"
    };
    setPhotoData([...photoData, newPhoto]);
  };

  const removePhoto = (id: number) => {
    setPhotoData(photoData.filter(photo => photo.id !== id));
  };

  const updatePhoto = (id: number, field: 'image' | 'caption', value: string) => {
    setPhotoData(photoData.map(photo => 
      photo.id === id ? { ...photo, [field]: value } : photo
    ));
  };

  const savePhotoData = async () => {
    try {
      await AsyncStorage.setItem('customPhotos', JSON.stringify(photoData));
      Alert.alert('Sucesso!', 'Fotos salvas com sucesso! 📷');
      setShowPhotosModal(false);
    } catch (error) {
      console.error('Error saving photos:', error);
    }
  };

  const addPromise = () => {
    setPromises([...promises, "Nova promessa de amor..."]);
  };

  const removePromise = (index: number) => {
    setPromises(promises.filter((_, i) => i !== index));
  };

  const updatePromise = (index: number, value: string) => {
    setPromises(promises.map((promise, i) => i === index ? value : promise));
  };

  const savePromises = async () => {
    try {
      await AsyncStorage.setItem('customPromises', JSON.stringify(promises));
      Alert.alert('Sucesso!', 'Promessas salvas com sucesso! 💝');
      setShowPromisesModal(false);
    } catch (error) {
      console.error('Error saving promises:', error);
    }
  };

  const savePasswords = async () => {
    if (!newSettingsPassword.trim() || !newSecretPassword.trim()) {
      Alert.alert('Erro', 'Por favor, preencha ambas as senhas.');
      return;
    }

    try {
      await AsyncStorage.setItem('settingsPassword', newSettingsPassword);
      await AsyncStorage.setItem('secretPassword', newSecretPassword);
      setSettingsPassword(newSettingsPassword);
      setSecretPassword(newSecretPassword);
      setNewSettingsPassword('');
      setNewSecretPassword('');
      Alert.alert('Sucesso!', 'Senhas atualizadas com sucesso! 🔐');
      setShowPasswordChangeModal(false);
    } catch (error) {
      console.error('Error saving passwords:', error);
    }
  };

  const resetProgress = () => {
    Alert.alert(
      'Resetar Progresso',
      'Tem certeza que deseja apagar seu progresso, BB?\n\nIsso vai reiniciar o quiz e bloquear novamente as cartas. 💔\n\nSuas personalizações (cartas, fotos, promessas) serão mantidas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar Progresso',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove only progress-related data, keep customizations
              await AsyncStorage.multiRemove([
                'unlockedKeys',
                'readCards',
                'quizProgress',
                'globalErrorCount',
                'globalQuizTimeout',
                'mapVisited',
                'userLetter',
                'openedPromises'
              ]);
              
              Alert.alert(
                '✅ Progresso Resetado!',
                'Seu progresso foi apagado com sucesso, BB! 💕\n\nAgora você pode reviver nossa história desde o começo...\n\nVocê será redirecionado para o início.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Redirect to home screen
                      router.replace('/(tabs)/');
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Error resetting progress:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao resetar o progresso. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const resetEverything = () => {
    Alert.alert(
      '⚠️ Reiniciar Tudo',
      'Tem certeza que deseja apagar tudo e recomeçar o app do zero?\n\nTodo o progresso será perdido... 💔\n\n• Chaves obtidas no quiz\n• Cartas desbloqueadas\n• Progresso do quiz\n• Desbloqueio do mapa e "E agora?"\n• Carta secreta\n• Configurações personalizadas',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel' 
        },
        {
          text: 'Sim, quero recomeçar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove ALL app data
              await AsyncStorage.multiRemove([
                'unlockedKeys',
                'readCards',
                'quizProgress',
                'globalErrorCount',
                'globalQuizTimeout',
                'mapVisited',
                'userLetter',
                'openedPromises',
                'customCards',
                'customPhotos',
                'customPromises',
                'settingsPassword',
                'secretPassword'
              ]);
              
              Alert.alert(
                '✅ App Reiniciado!',
                'Tudo foi apagado com sucesso!\n\nVocê será redirecionado para o início... 💕',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Redirect to home screen
                      router.replace('/(tabs)/');
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Error resetting everything:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao reiniciar o app. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <AnimatedBackground>
        <Modal
          visible={showPasswordModal}
          transparent
          animationType="fade"
          onRequestClose={handleBack}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.passwordModalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
                <X size={24} color="#c2185b" />
              </TouchableOpacity>
              
              <Lock size={60} color="#e91e63" style={styles.lockIcon} />
              <Text style={styles.modalTitle}>Área Restrita</Text>
              <Text style={styles.modalSubtitle}>
                Digite a senha para acessar as configurações:
              </Text>
              
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Digite a senha..."
                placeholderTextColor="#ffc2cc"
                secureTextEntry
                autoFocus
              />
              
              <TouchableOpacity style={styles.submitButton} onPress={handlePasswordSubmit}>
                <Text style={styles.submitButtonText}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#c2185b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configurações</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Gerenciar Conteúdo</Text>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowEditModal(true)}
          >
            <Edit3 size={30} color="#e91e63" />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Editar Cartas</Text>
              <Text style={styles.optionDescription}>
                Edite o texto e imagens das 11 cartas (incluindo a secreta)
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowPhotosModal(true)}
          >
            <Camera size={30} color="#e91e63" />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Gerenciar Fotos</Text>
              <Text style={styles.optionDescription}>
                Adicione ou edite fotos da galeria de memórias
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowPromisesModal(true)}
          >
            <Gift size={30} color="#e91e63" />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Cofre de Promessas</Text>
              <Text style={styles.optionDescription}>
                Gerencie as frases do cofre de promessas
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setNewSettingsPassword(settingsPassword);
              setNewSecretPassword(secretPassword);
              setShowPasswordChangeModal(true);
            }}
          >
            <Key size={30} color="#e91e63" />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Alterar Senhas</Text>
              <Text style={styles.optionDescription}>
                Mude as senhas de acesso e da carta secreta
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Ações Avançadas</Text>

          <TouchableOpacity
            style={[styles.optionButton, styles.warningButton]}
            onPress={resetProgress}
          >
            <RotateCcw size={30} color="#ff9800" />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, styles.warningText]}>Resetar Progresso</Text>
              <Text style={styles.optionDescription}>
                Remove apenas o progresso do usuário (cartas, quiz)
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.dangerButton]}
            onPress={resetEverything}
          >
            <Trash2 size={30} color="#ff5722" />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, styles.dangerText]}>⚠️ Reiniciar Tudo</Text>
              <Text style={styles.optionDescription}>
                Apaga TUDO e volta ao estado inicial (cuidado!)
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Cards List Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.fullModalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowEditModal(false)}
            >
              <X size={24} color="#c2185b" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>💌 Editar Cartas</Text>
            <Text style={styles.modalSubtitle}>
              Toque em qualquer carta para editá-la completamente
            </Text>
            
            <ScrollView showsVerticalScrollIndicator={false} style={styles.cardsListContainer}>
              {cardData.map((card, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.cardEditButton,
                    index === 10 && styles.secretCardButton // Special styling for secret card
                  ]}
                  onPress={() => {
                    setShowEditModal(false);
                    handleEditCard(index);
                  }}
                >
                  <View style={styles.cardEditContent}>
                    <Text style={[
                      styles.cardEditNumber,
                      index === 10 && styles.secretCardNumber
                    ]}>
                      {index === 10 ? '🔐' : `${index + 1}`}
                    </Text>
                    <View style={styles.cardEditTextContainer}>
                      <Text style={[
                        styles.cardEditTitle,
                        index === 10 && styles.secretCardTitle
                      ]}>
                        {card.title}
                      </Text>
                      <Text style={styles.cardEditPreview}>
                        {card.content.substring(0, 60)}...
                      </Text>
                    </View>
                    <Edit3 size={20} color={index === 10 ? "#c2185b" : "#e91e63"} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Individual Card Edit Modal */}
      <Modal
        visible={showCardEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCardEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cardEditModalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCardEditModal(false)}
            >
              <X size={24} color="#c2185b" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>
              ✏️ Editando Carta {editingCard !== null ? editingCard + 1 : ''}
              {editingCard === 10 && ' (Secreta)'}
            </Text>
            
            <ScrollView showsVerticalScrollIndicator={false} style={styles.editFormContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>📝 Título da Carta:</Text>
                <TextInput
                  style={styles.textInput}
                  value={editCardTitle}
                  onChangeText={setEditCardTitle}
                  placeholder="Ex: O Começo de Tudo"
                  placeholderTextColor="#ffc2cc"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🖼️ URL da Imagem:</Text>
                <TextInput
                  style={styles.textInput}
                  value={editCardImage}
                  onChangeText={setEditCardImage}
                  placeholder="https://images.pexels.com/..."
                  placeholderTextColor="#ffc2cc"
                />
                {editCardImage && (
                  <View style={styles.imagePreview}>
                    <Image 
                      source={{ uri: editCardImage }} 
                      style={styles.previewImage}
                      onError={() => {}}
                    />
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>💌 Conteúdo da Carta:</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={editCardContent}
                  onChangeText={setEditCardContent}
                  placeholder="Escreva aqui o conteúdo completo da carta..."
                  placeholderTextColor="#ffc2cc"
                  multiline
                  numberOfLines={12}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>📍 Localização:</Text>
                <TextInput
                  style={styles.textInput}
                  value={editCardLocation}
                  onChangeText={setEditCardLocation}
                  placeholder="Ex: Monte Carmo Shopping, Betim – MG"
                  placeholderTextColor="#ffc2cc"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🗺️ Link do Google Maps:</Text>
                <TextInput
                  style={styles.textInput}
                  value={editCardMapLink}
                  onChangeText={setEditCardMapLink}
                  placeholder="https://www.google.com/maps/..."
                  placeholderTextColor="#ffc2cc"
                />
              </View>

              <TouchableOpacity style={styles.saveCardButton} onPress={saveCardEdit}>
                <Save size={24} color="#fff" />
                <Text style={styles.saveCardButtonText}>💕 Salvar Carta</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Photos Modal */}
      <Modal
        visible={showPhotosModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPhotosModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.fullModalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPhotosModal(false)}
            >
              <X size={24} color="#c2185b" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Gerenciar Fotos</Text>
            
            <TouchableOpacity style={styles.addButton} onPress={addPhoto}>
              <Plus size={20} color="#fff" />
              <Text style={styles.addButtonText}>Adicionar Foto</Text>
            </TouchableOpacity>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {photoData.map((photo) => (
                <View key={photo.id} style={styles.photoEditContainer}>
                  <View style={styles.photoEditHeader}>
                    <Text style={styles.photoEditTitle}>Foto {photo.id}</Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removePhoto(photo.id)}
                    >
                      <Minus size={16} color="#ff5722" />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.inputLabel}>URL da Imagem:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={photo.image}
                    onChangeText={(value) => updatePhoto(photo.id, 'image', value)}
                    placeholder="https://images.pexels.com/..."
                    placeholderTextColor="#ffc2cc"
                  />
                  
                  <Text style={styles.inputLabel}>Legenda:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={photo.caption}
                    onChangeText={(value) => updatePhoto(photo.id, 'caption', value)}
                    placeholder="Legenda da foto..."
                    placeholderTextColor="#ffc2cc"
                  />
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity style={styles.saveButton} onPress={savePhotoData}>
              <Save size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Promises Modal */}
      <Modal
        visible={showPromisesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPromisesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.fullModalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPromisesModal(false)}
            >
              <X size={24} color="#c2185b" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Cofre de Promessas</Text>
            
            <TouchableOpacity style={styles.addButton} onPress={addPromise}>
              <Plus size={20} color="#fff" />
              <Text style={styles.addButtonText}>Adicionar Promessa</Text>
            </TouchableOpacity>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {promises.map((promise, index) => (
                <View key={index} style={styles.promiseEditContainer}>
                  <View style={styles.promiseEditHeader}>
                    <Text style={styles.promiseEditTitle}>Promessa {index + 1}</Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removePromise(index)}
                    >
                      <Minus size={16} color="#ff5722" />
                    </TouchableOpacity>
                  </View>
                  
                  <TextInput
                    style={[styles.textInput, styles.promiseTextArea]}
                    value={promise}
                    onChangeText={(value) => updatePromise(index, value)}
                    placeholder="Digite a promessa..."
                    placeholderTextColor="#ffc2cc"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity style={styles.saveButton} onPress={savePromises}>
              <Save size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        visible={showPasswordChangeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPasswordChangeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.passwordChangeModalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPasswordChangeModal(false)}
            >
              <X size={24} color="#c2185b" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Alterar Senhas</Text>
            
            <Text style={styles.inputLabel}>Senha das Configurações:</Text>
            <TextInput
              style={styles.passwordInput}
              value={newSettingsPassword}
              onChangeText={setNewSettingsPassword}
              placeholder="Nova senha das configurações..."
              placeholderTextColor="#ffc2cc"
            />
            
            <Text style={styles.inputLabel}>Senha da Carta Secreta:</Text>
            <TextInput
              style={styles.passwordInput}
              value={newSecretPassword}
              onChangeText={setNewSecretPassword}
              placeholder="Nova senha da carta secreta..."
              placeholderTextColor="#ffc2cc"
            />
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={savePasswords}
            >
              <Save size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Salvar Senhas</Text>
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c2185b',
    marginBottom: 20,
    marginTop: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  warningButton: {
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  dangerButton: {
    borderWidth: 2,
    borderColor: '#ff5722',
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c2185b',
    marginBottom: 5,
  },
  warningText: {
    color: '#ff9800',
  },
  dangerText: {
    color: '#ff5722',
  },
  optionDescription: {
    fontSize: 14,
    color: '#e91e63',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordModalContent: {
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
  passwordChangeModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  fullModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '95%',
    height: '80%',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  cardEditModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '95%',
    height: '90%',
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
    zIndex: 1,
  },
  lockIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c2185b',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#e91e63',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  cardsListContainer: {
    flex: 1,
    marginBottom: 20,
  },
  cardEditButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ffc2cc',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secretCardButton: {
    backgroundColor: '#fff0f5',
    borderColor: '#c2185b',
    borderWidth: 2,
  },
  cardEditContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardEditNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63',
    width: 30,
    textAlign: 'center',
  },
  secretCardNumber: {
    color: '#c2185b',
  },
  cardEditTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  cardEditTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c2185b',
    marginBottom: 3,
  },
  secretCardTitle: {
    color: '#c2185b',
  },
  cardEditPreview: {
    fontSize: 12,
    color: '#e91e63',
    fontStyle: 'italic',
  },
  editFormContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#c2185b',
    fontWeight: '600',
    marginBottom: 8,
  },
  passwordInput: {
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
  textInput: {
    borderWidth: 2,
    borderColor: '#ffc2cc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#c2185b',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  promiseTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imagePreview: {
    marginTop: 10,
    alignItems: 'center',
  },
  previewImage: {
    width: 100,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  saveCardButton: {
    backgroundColor: '#e91e63',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveCardButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  submitButton: {
    backgroundColor: '#e91e63',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
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
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  photoEditContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffc2cc',
  },
  photoEditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoEditTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c2185b',
  },
  promiseEditContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffc2cc',
  },
  promiseEditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  promiseEditTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c2185b',
  },
  removeButton: {
    backgroundColor: '#ffebee',
    borderRadius: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ff5722',
  },
  saveButton: {
    backgroundColor: '#e91e63',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});