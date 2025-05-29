# Etapa 1: Build da aplicação Quasar
FROM node:22-alpine AS builder

WORKDIR /app

# Copia os arquivos e instala dependências
COPY package*.json ./
RUN npm install

COPY . .

# Build PWA
RUN quasar build -m pwa

# Etapa 2: Nginx para servir os arquivos estáticos
FROM nginx:alpine

# Remove a configuração padrão
RUN rm -rf /etc/nginx/conf.d

# Copia a nova configuração customizada
COPY nginx.conf /etc/nginx/conf.d

# Copia os arquivos gerados do Quasar para o diretório do Nginx
COPY --from=builder /app/dist/pwa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
