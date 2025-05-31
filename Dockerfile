FROM node:22-slim AS builder

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache git python3 make g++ npm

RUN npm cache clean --force

COPY package*.json ./

RUN npm install || { cat /root/.npm/_logs/*.log; exit 1; }

RUN npm install -g @quasar/cli@2.4.1 || { cat /root/.npm/_logs/*.log; exit 1; }

RUN quasar --version || { echo "quasar command failed"; exit 1; }

COPY . .

RUN ls -la /app || { echo "ls failed"; exit 1; }

RUN test -f /app/quasar.config.js && echo "quasar.config.js found" || echo "quasar.config.js not found"

ARG VITE_URL_API
ENV VITE_URL_API=$VITE_URL_API

RUN quasar clean || { echo "quasar clean failed"; cat /root/.npm/_logs/*.log; cat /app/quasar.config.js; exit 1; }

RUN quasar build -m pwa

FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/pwa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]