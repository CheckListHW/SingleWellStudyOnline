const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwtoken = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');

const Admin = require('../models/Admin');

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
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return response.status(400).json({ message: 'Нет такого администратора!'})
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return response.status(400).json({ message: 'Не верный пароль!' });
    }

    const adminId = admin._id;
    const adminEmail = email;

    const adminToken = jwtoken.sign(
      { adminId },
      config.get('jwtSecretKey'),
      { expiresIn: '6h' },
    );

    response.status(200).json({
      adminToken,
      adminId,
      adminEmail,
    });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

router.post('/login', loginMiddlewares, onLogin);

module.exports = router;
