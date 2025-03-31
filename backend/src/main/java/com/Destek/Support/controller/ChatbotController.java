package com.Destek.Support.controller;

import com.Destek.Support.model.Message;
import com.Destek.Support.model.SupportRequest;
import com.Destek.Support.model.User;
import com.Destek.Support.model.RequestStatus;
import com.Destek.Support.service.MessageService;
import com.Destek.Support.service.SupportRequestService;
import com.Destek.Support.service.UserService;
import com.Destek.Support.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Autowired
    private SupportRequestService supportRequestService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/start")
    public ResponseEntity<SupportRequest> startChat(@RequestParam Long customerId) {
        User customer = userService.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        SupportRequest request = new SupportRequest();
        request.setTitle("Yeni Destek Talebi");
        request.setDescription("Chatbot üzerinden başlatılan destek talebi");
        request.setCustomer(customer);
        request.setStatus(RequestStatus.OPEN);

        request = supportRequestService.save(request);

        // Bot'un karşılama mesajı
        Message botMessage = new Message();
        botMessage.setContent("Merhaba! Size nasıl yardımcı olabilirim?");
        botMessage.setRequest(request);
        botMessage.setSender(customer); // Bot mesajları için gönderen olarak müşteriyi kullanıyoruz
        messageService.save(botMessage);

        return ResponseEntity.ok(request);
    }

    @PostMapping("/message")
    public ResponseEntity<Message> sendMessage(
            @RequestParam Long requestId,
            @RequestParam Long customerId,
            @RequestParam String content) {
        
        SupportRequest request = supportRequestService.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Support request not found"));
        
        User customer = userService.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Müşteri mesajını kaydet
        Message userMessage = new Message();
        userMessage.setContent(content);
        userMessage.setRequest(request);
        userMessage.setSender(customer);
        messageService.save(userMessage);

        // Bot yanıtını oluştur
        String botResponse = generateBotResponse(content);
        
        Message botMessage = new Message();
        botMessage.setContent(botResponse);
        botMessage.setRequest(request);
        botMessage.setSender(customer); // Bot mesajları için gönderen olarak müşteriyi kullanıyoruz
        messageService.save(botMessage);

        return ResponseEntity.ok(botMessage);
    }

    @GetMapping("/messages/{requestId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long requestId) {
        return ResponseEntity.ok(messageService.findByRequestId(requestId));
    }

    @GetMapping("/welcome")
    public ResponseEntity<String> getWelcomeMessage() {
        return ResponseEntity.ok(chatbotService.getWelcomeMessage());
    }

    @GetMapping("/option/{optionCode}")
    public ResponseEntity<String> handleOption(@PathVariable int optionCode) {
        return ResponseEntity.ok(chatbotService.handleOption(optionCode));
    }

    private String generateBotResponse(String userMessage) {
        // Basit bir bot yanıt mantığı
        userMessage = userMessage.toLowerCase();
        if (userMessage.contains("merhaba") || userMessage.contains("selam")) {
            return "Merhaba! Size nasıl yardımcı olabilirim?";
        } else if (userMessage.contains("yardım")) {
            return "Size yardımcı olmak için lütfen sorununuzu detaylı bir şekilde açıklayabilir misiniz?";
        } else if (userMessage.contains("teşekkür")) {
            return "Rica ederim! Başka bir konuda yardıma ihtiyacınız var mı?";
        } else {
            return "Üzgünüm, tam olarak anlayamadım. Lütfen sorunuzu farklı bir şekilde ifade edebilir misiniz?";
        }
    }
} 