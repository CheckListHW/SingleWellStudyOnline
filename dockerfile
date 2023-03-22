FROM node:14.18.0

WORKDIR /app

COPY . .

# Установка зависимостей и сборка проекта
RUN npm install
RUN npm run client:install
RUN sh -c 'cd client && npm run build:prod'
ENTRYPOINT npm run start