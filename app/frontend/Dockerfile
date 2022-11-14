FROM node:16.18.1-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
RUN npm run build
CMD ["node_modules/.bin/next", "start"]