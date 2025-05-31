FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache git

COPY package*.json ./

RUN npm install

RUN npm install -g @quasar/cli@2.4.1

COPY . .

ARG VITE_URL_API
ENV VITE_URL_API=$VITE_URL_API

RUN npx quasar build -m pwa

FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/pwa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
