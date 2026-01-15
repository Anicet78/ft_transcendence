FROM node:25.2.1

WORKDIR /app

COPY ./prisma_entrypoint.sh /usr/local/bin/prisma_entrypoint.sh
RUN chmod +x /usr/local/bin/prisma_entrypoint.sh

COPY ./package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

ENTRYPOINT ["/app/prisma_entrypoint.sh"]
CMD ["npm", "start"]
