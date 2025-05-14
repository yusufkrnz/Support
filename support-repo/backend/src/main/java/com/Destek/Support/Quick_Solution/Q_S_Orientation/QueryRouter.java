package com.Destek.Support.Quick_Solution.Q_S_Orientation;

import com.Destek.Support.Quick_Solution.Return.QuickReturnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class QueryRouter {

    private final QueryLabeling queryLabeling;
    private final QuickReturnService returnService;
    // Diğer servisler burada inject edilecek

    @Autowired
    public QueryRouter(QueryLabeling queryLabeling, QuickReturnService returnService) {
        this.queryLabeling = queryLabeling;
        this.returnService = returnService;
    }

    /**
     * Kullanıcı sorgusunu analiz eder ve uygun servise yönlendirir
     * @param query Kullanıcı sorgusu
     * @return Yönlendirme sonucu
     */
    public Map<String, Object> routeQuery(String query) {
        QueryLabeling.LabelType labelType = queryLabeling.labelQuery(query);
        
        Map<String, Object> response = new HashMap<>();
        response.put("queryType", labelType.name());
        
        switch (labelType) {
            case RETURN:
                response.put("nextStep", "RETURN_FORM");
                response.put("message", "İade talebinizi almak için lütfen formu doldurunuz.");
                break;
            case COMPLAINT:
                response.put("nextStep", "COMPLAINT_FORM");
                response.put("message", "Şikayetinizi almak için lütfen detayları giriniz.");
                break;
            case CLASSIC_QUERY:
                response.put("nextStep", "CORE_SERVICE");
                response.put("message", "Talebiniz işleme alındı.");
                break;
            case GENERAL_QUERY:
                response.put("nextStep", "LLAMA_SERVICE");
                response.put("message", "Sorunuzu anlayıp en kısa sürede yanıtlayacağız.");
                break;
        }
        
        return response;
    }
} 