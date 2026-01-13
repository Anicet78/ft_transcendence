FROM node:25.2.1

WORKDIR /app

# Copy entrypoint BEFORE volumes override /app
COPY ./prisma_entrypoint.sh /usr/local/bin/prisma_entrypoint.sh
RUN chmod +x /usr/local/bin/prisma_entrypoint.sh

COPY ./package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npx prisma generate

CMD ["npm", "start"]
