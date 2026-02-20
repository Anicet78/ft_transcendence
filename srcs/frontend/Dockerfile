FROM node:25.2.1 AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.29.4

WORKDIR /usr/share/nginx

COPY --from=builder /app/build .

RUN sed -i '/<\/title>/a <script src="/env-config.js"></script>' /usr/share/nginx/index.html

ENTRYPOINT ["sh", "-c", "echo \"window._env_ = {VITE_GOOGLE_CLIENT_ID: '$VITE_GOOGLE_CLIENT_ID', VITE_42_CLIENT_ID: '$VITE_42_CLIENT_ID'};\" > /usr/share/nginx/env-config.js && nginx -g 'daemon off;'"]
