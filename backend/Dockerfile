FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Maven bağımlılıklarını önbelleğe almak için pom.xml dosyasını kopyala
COPY pom.xml .
# Bağımlılıkları indirin, bu adımı önbelleğe almak için ayrı bir adım olarak düzenlendi
RUN mvn dependency:go-offline -B

# Kaynak kodlarını kopyala
COPY src ./src

# Uygulamayı derle
RUN mvn package -DskipTests -B

# İkinci aşama: Çalışma aşaması için daha küçük bir temel imaj
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Derleme aşamasından JAR dosyasını kopyala
COPY --from=builder /app/target/*.jar app.jar

# Sağlık kontrol scripti
COPY docker-healthcheck.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-healthcheck.sh

# Health check için yapılandırma
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 CMD ["docker-healthcheck.sh"]

# Environment değişkenleri
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xms512m -Xmx1024m"

# Application kullanıcısı oluştur ve yetkileri düzenle
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Port açıklaması
EXPOSE 8080

# Uygulamayı çalıştır
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 