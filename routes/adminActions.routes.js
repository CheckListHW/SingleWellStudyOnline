const { Router } = require('express');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwtoken = require('jsonwebtoken');
const jsZip = require('jszip');
const fs = require('fs');
const { makePdfReport, getRouteTimePoints } = require('../helpers');

const User = require('../models/User');
const PersonalData = require('../models/PersonalData');
const TraceData = require('../models/TraceData');
const TabStates = require('../models/TabStates');
const PassedPoints = require('../models/PassedPoints');
const CurvesExpressions = require('../models/CurvesExpressions');
const CoreData = require('../models/CoreData');
const CalculatedCurves = require('../models/CalculatedCurves');
const CalculatedCurvesForTabs = require('../models/CalculatedCurvesForTabs');
const BasicParameters = require('../models/BasicParameters');
const AppPosition = require('../models/AppPosition');
const Dataset = require('../models/Dataset');
const RouteTime = require('../models/RouteTime');
const Screenshot = require('../models/Screenshot');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

const onDeleteUser = async (request, response) => {
  try {
    const { userId } = request.body;
    const { adminId } = request.user;

    await User.findOneAndDelete({ _id: userId });
    await PersonalData.findOneAndDelete({ user: userId });
    await TraceData.findOneAndDelete({ user: userId });
    await TabStates.findOneAndDelete({ user: userId });
    await PassedPoints.findOneAndDelete({ user: userId });
    await CurvesExpressions.findOneAndDelete({ user: userId });
    await CoreData.findOneAndDelete({ user: userId });
    await CalculatedCurves.findOneAndDelete({ user: userId });
    await CalculatedCurvesForTabs.findOneAndDelete({ user: userId });
    await BasicParameters.findOneAndDelete({ user: userId });
    await AppPosition.findOneAndDelete({ user: userId });
    await RouteTime.findOneAndDelete({ user: userId });
    await Screenshot.findOneAndDelete({ user: userId });

    const admin = await Admin.findOne({ _id: adminId });
    const lastFoundUsersEmail = admin && admin.lastFoundUsersEmail ? admin.lastFoundUsersEmail : '';
    const emailRegexp = new RegExp(lastFoundUsersEmail);
    const users = await User.find({});
    const filteredUsers = users.filter(user => emailRegexp.test(user.email));

    response.status(200).json({
      message: 'Пользователь удален',
      foundUsers: filteredUsers.map(user => ({
        email: user.email,
        id: user._id,
        isActive: Boolean(user.isActive),
        activeUntil: user.activeUntil ? user.activeUntil : (new Date()).getTime(),
        datasetId: user.datasetId,
      })),
    });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onChangePassword = async (request, response) => {
  try {
    const { newPassword, userId } = request.body;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return response.status(400).json({ message: 'Нет такого пользователя!' })
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate({ _id: userId }, { password: hashedPassword, stupidPass: newPassword });

    response.status(200).json({ message: 'Пароль успешно обновлен!' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onRegistrateUser = async (request, response) => {
  try {
    const { email, password, activeUntil, datasetId } = request.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      return response.status(400).json({ message: 'Пользователь с таким e-mail уже существует.'
        + ' Попробуйте другой e-mail.'})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, stupidPass: password,
      isActive: true, activeUntil, datasetId });

    await user.save();
    response.status(201).json({ message: 'Пользователь создан' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onFindUsers = async (request, response) => {
  try {
    const { email } = request.body;
    const { adminId } = request.user;
    const users = await User.find({});

    if (!users) {
      return response.status(404).json({ message: 'Пользователи с таким email не найдены, попробуйте еще.'})
    }

    await Admin.findOneAndUpdate({ _id: adminId }, { lastFoundUsersEmail: email });
    const emailRegexp = new RegExp(email);
    const filteredUsers = users.filter(user => emailRegexp.test(user.email));

    response.status(200).json({
      foundUsers: filteredUsers.map(user => ({
        email: user.email,
        id: user._id,
        isActive: Boolean(user.isActive),
        activeUntil: user.activeUntil ? user.activeUntil : (new Date()).getTime(),
        datasetId: user.datasetId,
      })),
    });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onChangeUserActivity = async (request, response) => {
  try {
    const { activeUntil, isActive, userId } = request.body;
    const { adminId } = request.user;
    const admin = await Admin.findOne({ _id: adminId });
    const lastFoundUsersEmail = admin && admin.lastFoundUsersEmail ? admin.lastFoundUsersEmail : '';
    const emailRegexp = new RegExp(lastFoundUsersEmail);  
    const user = await User.findOne({ _id: userId }); 

    if (!user) {
      return response.status(400).json({ message: 'Нет такого пользователя!' })
    }

    const updateData = {
      activeUntil,
      isActive,
    };
  
    await User.findOneAndUpdate({ _id: userId }, updateData);

    const users = await User.find({});
    const filteredUsers = users.filter(user => emailRegexp.test(user.email));

    response.status(200).json({
      message: 'Активность пользователя успешно обновлена!',
      foundUsers: filteredUsers.map(user => ({
        email: user.email,
        id: user._id,
        isActive: Boolean(user.isActive),
        activeUntil: user.activeUntil ? user.activeUntil : (new Date()).getTime(),
        datasetId: user.datasetId,
      })),
    });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetAllUserData = async (request, response) => {
  try {
    const { userId } = request.body;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return response.status(400).json({ message: 'Нет такого пользователя!' })
    }

    const trace = await TraceData.findOne({ user: userId });
    const traceData = trace ? trace.trace.map(item => ({ id: item.id, text: item.text })) : [];

    const appPositionData = await AppPosition.findOne({ user: userId });
    const appPosition = appPositionData ? appPositionData.appPosition : 20;

    const tabsStates = await TabStates.findOne({ user: userId });
    const featuresStates = tabsStates ? JSON.parse(tabsStates.tabStates) : {};

    const calculatedCurvesData = await CalculatedCurves.findOne({ user: userId });
    const calculatedCurves = calculatedCurvesData ? JSON.parse(calculatedCurvesData.data) : {};

    const calculatedCurvesForTabsData = await CalculatedCurvesForTabs.findOne({ user: userId });
    const calculatedCurvesForTabs = calculatedCurvesForTabsData ? JSON.parse(calculatedCurvesForTabsData.data) : {};

    const basicParametersData = await BasicParameters.findOne({ user: userId });
    const basicParameters = basicParametersData ? basicParametersData.data : [];

    const passedPointsData = await PassedPoints.findOne({ user: userId });
    const passedPoints = passedPointsData ? passedPointsData.data : [];

    const core = await CoreData.findOne({ user: userId });
    const coreData = core ? core.data : [];

    const expressions = await CurvesExpressions.findOne({ user: userId });
    const curvesExpressions = expressions ? expressions.data : {};

    const dataset = await Dataset.findOne({ datasetId: user.datasetId });
    const researchData = dataset ? JSON.parse(dataset.data) : {};

    const token = jwtoken.sign(
      { userId },
      config.get('jwtSecretKey'),
      { expiresIn: '12h' },
    );

    response.status(200).json({
      token,
      id: userId,
      traceData,
      appPosition,
      featuresStates,
      calculatedCurves,
      calculatedCurvesForTabs,
      basicParameters,
      passedPoints,
      coreData,
      curvesExpressions,
      researchData,
    });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onSaveDataset = async (request, response) => {
  try {
    const { dataset, datasetId, description } = request.body;
    const candidateDataset = await Dataset.findOne({ datasetId });

    if (candidateDataset) {
      return response.status(400).json({ message: 'Набор данных с таким номером уже существует.'
        + ' Попробуйте другой номер.'})
    }

    const newDataset = new Dataset({ datasetId, data: JSON.stringify(dataset), description });
    await newDataset.save();
    const datasetList = await Dataset.find({});

    response.status(200).json({
      message: 'Набор данных сохранен',
      datasetList: datasetList.map(item => ({
        datasetId: item.datasetId,
        description: item.description,
        downloadDate: item.downloadDate,
      })),
  });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetAllDatasets = async (request, response) => {
  try {
    const datasetList = await Dataset.find({});

    response.status(200).json({
      datasetList: datasetList.map(item => ({
        datasetId: item.datasetId,
        description: item.description,
        downloadDate: item.downloadDate,
      })),
    });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onRemoveDataset = async (request, response) => {
  try {
    const { datasetId } = request.body;

    await Dataset.findOneAndDelete({ datasetId });

    const datasetList = await Dataset.find({});

    response.status(200).json({
      message: 'Набор данных удален',
      datasetList: datasetList.map(item => ({
        datasetId: item.datasetId,
        description: item.description,
        downloadDate: item.downloadDate,
      })),
    });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetUsersReports = async (request, response) => {
  try {
    const { usersList } = request.body;
    const zip = new jsZip();

    for (const user of usersList) {
      const routeTime = await RouteTime.findOne({ user: user.userId });
      const routeTimePoints = getRouteTimePoints(routeTime ? routeTime.data : []);
      const screenshots = await Screenshot.findOne({ user: user.userId });
      const screenshotsList = screenshots ? screenshots.data : [];
      const doc = makePdfReport(user.email, routeTimePoints, screenshotsList);
      zip.file(`${user.email}.pdf`, doc);
    }

    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(response);

  } catch(error) {
    response.status(500).json({ message: error });
  }
};

const onGetAllUsers = async (request, response) => {
  try {
    const users = await User.find({});

    response.status(200).json({
      usersList: users.map((user, index) => ({
        orderNumber: index + 1,
        email: user.email,
        password: user.stupidPass,
        datasetId: user.datasetId,
        isActive: Boolean(user.isActive),
        activeUntil: user.activeUntil ? user.activeUntil : (new Date()).getTime(),
      }),
    )});

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

router.post('/delete-user', authMiddleware, onDeleteUser);
router.post('/change-user-password', authMiddleware, onChangePassword);
router.post('/registrate-user', authMiddleware, onRegistrateUser);
router.post('/change-user-activity', authMiddleware, onChangeUserActivity);
router.post('/get-all-user-data', authMiddleware, onGetAllUserData)
router.post('/find-users', authMiddleware, onFindUsers);
router.post('/save-dataset', authMiddleware, onSaveDataset);
router.get('/get-all-datasets', authMiddleware, onGetAllDatasets);
router.post('/remove-dataset', authMiddleware, onRemoveDataset);
router.post('/get-users-reports', authMiddleware, onGetUsersReports);
router.get('/get-all-users', authMiddleware, onGetAllUsers);

module.exports = router;
