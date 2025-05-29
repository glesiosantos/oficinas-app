FROM node:22-alpine AS builder

WORKDIR /app

# Copia todos os arquivos primeiro (projeto completo)
COPY . .

# Instala dependências e roda postinstall (quasar prepare)
RUN npm install --omit=dev

# Build da aplicação
RUN npx quasar build -m pwa

FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d

COPY nginx.conf /etc/nginx/conf.d

COPY --from=builder /app/dist/pwa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
