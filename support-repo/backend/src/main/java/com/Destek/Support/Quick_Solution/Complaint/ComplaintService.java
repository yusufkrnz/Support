package com.Destek.Support.Quick_Solution.Complaint;

import com.Destek.Support.Core.entity.User;
import com.Destek.Support.Core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Şikayet işlemlerini yöneten servis.
 */
@Service
public class ComplaintService {
    
    private final UserService userService;
    
    @Autowired
    public ComplaintService(UserService userService) {
        this.userService = userService;
    }
    
    /**
     * Şikayet işlemini işler.
     * @param complaintType Şikayet türü
     * @param explanation Açıklama
     * @param userId Kullanıcı ID
     * @return İşlem sonucu
     */
    public Map<String, Object> processComplaint(String complaintType, String explanation, String userId) {
        Map<String, Object> response = new HashMap<>();
        
        // Kullanıcı giriş yapmış mı kontrolü
        if (userId == null || userId.isEmpty() || !userService.isUserLoggedIn(userId)) {
            response.put("success", false);
            response.put("message", "Şikayet oluşturmak için giriş yapmalısınız.");
            response.put("requiresLogin", true);
            return response;
        }
        
        try {
            // Kullanıcı bilgilerini al - String userId'yi Long'a dönüştürüyoruz
            Optional<User> userOptional = userService.getUserById(Long.parseLong(userId));
            
            // Optional'dan User nesnesini çıkarıyoruz, eğer varsa
            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "Kullanıcı bilgileri bulunamadı.");
                return response;
            }
            
            User user = userOptional.get();
            
            // Şikayet verilerini oluştur
            // Gerçek uygulamada bu veriler veritabanına kaydedilecek (Complaint tablosu)
            String complaintId = generateComplaintId();
            
            // Şimdilik sadece bir simülasyon yapıyoruz
            // Bu kısımda gerçek uygulamada veritabanına kayıt yapılacak:
            // complaintRepository.save(new Complaint(complaintId, complaintType, explanation, user));
            
            response.put("success", true);
            response.put("message", "Şikayet talebiniz kaydedildi. En kısa sürede incelenecektir.");
            response.put("complaintId", complaintId);
            response.put("queryType", "COMPLAINT");
            
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Şikayet işlenirken bir hata oluştu: " + e.getMessage());
            return response;
        }
    }
    
    /**
     * Benzersiz şikayet ID'si oluşturur
     * @return Şikayet ID
     */
    private String generateComplaintId() {
        return "COMP-" + System.currentTimeMillis();
    }
    
    /**
     * Şikayet türlerini döndürür.
     * @return Şikayet türleri
     */
    public Map<String, String> getComplaintTypes() {
        Map<String, String> types = new HashMap<>();
        types.put("product", "Ürün Şikayeti");
        types.put("service", "Hizmet Şikayeti");
        types.put("delivery", "Teslimat Şikayeti");
        types.put("other", "Diğer");
        return types;
    }
} 