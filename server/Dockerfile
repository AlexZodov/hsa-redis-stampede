FROM node:18.17.0-alpine as test

WORKDIR /usr/src/app

COPY package.json package-lock.json .

RUN npm clean-install

COPY . .

RUN npm run build

EXPOSE 3000

FROM test

RUN npm prune --production
