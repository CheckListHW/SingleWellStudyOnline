# Frontend часть проекта
В основе react-redux-starter-kit. (https://github.com/fullstack-development/react-redux-starter-kit)
Там достаточно подробное описание в доке по поводу архитектуры и используемых зависимостей. Настройка адреса api
в файле config/default.json в корень проекта (задается в файле src/services/api/Api.ts, можно переписать вручную).



## NPM scripts

### Установка зависимостей
- ```npm i```

### Для локального запуска (адрес смотреть в консоли при запуске)
- ```npm run dev``` for development environment in watch mode
- ```npm run prod``` for production environment in watch mode

### Для сборки (смотри папку build)
- ```npm run build:dev``` for development environment without watch mode
- ```npm run build:prod``` for production environment without watch mode
