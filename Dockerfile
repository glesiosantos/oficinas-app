FROM node:22-alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

# Instala Quasar CLI globalmente
RUN npm install -g @quasar/cli

# Copia todos os arquivos primeiro (precisa do projeto completo para rodar "quasar prepare")
COPY . .

# Instala dependências (vai rodar o "postinstall", ou seja, "quasar prepare")
RUN npm install --omit=dev

# Build da aplicação em modo PWA
RUN quasar build -m pwa

FROM nginx:alpine

ENV NODE_ENV=production

RUN rm -rf /etc/nginx/conf.d

COPY nginx.conf /etc/nginx/conf.d

COPY --from=builder /app/dist/pwa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
