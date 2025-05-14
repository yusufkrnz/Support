package com.Destek.Support;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.http.HttpMessageConvertersAutoConfiguration;
import org.springframework.boot.autoconfigure.http.client.HttpClientAutoConfiguration;
import org.springframework.boot.autoconfigure.web.client.RestClientAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

import java.net.InetAddress;
import java.util.Arrays;
import java.util.logging.Logger;

@SpringBootApplication(exclude = {
	HttpClientAutoConfiguration.class,
	HttpMessageConvertersAutoConfiguration.class,
	RestClientAutoConfiguration.class
})
@EnableJpaAuditing
public class SupportApplication {

	private static final Logger logger = Logger.getLogger(SupportApplication.class.getName());

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(SupportApplication.class, args);
		
		try {
			Environment env = context.getEnvironment();
			String protocol = "http";
			String serverPort = env.getProperty("server.port", "8080");
			String contextPath = env.getProperty("server.servlet.context-path", "/");
			if (contextPath.isEmpty()) contextPath = "/";
			
			String hostAddress = "localhost";
			try {
				hostAddress = InetAddress.getLocalHost().getHostAddress();
			} catch (Exception e) {
				logger.warning("Yerel IP adresi alınamadı: " + e.getMessage());
			}
			
			logger.info("\n----------------------------------------------------------\n\t" +
					"Uygulama Durumu: " + env.getProperty("spring.application.name") + " BAŞLATILDI\n\t" +
					"Profil(ler): " + Arrays.toString(env.getActiveProfiles()) + "\n\t" +
					"URL: " + protocol + "://" + hostAddress + ":" + serverPort + contextPath + "\n\t" +
					"Swagger UI: " + protocol + "://" + hostAddress + ":" + serverPort + contextPath + 
							env.getProperty("springdoc.swagger-ui.path", "/swagger-ui.html") + "\n\t" +
					"Log düzeyi: " + env.getProperty("logging.level.com.destek.support", "INFO") + "\n\t" + 
					"Veri tabanı: " + env.getProperty("spring.datasource.url", "Yapılandırılmamış") + "\n\t" +
					"Gemini API yapılandırıldı: " + (env.getProperty("gemini.api.key") != null ? "EVET" : "HAYIR") + "\n" +
					"----------------------------------------------------------");
			
			logger.info("İade işlemleri için Gemini API servisi başlatıldı");
			logger.info("Logger yapılandırması tamamlandı");
		} catch (Exception e) {
			logger.severe("Uygulama bilgileri gösterilirken hata oluştu: " + e.getMessage());
		}
	}

}
