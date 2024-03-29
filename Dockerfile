# syntax=docker/dockerfile:1

FROM node:latest
ENV NODE_ENV=production
EXPOSE 3000
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
RUN npm install -g serve
COPY . .
RUN npm run build
CMD [ "serve", "-s", "build" ]