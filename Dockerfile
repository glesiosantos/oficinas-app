FROM node:22-slim AS builder
WORKDIR /app
ENV NODE_ENV=production
# Instalar dependências do sistema
RUN apt-get update && apt-get install -y git python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
# Instalar dependências
RUN npm install
# Instalar @quasar/cli explicitamente (caso não esteja no package.json)
RUN npm install --save-dev @quasar/cli@2.4.2
# Debug: Verificar node_modules e quasar CLI
RUN ls -la node_modules/.bin | grep quasar || echo "Quasar CLI not found in node_modules/.bin"
RUN npx quasar --version || { echo "npx quasar failed"; cat /root/.npm/_logs/*.log; exit 1; }
COPY . .
ARG VITE_URL_API
ENV VITE_URL_API=$VITE_URL_API
RUN npx quasar clean || { echo "quasar clean failed"; cat /root/.npm/_logs/*.log; exit 1; }
RUN npx quasar build -m pwa

FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/pwa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]