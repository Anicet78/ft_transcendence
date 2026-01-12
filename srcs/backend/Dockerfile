FROM node:25.2.1

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npx prisma generate

CMD ["npm", "start"]
