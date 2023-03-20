const { Router } = require('express');
const config = require('config');
const fs = require('fs');

const TraceData = require('../models/TraceData');
const AppPosition = require('../models/AppPosition');
const User = require('../models/User');
const TabStates = require('../models/TabStates');
const CalculatedCurves = require('../models/CalculatedCurves');
const CalculatedCurvesForTabs = require('../models/CalculatedCurvesForTabs');
const BasicParameters = require('../models/BasicParameters');
const PassedPoints = require('../models/PassedPoints');
const CoreData = require('../models/CoreData');
const CurvesExpressions = require('../models/CurvesExpressions');
const Dataset = require('../models/Dataset');
const RouteTime = require('../models/RouteTime');
const Screenshot = require('../models/Screenshot');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

const onSaveTraceData = async (request, response) => {
  try {
    const { traceData } = request.body;
    const updateData = {
      user: request.user.userId,
      trace: traceData,
    };

    await TraceData.findOneAndUpdate({ user: request.user.userId }, updateData, { upsert: true });
    response.status(200).json({ message: 'Данные о трассе обновлены Track data updated' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetTraceData = async (request, response) => {
  try {
    const { userId } = request.user;
    const traceData = await TraceData.findOne({ user: userId });
    const user = await User.findOne({ _id: userId });

    if (!traceData && user) {
      return response.status(200).json({ traceData: [] });
    }

    if (!traceData && !user) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const trace = traceData.trace.map(item => ({ id: item.id, text: item.text }));

    response.status(200).json({ traceData: trace });


  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onSaveAppPosition = async (request, response) => {
  try {
    const { appPosition } = request.body;
    const updateData = {
      user: request.user.userId,
      appPosition,
    };

    await AppPosition.findOneAndUpdate({ user: request.user.userId }, updateData, { upsert: true });
    response.status(200).json({ message: 'Данные о позиции в приложении обновлены Position data in the app has been updated' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetAppPosition = async (request, response) => {
  try {
    const appPositionData = await AppPosition.findOne({ user: request.user.userId });
    const user = await User.findOne({ _id: request.user.userId });

    if (!appPositionData && user) {
      return response.status(200).json({ message: 'У пользователя нет сохраненной позиции приложения User has no saved app position' });
    }

    if (!appPositionData && !user) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const { appPosition } = appPositionData;

    response.status(200).json({ appPosition });
  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onSaveTabState = async (request, response) => {
  try {
    const { tabState } = request.body;
    const user = await User.findOne({ _id: request.user.userId });
    const tabsStates = await TabStates.findOne({ user: request.user.userId });

    if (!tabsStates && !user) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const updateData = {
      user: request.user.userId,
      tabStates: JSON.stringify({ ...JSON.parse(tabsStates ? tabsStates.tabStates : '{}'), ...tabState }),
    };

    await TabStates.findOneAndUpdate({ user: request.user.userId }, updateData, { upsert: true });
    response.status(200).json({ message: 'Данные о состояниях вкладок обновлены Tab state data updated' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetTabsStates = async (request, response) => {
  try {
    const tabsStates = await TabStates.findOne({ user: request.user.userId });
    const user = await User.findOne({ _id: request.user.userId });

    if (!tabsStates && user) {
      return response.status(200).json({ message: 'У пользователя нет сохраненных состояний вкладок User has no saved tab states', tabStates: '{}' });
    }

    if (!tabsStates) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const { tabStates } = tabsStates;

    response.status(200).json({ tabStates });
  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onSaveCalculatedCurves = async (request, response) => {
  try {
    const { calculatedCurves } = request.body;
    const user = await User.findOne({ _id: request.user.userId });
    const calculatedCurvesData = await CalculatedCurves.findOne({ user: request.user.userId });

    if (!user && !calculatedCurvesData) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const updateData = {
      user: request.user.userId,
      data: JSON.stringify(calculatedCurves),
    };

    await CalculatedCurves.findOneAndUpdate({ user: request.user.userId }, updateData, { upsert: true });
    response.status(200).json({ message: 'Данные о кривых обновлены Curve data updated' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetCalculatedCurves = async (request, response) => {
  try {
    const calculatedCurves = await CalculatedCurves.findOne({ user: request.user.userId });
    const user = await User.findOne({ _id: request.user.userId });

    if (!calculatedCurves && user) {
      return response.status(200).json({ message: 'У пользователя нет сохраненных кривых User has no saved curves', calculatedCurves: '{}' });
    }

    if (!user && !calculatedCurves) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const { data } = calculatedCurves;

    response.status(200).json({ calculatedCurves: data });
  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onSaveCalculatedCurvesForTabs = async (request, response) => {
  try {
    const { calculatedCurvesForTabs } = request.body;
    const user = await User.findOne({ _id: request.user.userId });
    const calculatedCurvesForTabsData = await CalculatedCurvesForTabs.findOne({ user: request.user.userId });

    if (!user && !calculatedCurvesForTabsData) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const updateData = {
      user: request.user.userId,
      data: JSON.stringify(calculatedCurvesForTabs),
    };

    await CalculatedCurvesForTabs.findOneAndUpdate({ user: request.user.userId }, updateData, { upsert: true });
    response.status(200).json({ message: 'Данные о кривых для вкладок обновлены Curve data for tabs updated' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetCalculatedCurvesForTabs = async (request, response) => {
  try {
    const calculatedCurvesForTabsData = await CalculatedCurvesForTabs.findOne({ user: request.user.userId });
    const user = await User.findOne({ _id: request.user.userId });

    if (!calculatedCurvesForTabsData && user) {
      return response.status(200).json({ message: 'У пользователя нет сохраненных кривых для вкладок User has no saved curves for tabs', calculatedCurvesForTabs: '{}' });
    }

    if (!user && !calculatedCurvesForTabsData) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const { data } = calculatedCurvesForTabsData;

    response.status(200).json({ calculatedCurvesForTabs: data });
  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onSaveBasicParameters = async (request, response) => {
  try {
    const { basicParameters } = request.body;
    const user = await User.findOne({ _id: request.user.userId });
    const basicParametersData = await BasicParameters.findOne({ user: request.user.userId });

    if (!user && !basicParametersData) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const updateData = {
      user: request.user.userId,
      data: basicParameters,
    };

    await BasicParameters.findOneAndUpdate({ user: request.user.userId }, updateData, { upsert: true });
    response.status(200).json({ message: 'Данные о базовых параметрах обновлены Base parameters data updated' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetBasicParameters = async (request, response) => {
  try {
    const basicParametersData = await BasicParameters.findOne({ user: request.user.userId });
    const user = await User.findOne({ _id: request.user.userId });

    if (!basicParametersData && user) {
      return response.status(200).json({ message: 'У пользователя нет сохраненных базовых параметров The user has no saved base parameters', basicParameters: [] });
    }

    if (!user && !basicParametersData) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const { data } = basicParametersData;

    response.status(200).json({ basicParameters: data });
  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onSavePassedPoints = async (request, response) => {
  try {
    const { passedPoints } = request.body;
    const user = await User.findOne({ _id: request.user.userId });
    const passedPointsData = await PassedPoints.findOne({ user: request.user.userId });

    if (!user && !passedPointsData) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const updateData = {
      user: request.user.userId,
      data: passedPoints,
    };

    await PassedPoints.findOneAndUpdate({ user: request.user.userId }, updateData, { upsert: true });
    response.status(200).json({ message: 'Данные о пройденных пунктах обновлены The data on the passed points has been updated' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetPassedPoints = async (request, response) => {
  try {
    const passedPointsData = await PassedPoints.findOne({ user: request.user.userId });
    const user = await User.findOne({ _id: request.user.userId });

    if (!passedPointsData && user) {
      return response.status(200).json({ message: 'У пользователя нет сохраненных пройденных пунктов The user does not have any saved passed points', passedPoints: [] });
    }

    if (!user && !passedPointsData) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const { data } = passedPointsData;

    response.status(200).json({ passedPoints: data });
  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onSaveCoreData = async (request, response) => {
  try {
    const { coreData } = request.body;
    const user = await User.findOne({ _id: request.user.userId });
    const core = await CoreData.findOne({ user: request.user.userId });

    if (!user && !core) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const updateData = {
      user: request.user.userId,
      data: coreData,
    };

    await CoreData.findOneAndUpdate({ user: request.user.userId }, updateData, { upsert: true });
    response.status(200).json({ message: 'Данные об изменениях в керне сохранены The core change data saved' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetCoreData = async (request, response) => {
  try {
    const core = await CoreData.findOne({ user: request.user.userId });
    const user = await User.findOne({ _id: request.user.userId });

    if (!core && user) {
      return response.status(200).json({ message: 'У пользователя нет сохраненных данных об изменениях в керне The user does not have any saved core data', coreData: [] });
    }

    if (!user && !core) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const { data } = core;

    response.status(200).json({ coreData: data });
  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onSaveCurvesExpressions = async (request, response) => {
  try {
    const { curvesExpressions } = request.body;
    const user = await User.findOne({ _id: request.user.userId });
    const expressions = await CurvesExpressions.findOne({ user: request.user.userId });

    if (!user && !expressions) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const updateData = {
      user: request.user.userId,
      data: JSON.stringify(curvesExpressions),
    };

    await CurvesExpressions.findOneAndUpdate({ user: request.user.userId }, updateData, { upsert: true });
    response.status(200).json({ message: 'Данные о выражениях кривых сохранены The curves expressions data saved' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetCurvesExpressions = async (request, response) => {
  try {
    const expressions = await CurvesExpressions.findOne({ user: request.user.userId });
    const user = await User.findOne({ _id: request.user.userId });

    if (!expressions && user) {
      return response.status(200).json({ message: 'У пользователя нет сохраненных выражений кривых The user does not have any saved curves expressions', curvesExpressions: {} });
    }

    if (!user && !expressions) {
      return response.status(404).json({ message: 'Данные не найдены Data not found' });
    }

    const { data } = expressions;

    response.status(200).json({ curvesExpressions: JSON.parse(data) });
  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onGetResearchData = async (request, response) => {
  try {
    const { userId } = request.user;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return response.status(404).json({ message: 'Пользователь не найден User not found' });
    }

    const dataset = await Dataset.findOne({ datasetId: user.datasetId });

    if (!dataset) {
      return response.status(200).json({ researchData: {} });
    }

    response.status(200).json({ researchData: JSON.parse(dataset.data) });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onSaveScreenshot = async (request, response) => {
  try {
    const { userId } = request.user;
    const user = await User.findOne({ _id: userId });
    const screenshot = await Screenshot.findOne({ user: userId });

    if (!user) {
      return response.status(404).json({ message: 'Пользователь не найден User not found' });
    }

    const { appPosition, base64Image } = request.body;

    if (!screenshot) {
      await Screenshot.findOneAndUpdate(
        { user: userId }, 
        {
          user: userId,
          data: [].concat({ appPosition, base64Image }),
        },
        { upsert: true },
      );
      return response.status(200).json({ message: 'Скриншот сохранен' });
    }

    const isScreenshotAlreadyExist = screenshot.data.some(item => item.appPosition === appPosition);
    const updateData = {
      user: userId,
      data: isScreenshotAlreadyExist
        ? screenshot.data.map(item => item.appPosition === appPosition ? { appPosition, base64Image } : item)
        : [...screenshot.data, { appPosition, base64Image }],
    };

    await Screenshot.findOneAndUpdate({ user: userId }, updateData, { upsert: true });

    response.status(200).json({ message: 'Скриншот сохранен' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};

const onSaveRouteTime = async (request, response) => {
  try {
    const { userId } = request.user;
    const { routeTimePoint } = request.body;
    const user = await User.findOne({ _id: userId });
    const routeTime = await RouteTime.findOne({ user: userId });

    if (!user) {
      return response.status(404).json({ message: 'Пользователь не найден User not found' });
    }

    if (!routeTime) {
      await RouteTime.findOneAndUpdate(
        { user: userId }, 
        {
          user: userId,
          data: [].concat(routeTimePoint),
        },
        { upsert: true },
      );
      return response.status(200).json({ message: 'Время прохождения раздела сохранено' });
    }

    const isZeroTracePointAlreadyExist = routeTimePoint.tracePoint === '0'
      && routeTime
      && routeTime.data.some(item => item.tracePoint === '0');

      if (isZeroTracePointAlreadyExist) {
      return response.status(200).json({ message: 'Время начала работы пользователя уже есть на сервере' });
    }

    const isBuildTracePointAlreadyExist = routeTimePoint.tracePoint === '1'
      && routeTime
      && routeTime.data.some(item => item.tracePoint === '1');

    if (isBuildTracePointAlreadyExist) {
      return response.status(200).json({ message: 'Время построения трассы уже есть на сервере' });
    }

    const isTracePointAlreadyExist = routeTime.data.some(item => item.tracePoint === routeTimePoint.tracePoint);
    const updateData = {
      user: userId,
      data: isTracePointAlreadyExist
        ? routeTime.data.map(item => item.tracePoint === routeTimePoint.tracePoint ? routeTimePoint : item)
        : [...routeTime.data, routeTimePoint],
    };

    await RouteTime.findOneAndUpdate({ user: userId }, updateData, { upsert: true });

    response.status(200).json({ message: 'Время прохождения раздела сохранено' });

  } catch(error) {
    response.status(500).json({ message: config.get('internalErrorMessage') });
  }
};


router.post('/save-trace', authMiddleware, onSaveTraceData);
router.get('/get-trace', authMiddleware, onGetTraceData);
router.post('/save-app-position', authMiddleware, onSaveAppPosition);
router.get('/get-app-position', authMiddleware, onGetAppPosition);
router.post('/save-tab-state', authMiddleware, onSaveTabState);
router.get('/get-tabs-states', authMiddleware, onGetTabsStates);
router.post('/save-calculated-curves', authMiddleware, onSaveCalculatedCurves);
router.get('/get-calculated-curves', authMiddleware, onGetCalculatedCurves);
router.post('/save-calculated-curves-for-tab', authMiddleware, onSaveCalculatedCurvesForTabs);
router.get('/get-calculated-curves-for-tab', authMiddleware, onGetCalculatedCurvesForTabs);
router.post('/save-basic-parameters', authMiddleware, onSaveBasicParameters);
router.get('/get-basic-parameters', authMiddleware, onGetBasicParameters);
router.post('/save-passed-points', authMiddleware, onSavePassedPoints);
router.get('/get-passed-points', authMiddleware, onGetPassedPoints);
router.post('/save-core-data', authMiddleware, onSaveCoreData);
router.get('/get-core-data', authMiddleware, onGetCoreData);
router.post('/save-curves-expressions', authMiddleware, onSaveCurvesExpressions);
router.get('/get-curves-expressions', authMiddleware, onGetCurvesExpressions);
router.get('/get-research-data', authMiddleware, onGetResearchData);
router.post('/save-screenshot', authMiddleware, onSaveScreenshot);
router.post('/save-route-time-point', authMiddleware, onSaveRouteTime);

module.exports = router;
