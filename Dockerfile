FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install -g @quasar/cli

RUN npm install

ENV NODE_ENV=production

RUN quasar build -m pwa

FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d

COPY nginx.conf /etc/nginx/conf.d

COPY --from=builder /app/dist/pwa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
