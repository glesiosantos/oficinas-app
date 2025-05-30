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

RUN printf '\
server {\n\
  listen 80;\n\
  server_name gestor.autorevise.com.br;\n\
\n\
  root /usr/share/nginx/html;\n\
  index index.html index.htm;\n\
\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
\n\
  location /api/ {\n\
    proxy_pass http://mecanicas-api:8081/api/;\n\
    proxy_http_version 1.1;\n\
    proxy_set_header Upgrade $http_upgrade;\n\
    proxy_set_header Connection '\''upgrade'\'';\n\
    proxy_set_header Host $host;\n\
    proxy_cache_bypass $http_upgrade;\n\
  }\n\
\n\
  # Cache para arquivos estáticos\n\
  location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf|eot|json)$ {\n\
    expires 1y;\n\
    access_log off;\n\
    add_header Cache-Control \"public\";\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

RUN cat /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/pwa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
