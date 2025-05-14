package com.Destek.Support.Config;

import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.PortInUseException;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.ServerSocket;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Logger;

@Component
public class DynamicPortConfig implements WebServerFactoryCustomizer<ConfigurableWebServerFactory> {

    private static final Logger logger = Logger.getLogger(DynamicPortConfig.class.getName());
    private static final int BASE_PORT = 8080;
    private static final int MAX_PORT = 8090;
    private static final String PORT_CONFIG_FILE = "dynamic_port.txt";
    private static AtomicInteger currentPort = new AtomicInteger(BASE_PORT);

    @Override
    public void customize(ConfigurableWebServerFactory factory) {
        int port = findAvailablePort();
        factory.setPort(port);
        logger.info("Dinamik port yapılandırması: Sunucu " + port + " portunda başlatılıyor");
        
        // Port bilgisini dışa aktar
        exportPortConfig(port);
    }
    
    private int findAvailablePort() {
        int port = currentPort.get();
        
        while (port <= MAX_PORT) {
            try (ServerSocket serverSocket = new ServerSocket(port)) {
                // Port boş, kullanılabilir
                logger.info("Boş port bulundu: " + port);
                return port;
            } catch (IOException e) {
                // Port dolu, sonraki portu dene
                logger.info("Port " + port + " dolu, sonrakine geçiliyor");
                port = currentPort.incrementAndGet();
            }
        }
        
        // Maksimum port değerine ulaşıldı, başa dön
        logger.warning("Tüm portlar dolu! Varsayılan port 8080'e dönülüyor");
        currentPort.set(BASE_PORT);
        return BASE_PORT;
    }
    
    private void exportPortConfig(int port) {
        try {
            // Port bilgisini bir dosyaya yaz
            java.nio.file.Files.writeString(java.nio.file.Paths.get(PORT_CONFIG_FILE), String.valueOf(port));
            logger.info("Port bilgisi dosyaya yazıldı: " + PORT_CONFIG_FILE);
        } catch (IOException e) {
            logger.warning("Port bilgisi dosyaya yazılamadı: " + e.getMessage());
        }
    }
} 