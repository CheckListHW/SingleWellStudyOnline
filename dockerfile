FROM ubuntu:20.04 AS build

# Копирование файлов приложения в рабочую директорию
WORKDIR /app
COPY . .

# # Установка зависимостей и сборка проекта
RUN apt-get update && DEBIAN_FRONTEND="noninteractive" TZ="Europe/Samara" apt-get install -y tzdata 
RUN apt install nodejs -y
RUN apt update
RUN apt install npm -y
RUN apt update
RUN npm i
RUN cd client
RUN npm i
RUN npm run build:prod

# # Определение образа для запуска приложения на Nginx
FROM nginx:latest

# # Копирование собранного проекта в директорию Nginx
COPY --from=build /build /usr/share/nginx/html

# Открытие порта для доступа к приложению
EXPOSE 80

# Запуск Nginx в фоновом режиме

CMD ["nginx", "-g", "daemon off;"]