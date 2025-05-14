package com.Destek.Support.Core.service;

import com.Destek.Support.Core.entity.OrderItem;
import com.Destek.Support.Core.entity.User;
import com.Destek.Support.Core.entity.UserOrder;
import com.Destek.Support.Core.repository.UserOrderRepository;
import com.Destek.Support.Core.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final UserOrderRepository orderRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderService(UserOrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    /**
     * Kullanıcının tüm siparişlerini getirir
     */
    public List<UserOrder> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    /**
     * Sipariş detaylarını getirir
     */
    public UserOrder getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    /**
     * Kullanıcının belirli durumdaki siparişlerini getirir
     */
    public List<UserOrder> getUserOrdersByStatus(Long userId, String status) {
        return orderRepository.findByUserIdAndStatus(userId, status);
    }

    /**
     * Kullanıcının sipariş sayısını getirir
     */
    public long getUserOrderCount(Long userId) {
        return orderRepository.countByUserId(userId);
    }
    
    /**
     * Tarih aralığına göre siparişleri getirir
     */
    public List<UserOrder> getUserOrdersByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        return orderRepository.findByUserIdAndDateRange(userId, startDateTime, endDateTime);
    }
    
    /**
     * Belirli bir ürün ID'sine göre siparişleri getirir
     */
    public List<UserOrder> getUserOrdersByProductId(Long userId, String productId) {
        return orderRepository.findByUserIdAndProductId(userId, productId);
    }
    
    /**
     * Belirli bir ürün adına göre siparişleri getirir
     */
    public List<UserOrder> getUserOrdersByProductName(Long userId, String productName) {
        return orderRepository.findByUserIdAndProductName(userId, productName);
    }

    /**
     * Kullanıcı için yeni bir sipariş oluşturur
     */
    @Transactional
    public UserOrder createOrder(Long userId, List<Map<String, Object>> items) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + userId));

        UserOrder order = new UserOrder();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("BEKLEMEDE");

        BigDecimal totalAmount = BigDecimal.ZERO;
        
        // Sipariş öğelerini ekle
        for (Map<String, Object> itemData : items) {
            OrderItem item = new OrderItem();
            item.setProductId((String) itemData.get("productId"));
            item.setProductName((String) itemData.get("productName"));
            item.setQuantity((Integer) itemData.get("quantity"));
            item.setUnitPrice(new BigDecimal(itemData.get("price").toString()));
            item.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            
            order.addOrderItem(item);
            totalAmount = totalAmount.add(item.getTotalPrice());
        }
        
        order.setTotalAmount(totalAmount);
        
        return orderRepository.save(order);
    }

    /**
     * Sipariş durumunu günceller
     */
    @Transactional
    public UserOrder updateOrderStatus(String orderNumber, String newStatus) {
        UserOrder order = orderRepository.findByOrderNumber(orderNumber);
        if (order == null) {
            throw new RuntimeException("Sipariş bulunamadı: " + orderNumber);
        }
        
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    /**
     * Kullanıcının sipariş verilerini ChatBot'a uygun formatta döndürür
     */
    public Map<String, Object> getUserOrdersForChatBot(Long userId) {
        List<UserOrder> orders = getUserOrders(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("userId", userId);
        response.put("orderCount", orders.size());
        
        // Sepet listesi
        List<Map<String, Object>> sepetList = new ArrayList<>();
        
        // Sipariş tutarları listesi
        List<Map<String, Object>> sepetTutarList = new ArrayList<>();
        
        for (UserOrder order : orders) {
            // Sepet bilgisi
            Map<String, Object> sepet = new HashMap<>();
            sepet.put("orderNumber", order.getOrderNumber());
            sepet.put("orderDate", order.getOrderDate());
            sepet.put("status", order.getStatus());
            
            // Sepetteki ürünler
            List<Map<String, Object>> urunler = order.getOrderItems().stream()
                    .map(item -> {
                        Map<String, Object> urun = new HashMap<>();
                        urun.put("urunAdi", item.getProductName());
                        urun.put("adet", item.getQuantity());
                        urun.put("birimFiyat", item.getUnitPrice());
                        return urun;
                    })
                    .collect(Collectors.toList());
            
            sepet.put("urunler", urunler);
            sepetList.add(sepet);
            
            // Tutar bilgisi
            Map<String, Object> tutar = new HashMap<>();
            tutar.put("orderNumber", order.getOrderNumber());
            tutar.put("totalAmount", order.getTotalAmount());
            tutar.put("orderDate", order.getOrderDate());
            sepetTutarList.add(tutar);
        }
        
        response.put("sepetList", sepetList);
        response.put("sepetTutariList", sepetTutarList);
        
        return response;
    }
    
    /**
     * Tarih aralığına göre siparişleri ChatBot'a uygun formatta döndürür
     */
    public Map<String, Object> getUserOrdersByDateRangeForChatBot(Long userId, String startDateStr, String endDateStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(startDateStr, formatter);
        LocalDate endDate = LocalDate.parse(endDateStr, formatter);
        
        List<UserOrder> orders = getUserOrdersByDateRange(userId, startDate, endDate);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("userId", userId);
        response.put("orderCount", orders.size());
        response.put("startDate", startDateStr);
        response.put("endDate", endDateStr);
        
        // Sepet listesi
        List<Map<String, Object>> sepetList = new ArrayList<>();
        
        // Sipariş tutarları listesi
        List<Map<String, Object>> sepetTutarList = new ArrayList<>();
        
        for (UserOrder order : orders) {
            // Sepet bilgisi
            Map<String, Object> sepet = new HashMap<>();
            sepet.put("orderNumber", order.getOrderNumber());
            sepet.put("orderDate", order.getOrderDate());
            sepet.put("status", order.getStatus());
            
            // Sepetteki ürünler
            List<Map<String, Object>> urunler = order.getOrderItems().stream()
                    .map(item -> {
                        Map<String, Object> urun = new HashMap<>();
                        urun.put("urunAdi", item.getProductName());
                        urun.put("adet", item.getQuantity());
                        urun.put("birimFiyat", item.getUnitPrice());
                        return urun;
                    })
                    .collect(Collectors.toList());
            
            sepet.put("urunler", urunler);
            sepetList.add(sepet);
            
            // Tutar bilgisi
            Map<String, Object> tutar = new HashMap<>();
            tutar.put("orderNumber", order.getOrderNumber());
            tutar.put("totalAmount", order.getTotalAmount());
            tutar.put("orderDate", order.getOrderDate());
            sepetTutarList.add(tutar);
        }
        
        response.put("sepetList", sepetList);
        response.put("sepetTutariList", sepetTutarList);
        
        return response;
    }
    
    /**
     * Belirli bir ürüne göre siparişleri ChatBot'a uygun formatta döndürür
     */
    public Map<String, Object> getUserOrdersByProductForChatBot(Long userId, String productName) {
        List<UserOrder> orders = getUserOrdersByProductName(userId, productName);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("userId", userId);
        response.put("orderCount", orders.size());
        response.put("productName", productName);
        
        // Sipariş listesi
        List<Map<String, Object>> orderList = new ArrayList<>();
        
        // Ürün bazlı detay listesi
        Map<String, List<Map<String, Object>>> productItemsList = new HashMap<>();
        
        for (UserOrder order : orders) {
            // Sipariş bilgisi
            Map<String, Object> orderInfo = new HashMap<>();
            orderInfo.put("orderNumber", order.getOrderNumber());
            orderInfo.put("orderDate", order.getOrderDate());
            orderInfo.put("status", order.getStatus());
            orderInfo.put("totalAmount", order.getTotalAmount());
            
            // Siparişteki ürün kalemlerini filtrele
            List<OrderItem> matchingItems = order.getOrderItems().stream()
                    .filter(item -> item.getProductName().toLowerCase().contains(productName.toLowerCase()))
                    .collect(Collectors.toList());
            
            // Matching items bilgileri
            List<Map<String, Object>> items = matchingItems.stream()
                    .map(item -> {
                        Map<String, Object> itemInfo = new HashMap<>();
                        itemInfo.put("productId", item.getProductId());
                        itemInfo.put("productName", item.getProductName());
                        itemInfo.put("quantity", item.getQuantity());
                        itemInfo.put("unitPrice", item.getUnitPrice());
                        itemInfo.put("totalPrice", item.getTotalPrice());
                        itemInfo.put("orderNumber", order.getOrderNumber());
                        itemInfo.put("orderDate", order.getOrderDate());
                        return itemInfo;
                    })
                    .collect(Collectors.toList());
            
            orderInfo.put("items", items);
            orderList.add(orderInfo);
            
            // Ürün bazlı gruplandırma
            for (OrderItem item : matchingItems) {
                String key = item.getProductName();
                if (!productItemsList.containsKey(key)) {
                    productItemsList.put(key, new ArrayList<>());
                }
                
                Map<String, Object> itemOrderInfo = new HashMap<>();
                itemOrderInfo.put("orderNumber", order.getOrderNumber());
                itemOrderInfo.put("orderDate", order.getOrderDate());
                itemOrderInfo.put("quantity", item.getQuantity());
                itemOrderInfo.put("unitPrice", item.getUnitPrice());
                itemOrderInfo.put("totalPrice", item.getTotalPrice());
                itemOrderInfo.put("status", order.getStatus());
                
                productItemsList.get(key).add(itemOrderInfo);
            }
        }
        
        response.put("orders", orderList);
        response.put("productItemsList", productItemsList);
        
        return response;
    }
    
    /**
     * Benzersiz sipariş numarası üretir
     */
    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
} 