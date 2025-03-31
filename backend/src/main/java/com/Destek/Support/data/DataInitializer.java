package com.Destek.Support.data;

import com.Destek.Support.model.*;
import com.Destek.Support.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            createUsers();
            createProducts();
            createSupportRequests();
        }
    }

    private void createUsers() {
        // Create admin user
        User admin = createUser("admin", "admin@example.com", "Admin User", "admin123", UserRole.ADMIN);
        userRepository.save(admin);

        // Create representatives
        User rep1 = createUser("rep1", "rep1@example.com", "Representative 1", "rep123", UserRole.REPRESENTATIVE);
        User rep2 = createUser("rep2", "rep2@example.com", "Representative 2", "rep123", UserRole.REPRESENTATIVE);
        User rep3 = createUser("rep3", "rep3@example.com", "Representative 3", "rep123", UserRole.REPRESENTATIVE);

        userRepository.saveAll(Arrays.asList(rep1, rep2, rep3));

        // Create customers
        User customer1 = createUser("customer1", "customer1@example.com", "Customer 1", "customer123", UserRole.CUSTOMER);
        User customer2 = createUser("customer2", "customer2@example.com", "Customer 2", "customer123", UserRole.CUSTOMER);
        User customer3 = createUser("customer3", "customer3@example.com", "Customer 3", "customer123", UserRole.CUSTOMER);

        userRepository.saveAll(Arrays.asList(customer1, customer2, customer3));
    }

    private void createProducts() {
        List<Product> products = Arrays.asList(
            createProduct("iPhone 15 Pro", "Apple'ın en yeni amiral gemisi telefonu", new BigDecimal("84999.99"), "Akıllı Telefon", "Apple", "iPhone 15 Pro", 50),
            createProduct("Galaxy S24 Ultra", "Samsung'un en güçlü telefonu", new BigDecimal("74999.99"), "Akıllı Telefon", "Samsung", "Galaxy S24 Ultra", 45),
            createProduct("MacBook Pro 16", "Apple M3 Max işlemcili dizüstü bilgisayar", new BigDecimal("124999.99"), "Dizüstü Bilgisayar", "Apple", "MacBook Pro 16", 30),
            createProduct("ROG Strix G16", "Intel Core i9 ve RTX 4090 ekran kartlı oyuncu bilgisayarı", new BigDecimal("109999.99"), "Dizüstü Bilgisayar", "Asus", "ROG Strix G16", 25),
            createProduct("Sony WH-1000XM5", "Gürültü engelleme özellikli kablosuz kulaklık", new BigDecimal("19999.99"), "Kulaklık", "Sony", "WH-1000XM5", 60),
            createProduct("AirPods Pro 2", "Aktif gürültü engelleme özellikli kablosuz kulaklık", new BigDecimal("14999.99"), "Kulaklık", "Apple", "AirPods Pro 2", 75),
            createProduct("iPad Pro 12.9", "M2 işlemcili profesyonel tablet", new BigDecimal("44999.99"), "Tablet", "Apple", "iPad Pro 12.9", 40),
            createProduct("Galaxy Tab S9 Ultra", "Samsung'un en büyük ve güçlü tableti", new BigDecimal("39999.99"), "Tablet", "Samsung", "Galaxy Tab S9 Ultra", 35),
            createProduct("Apple Watch Series 9", "Sağlık ve fitness özellikleri geliştirilmiş akıllı saat", new BigDecimal("24999.99"), "Akıllı Saat", "Apple", "Watch Series 9", 55),
            createProduct("Galaxy Watch 6 Pro", "Gelişmiş sağlık takibi yapan akıllı saat", new BigDecimal("19999.99"), "Akıllı Saat", "Samsung", "Watch 6 Pro", 50)
        );

        productRepository.saveAll(products);
    }

    private Product createProduct(String name, String description, BigDecimal price, String category, String brand, String model, Integer stockQuantity) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);
        product.setBrand(brand);
        product.setModel(model);
        product.setStockQuantity(stockQuantity);
        return product;
    }

    private void createSupportRequests() {
        List<User> customers = userRepository.findByRole(UserRole.CUSTOMER);
        List<User> representatives = userRepository.findByRole(UserRole.REPRESENTATIVE);
        createSupportRequests(customers, representatives);
    }

    private User createUser(String username, String email, String fullName, String password, UserRole role) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        return user;
    }

    private void createSupportRequests(List<User> customers, List<User> representatives) {
        Random random = new Random();

        for (int i = 0; i < 5; i++) {
            User customer = customers.get(random.nextInt(customers.size()));
            User representative = representatives.get(random.nextInt(representatives.size()));

            SupportRequest request = createRequest("Support Request " + (i + 1), "Description for request " + (i + 1), customer, representative);
            supportRequestRepository.save(request);

            // Create messages for this request
            createMessages(request, customer, representative);

            // Create feedback
            createFeedback(request, customer);
        }
    }

    private SupportRequest createRequest(String title, String description, User customer, User assignedTo) {
        SupportRequest request = new SupportRequest();
        request.setTitle(title);
        request.setSubject(title);
        request.setDescription(description);
        request.setStatus(RequestStatus.OPEN);
        request.setCustomer(customer);
        request.setAssignedTo(assignedTo);
        return request;
    }

    private void createMessages(SupportRequest request, User customer, User representative) {
        Message customerMessage = new Message();
        customerMessage.setContent("Customer message for request: " + request.getTitle());
        customerMessage.setSender(customer);
        customerMessage.setRequest(request);
        messageRepository.save(customerMessage);

        Message repMessage = new Message();
        repMessage.setContent("Representative response for request: " + request.getTitle());
        repMessage.setSender(representative);
        repMessage.setRequest(request);
        messageRepository.save(repMessage);
    }

    private void createFeedback(SupportRequest request, User customer) {
        Feedback feedback = new Feedback();
        feedback.setRating(4);
        feedback.setComment("Good service for request: " + request.getTitle());
        feedback.setRequest(request);
        feedback.setCustomer(customer);
        feedbackRepository.save(feedback);
    }
} 