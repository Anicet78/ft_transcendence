FROM node:25.2.1 AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.29.4

WORKDIR /usr/share/nginx

COPY --from=builder /app/build .

CMD ["nginx", "-g", "daemon off;"]
