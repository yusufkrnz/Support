#!/bin/sh
set -e

# Actuator health endpoint kontrolü
health_url="http://localhost:8080/api/actuator/health"
status_code=$(wget --server-response --spider --timeout=10 --tries=1 "${health_url}" 2>&1 | grep -m1 "HTTP/" | awk '{print $2}')

if [ "$status_code" = "200" ]; then
    exit 0
else
    echo "Sağlık kontrolü başarısız oldu! Status kod: $status_code"
    exit 1
fi 