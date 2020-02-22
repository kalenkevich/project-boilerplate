FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY wait-for-databases.sh ./
COPY bin/ ./bin

RUN apk update; apk add curl; apk add --no-cache bash; npm install

COPY . .

EXPOSE 9000

CMD npm run start
