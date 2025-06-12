import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreditCard as Edit3, Camera, Gift, Key, X, Heart, Download, FileText } from 'lucide-react-native';
import AnimatedBackground from '@/components/AnimatedBackground';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const defaultMemoryPhotos = [
  {
    id: 1,
    image: "https://i.postimg.cc/SQZCFxvL/20190922-215625.jpg",
    caption: "Primeiro jogo de Uno- Deixei voce ganhar porque te amo"
  },
  {
    id: 2,
    image: "https://i.postimg.cc/XqDCwsC1/20191225-153618.jpg",
    caption: "Primeiro Natal junto com sua familia, naquele dia voce me apresentou para eles"
  },
  {
    id: 3,
    image: "https://i.postimg.cc/tJg6ZKYV/20240829-124137.jpg",
    caption: "Nos 2 fazendo amizade na nossa viagem"
  },
  {
    id: 4,
    image: "https://i.postimg.cc/02bm81TT/IMG-0168.jpg",
    caption: "Você sempre comigo aonde quer que eu esteja"
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

export default function FutureScreen() {
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showPromisesModal, setShowPromisesModal] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [letterText, setLetterText] = useState('');
  const [secretPassword, setSecretPassword] = useState('');
  const [openedPromises, setOpenedPromises] = useState<number[]>([]);
  const [currentSecretPassword, setCurrentSecretPassword] = useState('eu te amo');
  const [memoryPhotos, setMemoryPhotos] = useState(defaultMemoryPhotos);
  const [promises, setPromises] = useState(defaultPromises);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedLetter = await AsyncStorage.getItem('userLetter');
      const savedPromises = await AsyncStorage.getItem('openedPromises');
      const savedSecretPassword = await AsyncStorage.getItem('secretPassword');
      const customPhotos = await AsyncStorage.getItem('customPhotos');
      const customPromises = await AsyncStorage.getItem('customPromises');
      
      if (savedLetter) setLetterText(savedLetter);
      if (savedPromises) setOpenedPromises(JSON.parse(savedPromises));
      if (savedSecretPassword) setCurrentSecretPassword(savedSecretPassword);
      if (customPhotos) setMemoryPhotos(JSON.parse(customPhotos));
      if (customPromises) setPromises(JSON.parse(customPromises));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveLetter = async () => {
    try {
      await AsyncStorage.setItem('userLetter', letterText);
      Alert.alert('Sucesso!', 'Sua carta foi salva com carinho ❤️');
      setShowLetterModal(false);
    } catch (error) {
      console.error('Error saving letter:', error);
    }
  };

  const generatePDF = async () => {
    if (!letterText.trim()) {
      Alert.alert('Ops!', 'Você precisa escrever uma carta primeiro, BB! 💕');
      return;
    }

    setIsGeneratingPDF(true);

    try {
      const currentDate = new Date().toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Carta Para Victor</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Crimson+Text:ital,wght@0,400;1,400&display=swap');
            
            body {
              font-family: 'Crimson Text', serif;
              background: linear-gradient(135deg, #ffe6eb 0%, #ffd1dc 50%, #ffb3c6 100%);
              margin: 0;
              padding: 40px;
              min-height: 100vh;
              box-sizing: border-box;
            }
            
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: rgba(255, 255, 255, 0.95);
              border-radius: 20px;
              padding: 50px;
              box-shadow: 0 20px 40px rgba(233, 30, 99, 0.2);
              border: 2px solid rgba(233, 30, 99, 0.1);
              position: relative;
              overflow: hidden;
            }
            
            .container::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="hearts" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><text x="10" y="15" text-anchor="middle" font-size="12" fill="%23ffb3c6" opacity="0.1">♥</text></pattern></defs><rect width="100" height="100" fill="url(%23hearts)"/></svg>');
              z-index: -1;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid rgba(233, 30, 99, 0.2);
              padding-bottom: 30px;
            }
            
            .title {
              font-family: 'Dancing Script', cursive;
              font-size: 36px;
              font-weight: 700;
              color: #c2185b;
              margin: 0 0 15px 0;
              text-shadow: 2px 2px 4px rgba(233, 30, 99, 0.1);
            }
            
            .subtitle {
              font-size: 18px;
              color: #e91e63;
              font-style: italic;
              margin: 0;
            }
            
            .content {
              line-height: 1.8;
              font-size: 16px;
              color: #2c1810;
              text-align: justify;
              margin: 40px 0;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            
            .footer {
              text-align: center;
              margin-top: 50px;
              padding-top: 30px;
              border-top: 2px solid rgba(233, 30, 99, 0.2);
            }
            
            .signature {
              font-family: 'Dancing Script', cursive;
              font-size: 24px;
              color: #c2185b;
              font-weight: 700;
              margin: 0;
            }
            
            .heart-decoration {
              font-size: 20px;
              color: #e91e63;
              margin: 10px 0;
            }
            
            @media print {
              body {
                background: white;
              }
              .container {
                box-shadow: none;
                border: 1px solid #ddd;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Nosso Amor, Nossa História</h1>
              <h2 class="title" style="font-size: 28px; margin-top: 10px;">Em Cada Lembrança 💖</h2>
              <p class="subtitle">${currentDate}</p>
            </div>
            
            <div class="content">${letterText}</div>
            
            <div class="footer">
              <div class="heart-decoration">💕 ♥ 💕</div>
              <p class="signature">Com amor, do seu BB. 💌</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
        width: 612,
        height: 792,
        margins: {
          left: 20,
          top: 20,
          right: 20,
          bottom: 20,
        },
      });

      if (Platform.OS === 'web') {
        // For web, create a download link
        const link = document.createElement('a');
        link.href = uri;
        link.download = 'CartaParaVictor.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Alert.alert(
          'PDF Gerado! 💌',
          'Sua carta romântica foi criada com sucesso!\n\nO download deve começar automaticamente.',
          [{ text: 'Perfeito! ❤️' }]
        );
      } else {
        // For mobile, save to device and share
        const fileName = 'CartaParaVictor.pdf';
        const newPath = `${FileSystem.documentDirectory}${fileName}`;
        
        await FileSystem.moveAsync({
          from: uri,
          to: newPath,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(newPath, {
            mimeType: 'application/pdf',
            dialogTitle: 'Compartilhar Carta Romântica 💌',
          });
        }

        Alert.alert(
          'PDF Gerado! 💌',
          'Sua carta romântica foi criada com sucesso!\n\nVocê pode compartilhá-la por WhatsApp, email ou salvá-la no seu dispositivo.',
          [{ text: 'Perfeito! ❤️' }]
        );
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert(
        'Ops! 😔',
        'Houve um problema ao gerar o PDF. Tente novamente, BB.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const openPromise = async (index: number) => {
    if (openedPromises.includes(index)) return;
    
    const newOpenedPromises = [...openedPromises, index];
    setOpenedPromises(newOpenedPromises);
    
    try {
      await AsyncStorage.setItem('openedPromises', JSON.stringify(newOpenedPromises));
    } catch (error) {
      console.error('Error saving promises:', error);
    }
  };

  const handleSecretCard = () => {
    if (secretPassword.toLowerCase().trim() === currentSecretPassword.toLowerCase().trim()) {
      setShowSecretModal(false);
      setSecretPassword('');
      router.push('/secret-card');
    } else {
      Alert.alert('Senha Incorreta', 'Tente novamente... pense no que mais importa ❤️');
    }
  };

  return (
    <AnimatedBackground>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>❤️ E agora?</Text>
          <Text style={styles.headerSubtitle}>
            Agora que você reviveu cada lembrança...{'\n'}
            quer criar a próxima comigo?
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowLetterModal(true)}
          >
            <Edit3 size={30} color="#e91e63" />
            <Text style={styles.optionTitle}>Escreva sua carta para mim</Text>
            <Text style={styles.optionDescription}>
              Conte seus sentimentos e pensamentos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowPhotosModal(true)}
          >
            <Camera size={30} color="#e91e63" />
            <Text style={styles.optionTitle}>Memórias em fotos</Text>
            <Text style={styles.optionDescription}>
              Relembre nossos momentos especiais
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowPromisesModal(true)}
          >
            <Gift size={30} color="#e91e63" />
            <Text style={styles.optionTitle}>Cofre de promessas</Text>
            <Text style={styles.optionDescription}>
              Abra cada promessa de amor
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secretSection}>
          <TouchableOpacity
            style={styles.secretButton}
            onPress={() => setShowSecretModal(true)}
          >
            <Key size={20} color="#c2185b" />
            <Text style={styles.secretText}>🔑 Carta secreta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Letter Modal */}
      <Modal
        visible={showLetterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLetterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.letterModalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLetterModal(false)}
            >
              <X size={24} color="#c2185b" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Sua Carta Para Mim</Text>
            
            <TextInput
              style={styles.letterInput}
              value={letterText}
              onChangeText={setLetterText}
              placeholder="Escreva aqui seus sentimentos..."
              placeholderTextColor="#ffc2cc"
              multiline
              textAlignVertical="top"
            />
            
            <View style={styles.letterActions}>
              <TouchableOpacity style={styles.saveButton} onPress={saveLetter}>
                <Text style={styles.saveButtonText}>Salvar com amor ❤️</Text>
              </TouchableOpacity>

              {letterText.trim() && (
                <TouchableOpacity 
                  style={[styles.pdfButton, isGeneratingPDF && styles.disabledButton]} 
                  onPress={generatePDF}
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <Text style={styles.pdfButtonText}>Gerando PDF... 💌</Text>
                  ) : (
                    <>
                      <FileText size={20} color="#fff" style={styles.pdfIcon} />
                      <Text style={styles.pdfButtonText}>Gerar Carta em PDF 💌</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Photos Modal */}
      <Modal
        visible={showPhotosModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotosModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.photosModalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPhotosModal(false)}
            >
              <X size={24} color="#c2185b" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Memórias em Fotos</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {memoryPhotos.map((photo) => (
                <View key={photo.id} style={styles.photoContainer}>
                  <View style={styles.photoPlaceholder}>
                    <Camera size={40} color="#ffc2cc" />
                    <Text style={styles.photoCaption}>{photo.caption}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Promises Modal */}
      <Modal
        visible={showPromisesModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPromisesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.promisesModalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPromisesModal(false)}
            >
              <X size={24} color="#c2185b" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Cofre de Promessas</Text>
            <Text style={styles.promisesSubtitle}>
              Toque em cada presente para abrir uma promessa especial 💝
            </Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {promises.map((promise, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.promiseBox,
                    openedPromises.includes(index) && styles.openedPromise,
                  ]}
                  onPress={() => openPromise(index)}
                >
                  {openedPromises.includes(index) ? (
                    <View style={styles.openedPromiseContent}>
                      <Heart size={20} color="#e91e63" style={styles.promiseHeart} />
                      <Text style={styles.promiseText}>{promise}</Text>
                    </View>
                  ) : (
                    <View style={styles.closedPromise}>
                      <Gift size={24} color="#ffc2cc" />
                      <Text style={styles.promiseNumber}>Promessa {index + 1}</Text>
                      <Text style={styles.tapToOpen}>Toque para abrir</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Secret Modal */}
      <Modal
        visible={showSecretModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSecretModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.secretModalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSecretModal(false)}
            >
              <X size={24} color="#c2185b" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Carta Secreta</Text>
            <Text style={styles.secretHint}>
              Digite a senha do coração:
            </Text>
            
            <TextInput
              style={styles.secretInput}
              value={secretPassword}
              onChangeText={setSecretPassword}
              placeholder="Digite aqui..."
              placeholderTextColor="#ffc2cc"
              secureTextEntry
            />
            
            <TouchableOpacity style={styles.unlockButton} onPress={handleSecretCard}>
              <Text style={styles.unlockButtonText}>Desbloquear</Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#c2185b',
    marginBottom: 15,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e91e63',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c2185b',
    marginTop: 15,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#e91e63',
    textAlign: 'center',
  },
  secretSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  secretButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secretText: {
    fontSize: 16,
    color: '#c2185b',
    marginLeft: 8,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    height: '70%',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  photosModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    height: '80%',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  promisesModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    height: '80%',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  secretModalContent: {
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
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c2185b',
    marginBottom: 20,
    textAlign: 'center',
  },
  promisesSubtitle: {
    fontSize: 14,
    color: '#e91e63',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  letterInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ffc2cc',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: '#c2185b',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  letterActions: {
    gap: 15,
  },
  saveButton: {
    backgroundColor: '#e91e63',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
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
  },
  pdfButton: {
    backgroundColor: '#4caf50',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#a5d6a7',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  pdfIcon: {
    marginRight: 8,
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  photoContainer: {
    marginBottom: 20,
  },
  photoPlaceholder: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  photoCaption: {
    fontSize: 14,
    color: '#c2185b',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  promiseBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffc2cc',
  },
  openedPromise: {
    backgroundColor: '#ffe6eb',
    borderColor: '#e91e63',
  },
  closedPromise: {
    alignItems: 'center',
  },
  openedPromiseContent: {
    alignItems: 'center',
  },
  promiseHeart: {
    marginBottom: 10,
  },
  promiseText: {
    fontSize: 16,
    color: '#c2185b',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  promiseNumber: {
    fontSize: 14,
    color: '#ffc2cc',
    marginTop: 5,
    fontWeight: '600',
  },
  tapToOpen: {
    fontSize: 12,
    color: '#ffc2cc',
    marginTop: 3,
    fontStyle: 'italic',
  },
  secretHint: {
    fontSize: 16,
    color: '#e91e63',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  secretInput: {
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
  unlockButton: {
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
  unlockButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
