FROM node:22-alpine AS builder

# Define ambiente de produção
ENV NODE_ENV=production

WORKDIR /app

# Copia todos os arquivos do projeto
COPY . .

# Instala Quasar CLI globalmente
RUN npm install -g @quasar/cli

# Instala apenas dependências de produção
RUN npm install --omit=dev

# Build da aplicação Quasar em modo PWA
RUN quasar build -m pwa

# Etapa final - container leve com Nginx
FROM nginx:alpine

# Define ambiente de produção (de novo, por garantia)
ENV NODE_ENV=production

# Remove configs padrão do Nginx
RUN rm -rf /etc/nginx/conf.d

# Copia configuração personalizada do nginx
COPY nginx.conf /etc/nginx/conf.d

# Copia a build da aplicação para o diretório do nginx
COPY --from=builder /app/dist/pwa /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
