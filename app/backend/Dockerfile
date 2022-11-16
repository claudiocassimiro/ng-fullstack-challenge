FROM node:16.18.1-alpine
WORKDIR /home/node/app
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build
CMD [ "node", "dist/main.js" ]