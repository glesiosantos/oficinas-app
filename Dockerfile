FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g @quasar/cli

COPY . .

RUN npm install

ARG VITE_URL_API

ENV VITE_URL_API=$VITE_URL_API

RUN quasar clean

RUN quasar build -m pwa

FROM nginx:alpine

ENV NODE_ENV=production

COPY nginx/default.conf /etc/nginx/conf.d/

RUN ls -la /etc/nginx/conf.d/

COPY --from=builder /app/dist/pwa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
