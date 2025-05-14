FROM python:3.10-slim

# Inşa argümanlarını tanımla
ARG PIP_EXTRA_INDEX_URL=https://pypi.org/simple
ARG PIP_TIMEOUT=100

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Pip'i yükseltme ve ayarları yapılandırma
RUN pip install --upgrade pip && \
    pip config set global.timeout ${PIP_TIMEOUT} && \
    pip config set global.extra-index-url ${PIP_EXTRA_INDEX_URL}

# Bağımlılıkları çakışma olmadan yükle
# --no-deps ile mevcut bağımlılıkları koruyarak yükleme yap
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN addgroup --system appgroup && adduser --system --group appuser
USER appuser

# Expose the port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"] 