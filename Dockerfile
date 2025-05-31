FROM node:22-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
# Instalar dependências do sistema
RUN apk add --no-cache git python3 make g++ npm
# Limpar cache do npm
RUN npm cache clean --force
COPY package*.json ./
RUN npm install || { cat /root/.npm/_logs/*.log; exit 1; }
# Instalar @quasar/cli globalmente com depuração
RUN npm install -g @quasar/cli@2.4.2 || { cat /root/.npm/_logs/*.log; exit 1; }
# Verificar instalação do quasar
RUN quasar --version || { echo "quasar command failed"; exit 1; }
COPY . .
ARG VITE_URL_API
ENV VITE_URL_API=$VITE_URL_API
RUN quasar clean || { echo "quasar clean failed"; cat /root/.npm/_logs/*.log; exit 1; }
RUN quasar build -m pwa

FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/pwa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]