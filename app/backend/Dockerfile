FROM node:16.18.1-alpine
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD [ "node", "dist/main.js" ]