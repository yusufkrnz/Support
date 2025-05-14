#!/bin/bash

echo "Testing login with customer@support.com..."
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@support.com","password":"password123"}'

echo -e "\n\nTesting login with admin@support.com..."
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@support.com","password":"password123"}'

echo -e "\n\nTesting login with manager@support.com..."
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@support.com","password":"password123"}' 