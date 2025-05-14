#!/bin/bash

# Renkli çıktı için tanımlamalar
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Fonksiyonlar
function showHelp {
    echo -e "${YELLOW}Atasun Chatbot Yönetim Sistemi${NC}"
    echo "Kullanım: ./manage.sh [KOMUT]"
    echo ""
    echo "Komutlar:"
    echo "  start         Tüm servisleri başlatır"
    echo "  stop          Tüm servisleri durdurur"
    echo "  restart       Tüm servisleri yeniden başlatır"
    echo "  status        Servislerin durumunu gösterir"
    echo "  logs [servis] Spesifik servisin loglarını gösterir (backend, frontend, ai-service, redis, mysql, ollama)"
    echo "  shell [servis] Belirtilen servisin shell/bash ortamına bağlanır"
    echo "  update        Tüm servisleri güncelleyerek yeniden oluşturur"
    echo "  help          Bu yardım mesajını gösterir"
    echo ""
    echo "Örnekler:"
    echo "  ./manage.sh start           # Tüm sistemi başlatır"
    echo "  ./manage.sh logs backend    # Backend loglarını görüntüler"
}

function startServices {
    echo -e "${GREEN}Tüm servisler başlatılıyor...${NC}"
    docker-compose up -d
    echo -e "${GREEN}Sistem başlatıldı! Aşağıdaki URL'lerden erişebilirsiniz:${NC}"
    echo -e "  Frontend: ${YELLOW}http://localhost:3000${NC}"
    echo -e "  Backend API: ${YELLOW}http://localhost:8081/api${NC}"
    echo -e "  AI Service: ${YELLOW}http://localhost:8000${NC}"
    echo -e "  PhpMyAdmin: ${YELLOW}http://localhost:8081${NC}"
}

function stopServices {
    echo -e "${YELLOW}Tüm servisler durduruluyor...${NC}"
    docker-compose down
    echo -e "${GREEN}Tüm servisler durduruldu${NC}"
}

function restartServices {
    echo -e "${YELLOW}Tüm servisler yeniden başlatılıyor...${NC}"
    docker-compose restart
    echo -e "${GREEN}Tüm servisler yeniden başlatıldı${NC}"
}

function showStatus {
    echo -e "${GREEN}Servis durumları:${NC}"
    docker-compose ps
}

function showLogs {
    service="$1"
    if [ -z "$service" ]; then
        echo -e "${RED}Hangi servisin loglarını görmek istediğinizi belirtmelisiniz${NC}"
        echo "Örnek: ./manage.sh logs backend"
        echo "Kullanılabilir servisler: backend, frontend, ai-service, redis, mysql, ollama, phpmyadmin"
        return 1
    fi

    echo -e "${GREEN}$service servisi için loglar gösteriliyor...${NC}"
    docker-compose logs --tail=100 -f "$service"
}

function enterShell {
    service="$1"
    if [ -z "$service" ]; then
        echo -e "${RED}Hangi servise bağlanmak istediğinizi belirtmelisiniz${NC}"
        echo "Örnek: ./manage.sh shell backend"
        echo "Kullanılabilir servisler: backend, frontend, ai-service, redis, mysql, ollama, phpmyadmin"
        return 1
    fi

    echo -e "${GREEN}$service servisine bağlanılıyor...${NC}"
    
    if [ "$service" = "redis" ]; then
        docker-compose exec "$service" redis-cli
    else
        docker-compose exec "$service" bash || docker-compose exec "$service" sh
    fi
}

function updateServices {
    echo -e "${YELLOW}Tüm servisler güncellenip yeniden oluşturuluyor...${NC}"
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    echo -e "${GREEN}Güncelleme tamamlandı!${NC}"
}

# Ana menü
case "$1" in
    start)
        startServices
        ;;
    stop)
        stopServices
        ;;
    restart)
        restartServices
        ;;
    status)
        showStatus
        ;;
    logs)
        showLogs "$2"
        ;;
    shell)
        enterShell "$2"
        ;;
    update)
        updateServices
        ;;
    help|*)
        showHelp
        ;;
esac 