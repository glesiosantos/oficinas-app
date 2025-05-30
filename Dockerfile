FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @quasar/cli

COPY . .

RUN npm install

ENV NODE_ENV=production

RUN quasar clean
RUN quasar build -m pwa

FROM nginx:alpine

# Corrigido: remover apenas o default.conf
RUN rm /etc/nginx/conf.d/default.conf

# Copia a config corrigida
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos do build
COPY --from=builder /app/dist/pwa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
