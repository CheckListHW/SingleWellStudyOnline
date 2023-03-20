const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwtoken = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');

const User = require('../models/User');
const PersonalData = require('../models/PersonalData');

const router = Router();

const loginMiddlewares = [
  check('email', 'Введите корректный e-mail! Please enter a valid e-mail!').normalizeEmail().isEmail(),
  check('password', 'Введите пароль! Please enter a password!').exists(),
];

const onLogin = async (request, response) => {
  try {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при входе Invalid login data',
      });
    }

    const { email, password } = request.body;
    const user = await User.findOne({ email });

    if (!user) {
      return response.status(400).json({ message: 'Нет такого пользователя! There is no such user!'})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return response.status(400).json({ message: 'Не верный пароль! Invalid password!' });
    }

    if(!user.isActive || user.activeUntil < Date.now()) {
      return response.status(403).json({ message: 'Ваша учетная запись более не активна. Обратитесь к администратору. Your account is no longer active. Contact your administrator.' });
    }

    const userId = user._id;
    const personalData = await PersonalData.findOne({ user: userId});
    const name = personalData ? personalData.name : '';
    const surname = personalData ? personalData.surname : '';
    const speciality = personalData ? personalData.speciality : '';
    const experience = personalData ? personalData.experience : 0;
    const course = personalData ? personalData.course : '';
    const expectations = personalData ? personalData.expectations : '';
    const token = jwtoken.sign(
      { userId },
      config.get('jwtSecretKey'),
      { expiresIn: '12h' },
    );

    response.status(200).json({
      token,
      id: userId,
      name,
      surname,
      speciality,
      experience,
      course,
      expectations,
    });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

router.post('/login', loginMiddlewares, onLogin);

module.exports = router;
