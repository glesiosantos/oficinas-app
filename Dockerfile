FROM node:22-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
# Instalar dependências do sistema
RUN apk add --no-cache git python3 make g++
COPY package*.json ./
# Limpar cache do npm para evitar corrupção
RUN npm cache clean --force
RUN npm install
COPY . .
ARG VITE_URL_API
ENV VITE_URL_API=$VITE_URL_API
# Usar npx para executar quasar
RUN npx quasar clean
RUN npx quasar build -m pwa

FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/pwa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]