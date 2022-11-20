FROM node:16.18.1-alpine
RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY . /usr/src
RUN npm install --force
RUN npm run build
EXPOSE 3000
CMD npm run start