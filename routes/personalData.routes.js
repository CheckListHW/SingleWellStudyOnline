const { Router } = require('express');
const config = require('config');

const PersonalData = require('../models/PersonalData');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

const onSavePersonalData = async (request, response) => {
  try {
    const { name, surname, speciality, course, experience, expectations } = request.body;
    const updateData = {
      user: request.user.userId,
      name,
      surname,
      speciality,
      course,
      experience,
      expectations,
    };

    await PersonalData.findOneAndUpdate({ user: request.user.userId }, updateData, { upsert: true });
    response.status(200).json({
      message: 'Персональные данные пользоватeля обновлены User personal data has been updated',
      name,
      surname,
      speciality,
      course,
      experience,
      expectations,
    });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetAllData = async (request, response) => {
  try {
    const user = await User.findOne({ _id: request.user.userId });
    const userId = user._id;
    const email = user.email;
    const personalData = await PersonalData.findOne({ user: userId});

    if (!personalData && user) {
      return response.status(200).json({ email, id: userId, message: 'Других данных нет No other data available' });
    }

    if (!personalData && !user) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const name = personalData ? personalData.name : '';
    const surname = personalData ? personalData.surname : '';
    const speciality = personalData ? personalData.speciality : '';
    const experience = personalData ? personalData.experience : 0;
    const course = personalData ? personalData.course : '';
    const expectations = personalData ? personalData.expectations : '';

    response.status(200).json({
      email,
      id: userId,
      name,
      surname,
      speciality,
      course,
      experience,
      expectations,
    });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

router.post('/save', authMiddleware, onSavePersonalData);
router.get('/get-all-data', authMiddleware, onGetAllData);

module.exports = router;
