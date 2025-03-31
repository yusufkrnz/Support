package com.Destek.Support.service;

import com.Destek.Support.model.ChatbotOption;
import com.Destek.Support.model.Product;
import com.Destek.Support.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    @Autowired
    private ProductRepository productRepository;

    public String getWelcomeMessage() {
        StringBuilder message = new StringBuilder();
        message.append("Merhaba! TechStore Destek Sistemine Hoş Geldiniz.\n");
        message.append("Size nasıl yardımcı olabilirim?\n\n");
        message.append("Lütfen aşağıdaki seçeneklerden birini seçin:\n");
        
        Arrays.stream(ChatbotOption.values())
                .forEach(option -> message.append(option.getCode())
                        .append(". ")
                        .append(option.getDescription())
                        .append("\n"));

        return message.toString();
    }

    public String handleOption(int optionCode) {
        try {
            ChatbotOption option = ChatbotOption.fromCode(optionCode);
            return switch (option) {
                case PRODUCT_DETAILS -> getProductDetailsResponse();
                case ORDER_CANCEL -> getOrderCancelResponse();
                case SHIPPING_TRACK -> getShippingTrackResponse();
                case RETURN_PROCESS -> getReturnProcessResponse();
                case TECHNICAL_SUPPORT -> getTechnicalSupportResponse();
                case PRODUCT_COMPLAINT -> getProductComplaintResponse();
                case SPEAK_REPRESENTATIVE -> getSpeakRepresentativeResponse();
            };
        } catch (IllegalArgumentException e) {
            return "Geçersiz seçenek. Lütfen listeden bir numara seçin.";
        }
    }

    private String getProductDetailsResponse() {
        List<Product> products = productRepository.findAll();
        StringBuilder response = new StringBuilder("Mevcut Ürünlerimiz:\n\n");
        
        products.forEach(product -> 
            response.append("- ")
                   .append(product.getBrand())
                   .append(" ")
                   .append(product.getModel())
                   .append(" (")
                   .append(product.getCategory())
                   .append(")\n  Fiyat: ")
                   .append(product.getPrice())
                   .append(" TL\n")
        );

        return response.toString();
    }

    private String getOrderCancelResponse() {
        return """
               Sipariş iptali için lütfen aşağıdaki adımları izleyin:
               1. Sipariş numaranızı hazırlayın
               2. İptal gerekçenizi belirtin
               3. Müşteri temsilcimiz sizinle iletişime geçecektir
               
               Not: Kargoya verilmiş siparişler iptal edilemez.""";
    }

    private String getShippingTrackResponse() {
        return """
               Kargo takibi için:
               1. Sipariş numaranızı girin
               2. Size kargo takip numarası ve kargo firması bilgisi iletilecektir
               
               Ortalama teslimat süremiz 2-3 iş günüdür.""";
    }

    private String getReturnProcessResponse() {
        return """
               İade işlemleri için:
               1. Ürünün orijinal kutusunda ve kullanılmamış olması gerekir
               2. Faturanızı hazırlayın
               3. İade gerekçenizi belirtin
               4. Size en yakın kargo şubesinden ücretsiz gönderim yapabilirsiniz
               
               İade işleminiz onaylandıktan sonra 3 iş günü içinde ödemeniz iade edilir.""";
    }

    private String getTechnicalSupportResponse() {
        return """
               Teknik destek için:
               1. Ürün modelinizi belirtin
               2. Yaşadığınız sorunu detaylı açıklayın
               3. Teknik ekibimiz size yardımcı olacaktır
               
               Teknik destek hattımız 09:00-18:00 saatleri arasında hizmet vermektedir.""";
    }

    private String getProductComplaintResponse() {
        return """
               Ürün şikayeti için:
               1. Ürün bilgilerini belirtin
               2. Şikayet konunuzu detaylı açıklayın
               3. Varsa fotoğraf ekleyin
               
               Şikayetiniz 24 saat içinde değerlendirilecektir.""";
    }

    private String getSpeakRepresentativeResponse() {
        return """
               Müşteri temsilcisine bağlanıyorsunuz...
               Lütfen bekleyin.
               
               Ortalama bekleme süresi: 2 dakika""";
    }
} 