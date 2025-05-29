FROM node:22-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência primeiro para aproveitar cache
COPY package*.json ./

# Instala dependências de desenvolvimento (necessário para o Quasar CLI)
RUN npm install

# Instala o Quasar CLI globalmente no builder
RUN npm install -g @quasar/cli

# Copia o restante do projeto
COPY . .

# Gera o build da aplicação
RUN quasar build -m pwa

# STAGE FINAL - imagem enxuta com nginx
FROM nginx:alpine

# Remove configuração default
RUN rm -rf /etc/nginx/conf.d

# Copia config do nginx
COPY nginx.conf /etc/nginx/conf.d

# Copia build gerado
COPY --from=builder /app/dist/pwa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
