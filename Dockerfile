FROM node:22-alpine AS builder

WORKDIR /app

# Copia todos os arquivos do projeto
COPY . .

# Define ambiente produção para o Node e Quasar
ENV NODE_ENV=production

# Instala apenas dependências de produção
RUN npm install --omit=dev

# Build da aplicação para produção
RUN npx quasar build -m pwa

FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d

COPY nginx.conf /etc/nginx/conf.d

COPY --from=builder /app/dist/pwa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
