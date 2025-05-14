package com.Destek.Support.Quick_Solution.Q_S_Orientation;

import com.Destek.Support.Quick_Solution.Llama.Complex_situation.ComplexSituationService;
import com.Destek.Support.Quick_Solution.Llama.Ll_daily_chat.DailyChatService;
import com.Destek.Support.Quick_Solution.ChatBot.LlamaConnector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class QueryLabeling {

    private final LlamaConnector llamaConnector;
    private final ComplexSituationService complexSituationService;
    private final DailyChatService dailyChatService;
    
    // Minimum karakter uzunluğu - complex query için
    private static final int COMPLEX_QUERY_MIN_LENGTH = 50;

    @Autowired
    public QueryLabeling(LlamaConnector llamaConnector, 
                         ComplexSituationService complexSituationService,
                         DailyChatService dailyChatService) {
        this.llamaConnector = llamaConnector;
        this.complexSituationService = complexSituationService;
        this.dailyChatService = dailyChatService;
    }

    public enum LabelType {
        CLASSIC_QUERY,      // Temel CRUD işlemleri 
        COMPLAINT,          // Şikayet
        RETURN,             // İade talebi
        DAILY_CHAT,         // Günlük sohbet (merhaba, nasılsın vb.)
        COMPLEX_SITUATION,  // Karmaşık durumlar (50+ karakter)
        GENERAL_QUERY       // Genel sorgular (Llama'ya gidecek)
    }

    /**
     * Kullanıcı sorgusunu analiz ederek etiketler
     * @param queryText Kullanıcının gönderdiği metin
     * @return Sorgu etiketi
     */
    public LabelType labelQuery(String queryText) {
        if (queryText == null || queryText.trim().isEmpty()) {
            return LabelType.GENERAL_QUERY;
        }

        String lowerQuery = queryText.toLowerCase();
        
        // Günlük sohbet kontrolü - basit sohbet kalıpları
        if (isGreetingQuery(lowerQuery)) {
            return LabelType.DAILY_CHAT;
        }
        
        // Karmaşık durum kontrolü - uzunluk bazlı
        if (isComplexQuery(queryText)) {
            return LabelType.COMPLEX_SITUATION;
        }
        
        // İade ile ilgili kelimeler varsa
        if (isReturnQuery(lowerQuery)) {
            return LabelType.RETURN;
        }
        
        // Şikayet ile ilgili kelimeler varsa
        if (isComplaintQuery(lowerQuery)) {
            return LabelType.COMPLAINT;
        }
        
        // CRUD işlemleri ile ilgili kelimeler varsa
        if (isClassicQuery(lowerQuery)) {
            return LabelType.CLASSIC_QUERY;
        }
        
        // AI ile sınıflandırma denemesi yap
        try {
            return classifyWithAI(queryText);
        } catch (Exception e) {
            // AI sınıflandırması başarısız olursa varsayılan olarak genel sorgu kabul et
        }
        
        // Diğer durumlar için genel sorgu
        return LabelType.GENERAL_QUERY;
    }
    
    /**
     * Gelişmiş analiz ile sorguyu etiketler
     * @param queryText Kullanıcının gönderdiği metin
     * @return Etiket ve güven puanı
     */
    public Map<String, Object> analyzeLabelWithConfidence(String queryText) {
        Map<String, Object> result = new HashMap<>();
        
        LabelType label = labelQuery(queryText);
        double confidence = calculateConfidence(queryText, label);
        
        result.put("label", label.toString());
        result.put("confidence", confidence);
        result.put("queryText", queryText);
        
        return result;
    }
    
    /**
     * Sorgunun günlük sohbet (selamlaşma vb.) olup olmadığını kontrol eder
     */
    private boolean isGreetingQuery(String query) {
        // Kısa sorgular genellikle selamlaşmadır
        if (query.length() < 15) {
            return true;
        }
        
        // Yaygın selamlaşma kalıpları
        String[] greetingPatterns = {
            "merhaba", "selam", "nasılsın", "naber", "günaydın", "iyi günler", "iyi akşamlar", 
            "hello", "hi", "teşekkür", "teşekkürler", "sağol", "görüşürüz", "hoşçakal"
        };
        
        for (String pattern : greetingPatterns) {
            if (query.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Sorgunun karmaşık olup olmadığını kontrol eder
     */
    private boolean isComplexQuery(String query) {
        // Uzunluk kontrolü
        if (query.length() >= COMPLEX_QUERY_MIN_LENGTH) {
            // Cümle sayımı için nokta, soru işareti, ünlem işareti sayma
            int sentenceCount = 0;
            for (char c : query.toCharArray()) {
                if (c == '.' || c == '?' || c == '!') {
                    sentenceCount++;
                }
            }
            
            // 2+ cümle kompleks kabul edilir
            return sentenceCount >= 2;
        }
        
        return false;
    }
    
    /**
     * Sorgunun iade ile ilgili olup olmadığını kontrol eder
     */
    private boolean isReturnQuery(String query) {
        String[] returnPatterns = {
            "iade", "geri", "para iadesi", "return", "geri verme", "geri alma", 
            "para geri", "ürünü iade", "değiştirme", "ürün değişim"
        };
        
        for (String pattern : returnPatterns) {
            if (query.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Sorgunun şikayet ile ilgili olup olmadığını kontrol eder
     */
    private boolean isComplaintQuery(String query) {
        String[] complaintPatterns = {
            "şikayet", "memnun değil", "sorun", "complaint", "hatalı", "kırık", "bozuk",
            "çalışmıyor", "memnuniyetsiz", "kötü", "berbat", "rezalet", "yetersiz"
        };
        
        for (String pattern : complaintPatterns) {
            if (query.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Sorgunun klasik CRUD işlemi olup olmadığını kontrol eder
     */
    private boolean isClassicQuery(String query) {
        String[] classicPatterns = {
            "liste", "göster", "ekle", "güncelle", "sil", "hesabım", "profil", "sipariş",
            "adres", "kargo", "takip", "durum", "bilgi", "görüntüle", "detay"
        };
        
        for (String pattern : classicPatterns) {
            if (query.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Llama AI kullanarak sorguyu sınıflandırır
     */
    private LabelType classifyWithAI(String queryText) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("query", queryText);
            requestBody.put("task", "classify");
            
            Map<String, Object> response = llamaConnector.sendQuery(queryText);
            
            if (response.containsKey("classification")) {
                String classification = (String) response.get("classification");
                
                switch (classification.toLowerCase()) {
                    case "daily_chat":
                    case "greeting":
                        return LabelType.DAILY_CHAT;
                    case "complex_situation":
                    case "complex":
                        return LabelType.COMPLEX_SITUATION;
                    case "return":
                    case "refund":
                        return LabelType.RETURN;
                    case "complaint":
                        return LabelType.COMPLAINT;
                    case "classic_query":
                    case "crud":
                        return LabelType.CLASSIC_QUERY;
                    default:
                        return LabelType.GENERAL_QUERY;
                }
            }
        } catch (Exception e) {
            // API çağrısı hata durumunda varsayılan olarak genel sorgu
        }
        
        return LabelType.GENERAL_QUERY;
    }
    
    /**
     * Sınıflandırma güven puanını hesaplar (0.0-1.0 arası)
     */
    private double calculateConfidence(String queryText, LabelType label) {
        double baseConfidence = 0.5; // Varsayılan güven puanı
        
        switch (label) {
            case DAILY_CHAT:
                // Selamlaşma sorguları yüksek güvenle tanımlanabilir
                return isGreetingQuery(queryText.toLowerCase()) ? 0.95 : 0.7;
                
            case COMPLEX_SITUATION:
                // Kompleks sorgular için güven puanı
                return queryText.length() > COMPLEX_QUERY_MIN_LENGTH ? 0.9 : 0.6;
                
            case RETURN:
                // İade sorguları için güven puanı
                return containsMultipleKeywords(queryText.toLowerCase(), new String[]{"iade", "geri", "değiştir"}) ? 0.9 : 0.7;
                
            case COMPLAINT:
                // Şikayet sorguları için güven puanı
                return containsMultipleKeywords(queryText.toLowerCase(), new String[]{"şikayet", "memnun", "sorun"}) ? 0.9 : 0.7;
                
            case CLASSIC_QUERY:
                // CRUD sorguları için güven puanı
                return 0.8;
                
            default:
                return baseConfidence;
        }
    }
    
    /**
     * Metinde birden fazla anahtar kelimenin olup olmadığını kontrol eder
     */
    private boolean containsMultipleKeywords(String text, String[] keywords) {
        int count = 0;
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                count++;
            }
        }
        return count >= 2;
    }
} 