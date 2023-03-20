const jwtoken = require('jsonwebtoken');
const config = require('config');

module.exports = (request, response, next) => {
  if (request.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = request.headers.authorization.split(' ')[1];

    if (!token) {
      return response.status(401).json({ message: 'Отсутствует токен авторизации в запросе'});
    }

    const decodedToken = jwtoken.verify(token, config.get('jwtSecretKey'));
    request.user = decodedToken;
    next();

  } catch(error) {
    response.status(401).json({ message: 'Авторизация не прошла'});
  }
}