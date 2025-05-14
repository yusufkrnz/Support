package com.Destek.Support.Core.service;

import com.Destek.Support.Core.entity.ReturnRequest;
import com.Destek.Support.Core.entity.User;
import com.Destek.Support.Core.repository.ReturnRequestRepository;
import com.Destek.Support.Services.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * İade talepleri için servis sınıfı
 */
@Service
public class ReturnService {
    
    private static final Logger logger = Logger.getLogger(ReturnService.class.getName());
    
    @Autowired
    private ReturnRequestRepository returnRequestRepository;
    
    @Autowired
    private GeminiService geminiService;
    
    /**
     * Yeni bir iade talebi oluşturur
     * @param user Kullanıcı
     * @param orderNumber Sipariş numarası
     * @param productId Ürün ID
     * @param productName Ürün adı
     * @param returnReason İade nedeni
     * @param description İade açıklaması
     * @param image Ürün görseli
     * @return Oluşturulan iade talebi
     */
    @Transactional
    public ReturnRequest createReturnRequest(User user, String orderNumber, String productId, 
                                            String productName, String returnReason, 
                                            String description, MultipartFile image) {
        logger.info("İade talebi oluşturuluyor - Kullanıcı: " + user.getUsername() + ", Sipariş: " + orderNumber + ", Ürün: " + productName);
        try {
            // Ürün görseli için Base64 dönüşümü
            String imageBase64 = null;
            if (image != null && !image.isEmpty()) {
                imageBase64 = Base64.getEncoder().encodeToString(image.getBytes());
                logger.info("Görsel başarıyla Base64 formatına dönüştürüldü");
            } else {
                logger.warning("İade talebi görselsiz oluşturuluyor");
            }
            
            // Ürün bilgilerini formatla
            String productInfo = "Ürün: " + productName + ", Sipariş No: " + orderNumber;
            
            // Gemini AI değerlendirmesi
            logger.info("Gemini AI değerlendirmesi isteniyor");
            GeminiService.GeminiReturnEvaluationResult aiResult = 
                geminiService.evaluateReturnRequest(imageBase64, description, returnReason, productInfo);
            logger.info("Gemini AI değerlendirmesi alındı - Puan: " + aiResult.getScore());
            
            // İade talebi oluştur
            ReturnRequest returnRequest = new ReturnRequest();
            returnRequest.setUser(user);
            returnRequest.setOrderNumber(orderNumber);
            returnRequest.setProductId(productId);
            returnRequest.setProductName(productName);
            returnRequest.setReturnReason(returnReason);
            returnRequest.setDescription(description);
            returnRequest.setCreatedAt(LocalDateTime.now());
            returnRequest.setUpdatedAt(LocalDateTime.now());
            
            // AI değerlendirme sonuçları
            returnRequest.setAiScore(aiResult.getScore());
            returnRequest.setAiEvaluation(aiResult.getEvaluation());
            
            // Durumu belirle
            if (aiResult.isApproved()) {
                returnRequest.setStatus(ReturnRequest.ReturnStatus.PENDING);
                logger.info("AI skoru yeterli, talep PENDING durumuna ayarlandı");
            } else {
                returnRequest.setStatus(ReturnRequest.ReturnStatus.PENDING_REVIEW);
                logger.warning("AI skoru düşük (" + aiResult.getScore() + " <= 3), talep PENDING_REVIEW durumuna ayarlandı");
            }
            
            // Kaydet
            ReturnRequest savedRequest = returnRequestRepository.save(returnRequest);
            logger.info("İade talebi başarıyla kaydedildi, ID: " + savedRequest.getId());
            return savedRequest;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "İade talebi oluşturulurken hata: " + e.getMessage(), e);
            throw new RuntimeException("İade talebi oluşturulurken hata: " + e.getMessage(), e);
        }
    }
    
    /**
     * İade talebini bypass et (AI skoru düşük olsa bile işleme al)
     * @param returnRequestId İade talebi ID
     * @param processedBy İşlemi yapan kullanıcı
     * @return Güncellenen iade talebi
     */
    @Transactional
    public ReturnRequest bypassReturnRequest(Long returnRequestId, String processedBy) {
        logger.info("İade talebi bypass istemi - ID: " + returnRequestId + ", İşleyen: " + processedBy);
        Optional<ReturnRequest> returnRequestOpt = returnRequestRepository.findById(returnRequestId);
        if (returnRequestOpt.isPresent()) {
            ReturnRequest returnRequest = returnRequestOpt.get();
            returnRequest.setIsBypassed(true);
            returnRequest.setStatus(ReturnRequest.ReturnStatus.PENDING);
            returnRequest.setProcessedBy(processedBy);
            returnRequest.setProcessedAt(LocalDateTime.now());
            returnRequest.setUpdatedAt(LocalDateTime.now());
            
            ReturnRequest updatedRequest = returnRequestRepository.save(returnRequest);
            logger.info("İade talebi başarıyla bypass edildi - ID: " + returnRequestId + 
                       ", Eski AI Skoru: " + returnRequest.getAiScore() + 
                       ", Yeni Durum: PENDING");
            return updatedRequest;
        }
        logger.warning("Bypass edilecek iade talebi bulunamadı - ID: " + returnRequestId);
        throw new RuntimeException("İade talebi bulunamadı: " + returnRequestId);
    }
    
    /**
     * İade talebini güncelle
     * @param returnRequestId İade talebi ID
     * @param status Yeni durum
     * @param processedBy İşlemi yapan kullanıcı
     * @return Güncellenen iade talebi
     */
    @Transactional
    public ReturnRequest updateReturnRequestStatus(Long returnRequestId, 
                                                ReturnRequest.ReturnStatus status,
                                                String processedBy) {
        logger.info("İade talebi durum güncelleme - ID: " + returnRequestId + 
                   ", Yeni Durum: " + status + ", İşleyen: " + processedBy);
        Optional<ReturnRequest> returnRequestOpt = returnRequestRepository.findById(returnRequestId);
        if (returnRequestOpt.isPresent()) {
            ReturnRequest returnRequest = returnRequestOpt.get();
            ReturnRequest.ReturnStatus oldStatus = returnRequest.getStatus();
            returnRequest.setStatus(status);
            returnRequest.setProcessedBy(processedBy);
            returnRequest.setProcessedAt(LocalDateTime.now());
            returnRequest.setUpdatedAt(LocalDateTime.now());
            
            ReturnRequest updatedRequest = returnRequestRepository.save(returnRequest);
            logger.info("İade talebi durumu güncellendi - ID: " + returnRequestId + 
                       ", Önceki Durum: " + oldStatus + ", Yeni Durum: " + status);
            return updatedRequest;
        }
        logger.warning("Durumu güncellenecek iade talebi bulunamadı - ID: " + returnRequestId);
        throw new RuntimeException("İade talebi bulunamadı: " + returnRequestId);
    }
    
    /**
     * Kullanıcının iade taleplerini getirir
     * @param user Kullanıcı
     * @return İade talepleri listesi
     */
    public List<ReturnRequest> getUserReturnRequests(User user) {
        logger.info("Kullanıcının iade talepleri getiriliyor - Kullanıcı: " + user.getUsername());
        List<ReturnRequest> requests = returnRequestRepository.findByUserOrderByCreatedAtDesc(user);
        logger.info(user.getUsername() + " kullanıcısı için " + requests.size() + " iade talebi bulundu");
        return requests;
    }
    
    /**
     * Tüm iade taleplerini duruma göre getirir
     * @param status İade durumu
     * @return İade talepleri listesi
     */
    public List<ReturnRequest> getReturnRequestsByStatus(ReturnRequest.ReturnStatus status) {
        logger.info("Duruma göre iade talepleri getiriliyor - Durum: " + status);
        List<ReturnRequest> requests = returnRequestRepository.findByStatus(status);
        logger.info(status + " durumunda " + requests.size() + " iade talebi bulundu");
        return requests;
    }
    
    /**
     * AI skoru düşük olan iade taleplerini getirir
     * @return İade talepleri listesi
     */
    public List<ReturnRequest> getLowScoreReturnRequests() {
        logger.info("Düşük AI skorlu iade talepleri getiriliyor");
        List<ReturnRequest> requests = returnRequestRepository.findLowScoreRequests();
        logger.info("Düşük AI skorlu " + requests.size() + " iade talebi bulundu");
        return requests;
    }
    
    /**
     * Bypass edilen iade taleplerini getirir
     * @return İade talepleri listesi
     */
    public List<ReturnRequest> getBypassedReturnRequests() {
        logger.info("Bypass edilen iade talepleri getiriliyor");
        List<ReturnRequest> requests = returnRequestRepository.findBypassedRequests();
        logger.info("Bypass edilmiş " + requests.size() + " iade talebi bulundu");
        return requests;
    }
    
    /**
     * İade talebini ID ile getirir
     * @param id İade talebi ID
     * @return İade talebi
     */
    public Optional<ReturnRequest> getReturnRequestById(Long id) {
        logger.info("ID ile iade talebi getiriliyor - ID: " + id);
        Optional<ReturnRequest> request = returnRequestRepository.findById(id);
        if (request.isPresent()) {
            logger.info("İade talebi bulundu - ID: " + id);
        } else {
            logger.warning("İade talebi bulunamadı - ID: " + id);
        }
        return request;
    }
} 