FROM docker.io/node:lts-alpine 

WORKDIR /app

COPY package*.json ./


 
COPY . .
RUN npm install -g
 
