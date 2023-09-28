FROM node:18-alpine

EXPOSE 80

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build

CMD [ "npm", "run", "start:prod" ]
