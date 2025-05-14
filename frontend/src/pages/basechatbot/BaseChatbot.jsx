import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Avatar, Stack, Fade, Grid, Button, CircularProgress } from '@mui/material';
import ReturnPanel from '../../components/returns/ReturnPanel';
import ComplaintPanel from '../../components/complaints/ComplaintPanel';
import LoginIcon from '@mui/icons-material/Login';
import SendIcon from '@mui/icons-material/Send';
import { chatbotService, authService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const defaultOptions = [
  { key: 'live', label: 'Canlı Destek (isteğe bağlı)', requiresAuth: true },
  { key: 'return', label: 'İade İşlemleri', requiresAuth: true },
  { key: 'product', label: 'Ürün Sorgulama', requiresAuth: false },
  { key: 'complaint', label: 'Şikayet Bildirme', requiresAuth: false },
  { key: 'other', label: 'Diğer', requiresAuth: false }
];

const BaseChatbot = ({
  logo,
  title,
  primary,
  secondary,
  options = defaultOptions,
  companyName,
  userData,
  isAuthenticated = false,
  onLoginRequired
}) => {
  const [step, setStep] = useState('main');
  const [messages, setMessages] = useState([
    { id: 0, text: `Merhaba! ${companyName} destek botuna hoş geldiniz. Size nasıl yardımcı olabilirim?`, sender: 'bot' },
    { id: 1, text: 'Aşağıdaki işlemlerden birini seçebilir veya doğrudan mesaj yazabilirsiniz:', sender: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeSidePanel, setActiveSidePanel] = useState(null); // 'return' veya 'complaint'
  const chatEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [menuDisplayed, setMenuDisplayed] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // Kullanıcı işlem seçenekleri
  const quickOptions = [
    { id: 'iade', text: '📦 İade Talebi', action: 'RETURN' },
    { id: 'sikayet', text: '📝 Şikayet Bildirimi', action: 'COMPLAINT' },
    { id: 'siparis', text: '🛒 Sipariş Takibi', action: 'ORDER_TRACK' },
    { id: 'yardim', text: '❓ Nasıl Yardımcı Olabilirim', action: 'HELP' }
  ];

  // İade ile ilgili anahtar kelimeleri tanımla
  const RETURN_KEYWORDS = ['iade', 'geri ödeme', 'para iade', 'sipariş iade', 'geri vermek', 'geri gönder'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Başlangıçta menüyü göster
  useEffect(() => {
    if (!menuDisplayed) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: prev.length, text: 'Lütfen yapmak istediğiniz işlemi numara ile seçin:\n1. Ürün Sorgulama\n\n2. Şikayet Bildirme\n\n3. Diğer\n\n(Numara veya işlem adını yazarak seçim yapabilirsiniz)', sender: 'bot' }
        ]);
        setMenuDisplayed(true);
      }, 1000);
    }
  }, [menuDisplayed]);

  // Kullanıcı giriş yaptıktan sonra kaldığı yerden devam et
  useEffect(() => {
    const resumeSession = async () => {
      if (isAuthenticated && userData && sessionId) {
        try {
          setIsLoading(true);
          console.log('Oturum kaldığı yerden devam ediyor, Session ID:', sessionId, 'User ID:', userData.id);
          const response = await chatbotService.resumeAfterLogin(sessionId, userData.id);
          
          if (response) {
            console.log('Chatbot oturumu yüklendi:', response);
            setSessionId(sessionId);
            
            // Redis'ten gelen mesajlar varsa göster
            if (response.messages && response.messages.length > 0) {
              console.log("DEBUG: Mesajlar bulundu, sayısı:", response.messages.length);
              
              // Mevcut karşılama mesajlarını koru, diğer mesajları ekle
              let newMessages = [
                { id: 0, text: `Merhaba ${userData.name || ''}! ${companyName} destek botuna hoş geldiniz. Size nasıl yardımcı olabilirim?`, sender: 'bot' }
              ];
              
              // Redis'ten gelen mesajları ekle
              response.messages.forEach((msg, index) => {
                console.log(`DEBUG: Mesaj ${index+1}:`, msg);
                newMessages.push({
                  id: newMessages.length,
                  text: msg.content,
                  sender: msg.isUserMessage ? 'user' : 'bot'
                });
              });
              
              // Hoşgeldin mesajı ekle
              newMessages.push({
                id: newMessages.length,
                text: `Hoş geldiniz ${userData.name || ''}! Kaldığımız yerden devam ediyoruz. Nasıl yardımcı olabilirim?`,
                sender: 'bot'
              });
              
              console.log("DEBUG: Yeni mesaj dizisi:", newMessages);
              setMessages(newMessages);
              
              // İade talebi varsa ve konu iadeyle ilgiliyse formu aç
              const lastMessages = response.messages.slice(-3);
              const hasReturnRequest = lastMessages.some(msg => 
                msg.isUserMessage && checkForReturnRequest(msg.content)
              );
              
              // Veya backend etiketlemesi RETURN türündeyse
              const isReturnQuery = response.queryType === 'RETURN';
              
              console.log("DEBUG: İade talebi var mı:", hasReturnRequest, "RETURN tipi mi:", isReturnQuery);
              
              if (hasReturnRequest || isReturnQuery) {
                console.log('İade konusu tespit edildi, form açılıyor');
                setTimeout(() => {
                  setActiveSidePanel('return');
                }, 500);
              }
            } else if (response.lastMessage) {
              // Sadece son mesaj varsa
              console.log("DEBUG: Son mesaj bulundu, mesajlar dizisi yok:", response.lastMessage);
              
              // Son mesajı iade içeriği için detaylıca kontrol et
              // Bilgiler chatbotunda mesajları saklansın ve hala iade yazdım giriş yaptım geri sayfaya geldik... gibi uzun metinlerde iade kelimesi tespit için
              const isReturnRequest = checkForReturnRequest(response.lastMessage);
              
              // Kullanıcı hoşgeldin mesajı
              let welcomeMessage = `Hoş geldiniz ${userData.name || ''}! `;
              
              // İade ile ilgili mesaj varsa
              if (isReturnRequest) {
                welcomeMessage += 'İade talebinizle ilgili işleme devam ediyoruz.';
                console.log("İade talebi tespit edildi, form açılacak");
                
                // Mesajları güncelle ve iade talebine devam et
                setMessages([
                  { id: 0, text: `Merhaba ${userData.name || ''}! ${companyName} destek botuna hoş geldiniz. Size nasıl yardımcı olabilirim?`, sender: 'bot' },
                  { id: 1, text: response.lastMessage, sender: 'user' },
                  { id: 2, text: welcomeMessage, sender: 'bot' },
                  { id: 3, text: 'Lütfen iade talebinizle ilgili aşağıdaki bilgileri doldurun.', sender: 'bot' }
                ]);
                
                // İade formunu aç
                console.log('İade konusu tespit edildi, form açılıyor (lastMessage içeriğinden)');
                setTimeout(() => {
                  setActiveSidePanel('return');
                }, 500);
              } else {
                // Diğer durumlar için normal karşılama
                setMessages([
                  { id: 0, text: `Merhaba ${userData.name || ''}! ${companyName} destek botuna hoş geldiniz. Size nasıl yardımcı olabilirim?`, sender: 'bot' },
                  { id: 1, text: response.lastMessage, sender: 'user' },
                  { id: 2, text: welcomeMessage + 'Kaldığımız yerden devam ediyoruz. Nasıl yardımcı olabilirim?', sender: 'bot' }
                ]);
              }
            } else {
              // Hiç mesaj yoksa, sadece login mesajı ekle
              console.log("DEBUG: Hiç mesaj bulunamadı");
              
              setMessages([
                { id: 0, text: `Merhaba ${userData.name || ''}! ${companyName} destek botuna hoş geldiniz. Size nasıl yardımcı olabilirim?`, sender: 'bot' },
                { id: 1, text: `Hoş geldiniz ${userData.name || ''}! Size nasıl yardımcı olabilirim?`, sender: 'bot' }
              ]);
            }
          } else {
            console.log("DEBUG: Sunucudan geçerli yanıt alınamadı");
          }
          
        } catch (error) {
          console.error('Resume error:', error);
          setMessages(prev => [
            { id: 0, text: `Merhaba ${userData.name || ''}! ${companyName} destek botuna hoş geldiniz. Size nasıl yardımcı olabilirim?`, sender: 'bot' },
            { id: 1, text: 'Önceki oturumunuza devam ederken bir hata oluştu.', sender: 'bot' }
          ]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    resumeSession();
  }, [isAuthenticated, userData, sessionId, companyName]);

  // Oturum durumunu kontrol et - çıkış yapıldığında chatbot'u sıfırla
  useEffect(() => {
    const checkAuthStatus = () => {
      const isLoggedIn = localStorage.getItem('isCustomerLoggedIn') === 'true';
      
      // Kullanıcı çıkış yapmışsa chatbot oturumunu sıfırla
      if (!isLoggedIn && sessionId) {
        console.log('Kullanıcı çıkış yapmış, chatbot oturumu sıfırlanıyor');
        setSessionId(null);
        
        // İlk karşılama mesajlarını göster
        setMessages([
          { id: 0, text: `Merhaba! ${companyName} destek botuna hoş geldiniz. Size nasıl yardımcı olabilirim?`, sender: 'bot' },
          { id: 1, text: 'Aşağıdaki işlemlerden birini seçebilir veya doğrudan mesaj yazabilirsiniz:', sender: 'bot' },
        ]);
        
        setMenuDisplayed(false);
      }
    };
    
    // Sayfa yüklendiğinde ve her localStorage değişikliğinde kontrol et
    window.addEventListener('storage', checkAuthStatus);
    checkAuthStatus();
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [companyName, sessionId]);

  // Kullanıcı giriş durumunu dinle - Login olduktan sonra chatbot'u güncelle
  useEffect(() => {
    if (isAuthenticated && userData) {
      // Son mesajı kontrol et - iade içeriyorsa otomatik form aç
      const lastMessage = localStorage.getItem(`${companyName.toLowerCase()}_last_message`);
      if (lastMessage && checkForReturnRequest(lastMessage)) {
        console.log("Giriş yapıldıktan sonra son mesaj kontrolü: İade talebi tespit edildi");
        
        // İade formu açılacağını belirt - Burada key çakışması olabilir, dikkatli oluştur
        setTimeout(() => {
          // Önce mevcut mesajları al
          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            const newId = Date.now(); // Benzersiz ID oluştur
            
            // Yeni mesaj ekle
            updatedMessages.push({
              id: newId, 
              text: 'İade talebinizi almak için aşağıdaki formu doldurun.', 
              sender: 'bot'
            });
            
            return updatedMessages;
          });
          
          // Hemen form aç
          setActiveSidePanel('return');
        }, 500);
      }
      
      // Temizleme işlemi
      localStorage.removeItem(`${companyName.toLowerCase()}_last_message`);
    }
  }, [isAuthenticated, userData, companyName]);

  // Sayfa yüklendiğinde chatbot durumunu kontrol et ve gerekirse eski durumu geri yükle
  useEffect(() => {
    // Kullanıcı giriş yaptıysa ve önceden kaydedilmiş bir chatbot durumu varsa
    if (isAuthenticated && userData) {
      console.log("DEBUG: Giriş durumu kontrol ediliyor, oturum restore ediliyor...");
      
      // Önceki chatbot oturumu var mı diye kontrol et
      const savedSessionId = localStorage.getItem(`${companyName.toLowerCase()}_chatbot_session`);
      if (savedSessionId) {
        console.log("DEBUG: Kayıtlı oturum ID bulundu:", savedSessionId);
        setSessionId(savedSessionId);
      }
      
      // Login öncesi kaydedilmiş mesajlar var mı?
      const savedMessages = localStorage.getItem(`${companyName.toLowerCase()}_pre_login_messages`);
      const savedQuery = localStorage.getItem(`${companyName.toLowerCase()}_pre_login_query`);
      
      if (savedMessages) {
        try {
          // Mesajları geri yükle
          const parsedMessages = JSON.parse(savedMessages);
          console.log("DEBUG: Kayıtlı mesajlar yükleniyor:", parsedMessages);
          
          // Eğer bir iade işlemi yapılıyorsa otomatik olarak iade formunu göster
          const lastUserMessage = parsedMessages
            .filter(m => m.sender === 'user')
            .pop()?.text?.toLowerCase() || '';
          
          const isReturnRequest = checkForReturnRequest(lastUserMessage) || checkForReturnRequest(savedQuery || '');
          console.log("DEBUG: İade konusu var mı?", isReturnRequest, "Son kullanıcı mesajı:", lastUserMessage, "Kayıtlı sorgu:", savedQuery);
          
          // Yeni mesaj dizisi oluştur - ID çakışmalarını önlemek için yeniden ID ata
          const baseMessages = [
            { id: Date.now(), text: `Merhaba ${userData.name || ''}! ${companyName} destek botuna hoş geldiniz. Size nasıl yardımcı olabilirim?`, sender: 'bot' },
          ];
          
          // Kayıtlı mesajları ekle (benzersiz ID'ler ile)
          const restoredMessages = parsedMessages.slice(2).map((msg, index) => ({
            ...msg,
            id: Date.now() + index + 1 // Benzersiz ID oluştur
          }));
          
          // Karşılama mesajını ekle
          const welcomeMessage = {
            id: Date.now() + restoredMessages.length + 1,
            text: `Başarıyla giriş yaptınız, ${userData.name || ''}! Kaldığımız yerden devam edebiliriz.`,
            sender: 'bot'
          };
          
          // Mesajları güncelle
          setMessages([...baseMessages, ...restoredMessages, welcomeMessage]);
          
          // Eğer iade isteği varsa ve kullanıcı giriş yapmışsa form göster
          if (isReturnRequest) {
            console.log("DEBUG: İade formu açılıyor (localStorage'dan gelen bilgi ile)");
            
            // İade formu açılacağını belirt
            setTimeout(() => {
              setMessages(prevMessages => [
                ...prevMessages,
                { 
                  id: Date.now() + 1000, // Benzersiz ID
                  text: 'İade talebinizi almak için lütfen aşağıdaki formu doldurun.', 
                  sender: 'bot' 
                }
              ]);
              
              // Formu aç (biraz gecikme ile)
              setTimeout(() => {
                setActiveSidePanel('return');
              }, 100);
            }, 500);
          }
          
          // Temizle
          localStorage.removeItem(`${companyName.toLowerCase()}_pre_login_messages`);
          localStorage.removeItem(`${companyName.toLowerCase()}_pre_login_query`);
          
        } catch (error) {
          console.error('Saved chatbot state could not be restored:', error);
        }
      } else {
        console.log("DEBUG: Kayıtlı mesaj bulunamadı");
        
        // Mesajlar yoksa direkt olarak giriş yapılmış iade içeriği var mı diye kontrol et
        const storedLastMessage = localStorage.getItem(`${companyName.toLowerCase()}_last_message`);
        if (storedLastMessage && checkForReturnRequest(storedLastMessage)) {
          console.log("DEBUG: Son mesaj içeriğinde iade talebi tespit edildi:", storedLastMessage);
          
          // Her mesaj için benzersiz ID oluştur
          const currentTime = Date.now();
          setMessages([
            { id: currentTime, text: `Merhaba ${userData.name || ''}! ${companyName} destek botuna hoş geldiniz. Size nasıl yardımcı olabilirim?`, sender: 'bot' },
            { id: currentTime + 1, text: storedLastMessage, sender: 'user' },
            { id: currentTime + 2, text: `Hoş geldiniz ${userData.name || ''}! İade talebiniz için lütfen aşağıdaki formu doldurun.`, sender: 'bot' }
          ]);
          
          // Formu doğrudan aç
          setTimeout(() => {
            setActiveSidePanel('return');
          }, 300);
          
          localStorage.removeItem(`${companyName.toLowerCase()}_last_message`);
        }
      }
    }
  }, [isAuthenticated, userData, companyName]);

  // İade talebi kontrolü için yardımcı fonksiyon
  const checkForReturnRequest = (text) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return RETURN_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  // Form değişikliklerini izle
  const handleFormChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Form gönderildiğinde
  const handleFormSubmit = async () => {
    // Form verilerinin doluluğunu kontrol et
    const isFormValid = Object.keys(formData).length > 0;
    
    if (!isFormValid) {
      setMessages(prev => [...prev, { id: prev.length, text: 'Lütfen form alanlarını doldurunuz.', sender: 'bot' }]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Form tipine göre işlemi belirle
      if (activeSidePanel === 'return') {
        await handleReturnSubmit(formData);
      } else if (activeSidePanel === 'complaint') {
        await handleComplaintSubmit(formData);
      }
      
      // Form verilerini temizle
      setFormData({});
      setFormFields([]);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setMessages(prev => [...prev, { id: prev.length, text: 'Form gönderilirken bir hata oluştu.', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mesaj gönderme işlemi
  const handleSend = async () => {
    if (inputValue.trim() === '') return;
    
    // İade kelimelerini kontrol et - En önce yap
    const isReturnRequest = checkForReturnRequest(inputValue);
    
    // Benzersiz ID ile mesaj oluştur
    const newMessages = [
      ...messages,
      { id: Date.now(), text: inputValue, sender: 'user' }
    ];
    
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // İade veya geri ödeme kelimesi geçiyorsa ve kullanıcı giriş yapmamışsa direkt login sayfasına yönlendir
      if (isReturnRequest && !isAuthenticated) {
        setIsLoading(false);
        
        // Mevcut oturum ID'sini localStorage'e kaydet (login sonrası devam etmek için)
        if (sessionId) {
          localStorage.setItem(`${companyName.toLowerCase()}_chatbot_session`, sessionId);
        }
        
        // Son mesajı (iade ile ilgili) localStorage'a kaydet
        localStorage.setItem(`${companyName.toLowerCase()}_last_message`, inputValue);
        
        // Kullanıcıya bilgi mesajı göster ve yönlendir
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, text: 'İade işlemleri için giriş yapmanız gerekiyor. Giriş sayfasına yönlendiriliyorsunuz...', sender: 'bot' }
        ]);
        
        // Mevcut mesajları ve istek içeriğini kaydet (login sonrası devam etmek için)
        localStorage.setItem(`${companyName.toLowerCase()}_pre_login_messages`, JSON.stringify(messages));
        localStorage.setItem(`${companyName.toLowerCase()}_pre_login_query`, inputValue);
        
        // 1 saniye bekleyip yönlendir
        setTimeout(() => {
          onLoginRequired(); // Login sayfasına yönlendir
        }, 1000);
        
        return;
      }
      
      // Kullanıcı giriş yapmışsa ve iade kelimelerini kullandıysa, API çağrısından ÖNCE iade formunu aç
      if (isAuthenticated && isReturnRequest) {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, text: 'İade talebinizi almak için lütfen aşağıdaki formu doldurun.', sender: 'bot' }
        ]);
        
        console.log('Doğrudan iade formu açılıyor...');
        setTimeout(() => {
          setActiveSidePanel('return');
          setIsLoading(false);
        }, 300);
        
        return; // API çağrısı yapma, doğrudan form göster
      }
      
      // Kullanıcı ID'si (varsa)
      const userId = userData?.id;
      
      // API'ye mesajı gönder
      const response = await chatbotService.sendMessage(inputValue, userId, companyName);
      
      // Oturum ID'sini kaydet
      if (response.sessionId) {
        setSessionId(response.sessionId);
        localStorage.setItem(`${companyName.toLowerCase()}_chatbot_session`, response.sessionId);
      }
      
      // Etiketleme sonucunu kontrol et
      const labelType = response.labelingResult?.label;
      
      // Yetkilendirme gerektiren işlemler için kontrol
      if (labelType === 'RETURN' || labelType === 'COMPLAINT' || labelType === 'CLASSIC_QUERY') {
        if (!isAuthenticated) {
          setMessages(prev => [
            ...prev,
            { id: prev.length, text: 'Bu işlemi gerçekleştirmek için giriş yapmanız gerekiyor. Giriş sayfasına yönlendiriliyorsunuz...', sender: 'bot' }
          ]);
          
          // Mevcut mesajları ve durumu localStorage'e kaydet
          if (sessionId) {
            localStorage.setItem(`${companyName.toLowerCase()}_pre_login_messages`, JSON.stringify(messages));
            localStorage.setItem(`${companyName.toLowerCase()}_pre_login_query`, inputValue);
            localStorage.setItem(`${companyName.toLowerCase()}_return_path`, window.location.pathname);
          }
          
          // 1 saniye bekleyip yönlendir
          setTimeout(() => {
            onLoginRequired(); // Login sayfasına yönlendir
          }, 1000);
          
          setIsLoading(false);
          return;
        }
      }
      
      // Bot yanıtını göster
      setMessages(prev => [
        ...prev,
        { id: prev.length, text: response.message, sender: 'bot' }
      ]);
      
      // Form gerektiren bir işlem ise form alanlarını göster
      if (response.nextStep === 'RETURN_FORM' || response.nextStep === 'COMPLAINT_FORM') {
        setStep(response.nextStep);
        setActiveSidePanel(response.nextStep === 'RETURN_FORM' ? 'return' : 'complaint');
        
        // Form alanlarını göster
        if (response.formFields) {
          setFormFields(response.formFields);
        } else {
          // Varsayılan form alanları
          const defaultFields = response.nextStep === 'RETURN_FORM' 
            ? [
                { name: 'returnReason', type: 'select', label: 'İade Nedeni', 
                  options: ['Ürün hasarlı geldi', 'Yanlış ürün geldi', 'Ürün beklentileri karşılamadı', 'Fikir değişikliği', 'Diğer']},
                { name: 'orderNo', type: 'text', label: 'Sipariş Numarası'},
                { name: 'explanation', type: 'textarea', label: 'Açıklama'}
              ]
            : [
                { name: 'title', type: 'text', label: 'Şikayet Başlığı'},
                { name: 'unit', type: 'select', label: 'İlgili Birim', 
                  options: ['Ürün Kalitesi', 'Kargo/Teslimat', 'Müşteri Hizmetleri', 'Web Sitesi/Uygulama', 'Diğer']},
                { name: 'description', type: 'textarea', label: 'Detaylı Açıklama'}
              ];
              
          setFormFields(defaultFields);
        }
      }
      
    } catch (error) {
      console.error('Message error:', error);
      
      // Daha detaylı hata mesajı göster
      let errorMessage = 'Üzgünüm, mesajınızı işlerken bir hata oluştu. Lütfen tekrar deneyin.';
      
      // Bağlantı hatası kontrolü
      if (error.message && error.message.includes('Network Error')) {
        errorMessage = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.';
      } else if (error.response) {
        // Sunucudan dönen hata
        if (error.response.status === 404) {
          errorMessage = 'Sunucu bu isteği işleyemedi. API endpoint bulunamadı.';
        } else if (error.response.status === 500) {
          errorMessage = 'Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        }
      }
      
      setMessages(prev => [...prev, { id: prev.length, text: errorMessage, sender: 'bot' }]);
      
      // Numara ile işlem seçme seçeneği sun
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: prev.length, text: 'Lütfen yapmak istediğiniz işlemi numara ile seçin:\n1. Ürün Sorgulama\n\n2. Şikayet Bildirme\n\n3. Diğer\n\n(Numara veya işlem adını yazarak seçim yapabilirsiniz)', sender: 'bot' }
        ]);
      }, 1000);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSidePanel = () => {
    setActiveSidePanel(null);
    setMessages(prevMessages => [
      ...prevMessages,
      { id: prevMessages.length, text: 'Size başka nasıl yardımcı olabilirim?', sender: 'bot' }
    ]);
    setStep('main');
  };

  const handleReturnSubmit = async (returnData) => {
    try {
      setIsLoading(true);
      const response = await chatbotService.processReturn({
        ...returnData,
        userId: userData?.id
      });
      
      setMessages(prev => [...prev, { id: prev.length, text: response.message || 'İade talebiniz başarıyla oluşturuldu.', sender: 'bot' }]);
      
      handleCloseSidePanel();
    } catch (error) {
      console.error('Return process error:', error);
      setMessages(prev => [...prev, { id: prev.length, text: 'İade işlemi oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplaintSubmit = async (complaintData) => {
    try {
      setIsLoading(true);
      const response = await chatbotService.processComplaint({
        ...complaintData,
        userId: userData?.id
      });
      
      setMessages(prev => [...prev, { id: prev.length, text: response.message || 'Şikayetiniz başarıyla iletildi.', sender: 'bot' }]);
      
      handleCloseSidePanel();
    } catch (error) {
      console.error('Complaint process error:', error);
      setMessages(prev => [...prev, { id: prev.length, text: 'Şikayetiniz iletilirken bir hata oluştu. Lütfen tekrar deneyin.', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSidePanel = () => {
    const theme = { primary, secondary, logo };
    
    console.log("Rendering side panel:", activeSidePanel, "User data:", userData);
    
    if (!activeSidePanel) return null;
    
    // Kullanıcı verisi yoksa form açma
    if (!userData && isAuthenticated) {
      console.error("Kullanıcı verisi yok ama oturum aktif!");
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="error">
            Kullanıcı bilgileri yüklenemedi. Lütfen sayfayı yenileyiniz.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Sayfayı Yenile
          </Button>
        </Box>
      );
    }
    
    switch (activeSidePanel) {
      case 'return':
        // Form açılırken loglama
        console.log("Return panel açılıyor, kullanıcı verileri:", userData);
        
        // ReturnPanel'ı göster
        return (
          <ReturnPanel 
            theme={theme}
            companyName={companyName}
            onClose={handleCloseSidePanel}
            userData={userData}
            onSubmit={handleReturnSubmit}
          />
        );
      case 'complaint':
        return (
          <ComplaintPanel 
            theme={theme}
            companyName={companyName}
            onClose={handleCloseSidePanel}
            userData={userData}
            onSubmit={handleComplaintSubmit}
          />
        );
      default:
        return null;
    }
  };

  // Kullanıcı bilgilerini göster
  const renderUserInfo = () => {
    if (isAuthenticated && userData) {
      return (
        <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Giriş yapan kullanıcı:
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {userData.name || userData.fullName || userData.email || 'Misafir Kullanıcı'}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Seçenek listesi oluştur - login durumuna göre gösterilebilen seçenekleri belirle
  const renderOptions = () => {
    const availableOptions = options.filter(option => 
      !option.requiresAuth || isAuthenticated
    );

    if (availableOptions.length === 0) {
      return (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Seçenek bulunamadı.
        </Typography>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Lütfen yapmak istediğiniz işlemi numara ile seçin:
        </Typography>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: '#f9f9f9' }}>
          {availableOptions.map((option, idx) => (
            <Typography key={option.key} variant="body1" sx={{ mb: 1.2, fontSize: 18 }}>
              <b>{idx + 1}.</b> {option.label}
              {option.requiresAuth && !isAuthenticated && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  sx={{ ml: 1, py: 0, minWidth: 'auto' }}
                  onClick={onLoginRequired}
                >
                  Giriş Gerekli
                </Button>
              )}
            </Typography>
          ))}
        </Paper>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          (Numara veya işlem adını yazarak seçim yapabilirsiniz)
        </Typography>
      </Box>
    );
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Değişiklik fonksiyonları
  const handleReturnFormForceOpen = () => {
    console.log("İade formu manuel olarak açılıyor");
    setActiveSidePanel('return');
  };

  // Render form fields
  const renderFormFields = () => {
    if (!formFields || formFields.length === 0) return null;
    
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          padding: 2, 
          marginTop: 2,
          borderRadius: 2
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          {activeSidePanel === 'return' ? 'İade Formu' : 'Şikayet Formu'}
        </Typography>
        
        {formFields.map((field) => (
          <Box key={field.name} sx={{ marginBottom: 2 }}>
            {field.type === 'select' ? (
              <>
                <Typography variant="body2" sx={{ marginBottom: 0.5 }}>{field.label}</Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  SelectProps={{ native: true }}
                  onChange={(e) => handleFormChange(field.name, e.target.value)}
                  value={formData[field.name] || ''}
                  variant="outlined"
                >
                  <option value="">Seçiniz</option>
                  {field.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </TextField>
              </>
            ) : field.type === 'textarea' ? (
              <>
                <Typography variant="body2" sx={{ marginBottom: 0.5 }}>{field.label}</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  onChange={(e) => handleFormChange(field.name, e.target.value)}
                  value={formData[field.name] || ''}
                  variant="outlined"
                />
              </>
            ) : (
              <>
                <Typography variant="body2" sx={{ marginBottom: 0.5 }}>{field.label}</Typography>
                <TextField
                  fullWidth
                  size="small"
                  onChange={(e) => handleFormChange(field.name, e.target.value)}
                  value={formData[field.name] || ''}
                  variant="outlined"
                />
              </>
            )}
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setFormFields([]);
              setFormData({});
              setStep('main');
            }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleFormSubmit}
            sx={{
              backgroundColor: primary,
              '&:hover': {
                backgroundColor: secondary,
              }
            }}
          >
            Gönder
          </Button>
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
      padding: { xs: 1, sm: 2 }
    }}>
      {/* Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 2, 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: 2,
          borderRadius: 2
        }}
      >
        <Avatar 
          src={logo} 
          alt={`${companyName} Logo`}
          sx={{ width: 40, height: 40, marginRight: 2 }}
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>{title}</Typography>
        
        {!isAuthenticated && (
          <Button
            variant="contained"
            size="small"
            startIcon={<LoginIcon />}
            onClick={onLoginRequired}
            sx={{
              backgroundColor: primary,
              '&:hover': {
                backgroundColor: secondary,
              }
            }}
          >
            Giriş Yap
          </Button>
        )}
        
        {isAuthenticated && userData && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: primary, 
                marginRight: 1,
                fontSize: '0.9rem'
              }}
            >
              {(userData.name || userData.fullName || 'M').substring(0, 1).toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight="medium">
              {userData.name || userData.fullName || userData.email || 'Misafir Kullanıcı'}
          </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Kullanıcı bilgileri (mobil görünüm için) */}
      {isAuthenticated && userData && renderUserInfo()}
      
      {/* Yan panel (iade veya şikayet formu) */}
      {activeSidePanel && renderSidePanel()}
      
      {/* Mesaj alanı */}
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          marginBottom: 2
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.sender === 'user' ? primary : '#f5f5f5',
              color: message.sender === 'user' ? 'white' : 'black',
              borderRadius: message.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
              padding: '8px 16px',
              maxWidth: '70%',
              marginBottom: 1,
              marginTop: 1,
              wordBreak: 'break-word'
            }}
          >
            <Typography variant="body1">{message.text}</Typography>
          </Box>
        ))}
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
            <CircularProgress size={24} sx={{ color: primary }} />
          </Box>
        )}
        
        {/* Hızlı seçenekler - ilk mesajlardan sonra ve form gösterilmiyorsa */}
        {messages.length <= 3 && formFields.length === 0 && !isLoading && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}>
            {quickOptions.map(option => (
              <Button 
                key={option.id}
                variant="outlined"
                size="small"
                onClick={() => {
                  setInputValue(option.text);
                  setTimeout(() => {
                    handleSend();
                  }, 100);
                }}
                sx={{ 
                  borderColor: primary,
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: `${primary}22`,
                    borderColor: primary
                  },
                  borderRadius: 4
                }}
              >
                {option.text}
              </Button>
            ))}
          </Box>
        )}
        
        {/* İade formu açmak için debug butonu - Kullanıcı girişi yapmışsa göster */}
        {isAuthenticated && !activeSidePanel && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={handleReturnFormForceOpen}
              sx={{ fontSize: '0.75rem' }}
            >
              İade Formunu Aç
            </Button>
          </Box>
        )}
        
        {/* Form alanları */}
        {formFields.length > 0 && renderFormFields()}
        
        <div ref={chatEndRef} />
      </Paper>
      
      {/* Input alanı */}
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 2,
          borderRadius: 2,
          display: 'flex'
        }}
      >
        <TextField
          fullWidth
          placeholder="Mesajınızı yazın..."
          variant="outlined"
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
          sx={{ marginRight: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={isLoading || inputValue.trim() === ''}
          sx={{
            backgroundColor: primary,
            '&:hover': {
              backgroundColor: secondary,
            }
          }}
        >
          Gönder
        </Button>
      </Paper>
    </Box>
  );
};

export default BaseChatbot; 