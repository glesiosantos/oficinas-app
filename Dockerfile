FROM node:22-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# Limpar cache do npm
RUN npm cache clean --force
RUN npm install
# Instalar @quasar/cli globalmente
RUN npm install -g @quasar/cli@2.4.2
COPY . .
ARG VITE_URL_API
ENV VITE_URL_API=$VITE_URL_API
RUN quasar clean
RUN quasar build -m pwa

FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/pwa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]