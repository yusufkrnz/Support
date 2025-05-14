# Derleme aşaması
FROM node:16-alpine as build

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package.json package-lock.json ./
RUN npm ci

# Kaynak kodları kopyala
COPY . .

# Üretim için derleme
RUN npm run build

# Üretim aşaması - Nginx
FROM nginx:1.23-alpine

# Nginx yapılandırmasını özelleştir
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Derlenen uygulamayı Nginx'e kopyala
COPY --from=build /app/build /usr/share/nginx/html

# Sağlık kontrolü için curl ekle
RUN apk add --no-cache curl

# Sağlık kontrolü script'i oluştur
RUN echo '#!/bin/sh\n\
curl -f http://localhost:80/ || exit 1' > /usr/local/bin/healthcheck.sh \
&& chmod +x /usr/local/bin/healthcheck.sh

# nginx.pid ve ilgili dizinler için izinleri ayarla
RUN mkdir -p /var/run/ && \
    mkdir -p /var/cache/nginx && \
    mkdir -p /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R 101:101 /var/run/nginx.pid && \
    chown -R 101:101 /var/cache/nginx && \
    chown -R 101:101 /var/log/nginx

# Non-root kullanıcı oluştur
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    chown -R appuser:appgroup /var/run/nginx.pid

# Port 80'i aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"] 