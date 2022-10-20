FROM node:16-alpine
WORKDIR /server
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3005
CMD [ "node","server.js" ]