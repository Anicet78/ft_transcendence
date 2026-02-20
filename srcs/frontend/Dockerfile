FROM node:25.2.1 AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN sed -i '/</title>/a <script src="/env-config.js"></script>' nom_du_fichier

RUN echo "window._env_ = {\
		VITE_GOOGLE_CLIENT_ID: '$VITE_GOOGLE_CLIENT_ID',\
		VITE_42_CLIENT_ID: '$VITE_42_CLIENT_ID'\
	};" > /usr/share/nginx/html/env-config.js

FROM nginx:1.29.4

WORKDIR /usr/share/nginx

COPY --from=builder /app/build .

CMD ["nginx", "-g", "daemon off;"]
