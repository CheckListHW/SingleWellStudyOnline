
import * as allModules from 'modules';
import { ReducersMap } from 'shared/types/redux';
import { IAppData, IModule, RootSaga, IAppReduxState, IReduxEntry } from 'shared/types/app';
import { reduxEntry as notificationReduxEntry } from 'services/notification';
import { reduxEntry as userReduxEntry } from 'services/user';
import { reduxEntry as buttonClickProviderReduxEntry } from 'services/buttonClickProvider';
import { initializeI18n } from 'services/i18n/i18nContainer';
import { reduxEntry as FeatureAuthorizationReduxEntry } from 'features/authorization';
import { reduxEntry as FeaturePrivateAreaReduxEntry } from 'features/privateArea';
import { reduxEntry as FeatureTraceBuildReduxEntry } from 'features/traceBuild';
import { reduxEntry as FeatureReservoirsDefinitionEntry } from 'features/reservoirsDefinition';
import { reduxEntry as FeatureLithologyDefinitionEntry } from 'features/lithologyDefinition';
import { reduxEntry as FeatureClayContentCalculationEntry } from 'features/сlayContentCalculation';
import { reduxEntry as FeaturePorosityCalculationEntry } from 'features/porosityCalculation';
import { reduxEntry as FeatureWaterSaturationCalculationEntry } from 'features/waterSaturationCalculation';
import { reduxEntry as FeaturePenetrabilityCalculationEntry } from 'features/penetrabilityCalculation';
import { reduxEntry as FeatureLimitValuesCalculationEntry } from 'features/limitValuesCalculation';
import { reduxEntry as FeatureBasicParametersCalculationEntry } from 'features/basicParametersCalculation';
import { reduxEntry as FeatureFluidTypeDefinitionEntry } from 'features/fluidTypeDefinition';
import { reduxEntry as FeaturePerforationIntervalsDefinitionEntry } from 'features/perforationIntervalsDefinition';
import { reduxEntry as FeatureAnalogueFieldSelectionEntry } from 'features/analogueFieldSelection';
import { reduxEntry as FeatureSedimentationEnvironmentDeterminationEntry } from 'features/sedimentationEnvironmentDetermination';
import { reduxEntry as FeatureSummarySectionEntry } from 'features/summarySection';
import { reduxEntry as FeatureCalculatorEntry } from 'features/calculator';
import { reduxEntry as FeatureAdminPanelEntry } from 'features/adminPanel';

import { configureStore, createReducer } from './configureStore';
import { TYPES, container } from './configureIoc';
import { configureDeps } from './configureDeps';

type ReducerName = keyof IAppReduxState;

function configureApp(data?: IAppData): IAppData {
  /* Prepare main app elements */
  const modules: IModule[] = Object.values(allModules);

  if (data) {
    return { ...data, modules };
  }

  const sharedReduxEntries: IReduxEntry[] = [
    FeaturePrivateAreaReduxEntry,
    FeatureAuthorizationReduxEntry,
    FeatureTraceBuildReduxEntry,
    FeatureReservoirsDefinitionEntry,
    FeatureLithologyDefinitionEntry,
    FeatureClayContentCalculationEntry,
    FeaturePorosityCalculationEntry,
    FeatureWaterSaturationCalculationEntry,
    FeaturePenetrabilityCalculationEntry,
    FeatureLimitValuesCalculationEntry,
    FeatureBasicParametersCalculationEntry,
    FeatureFluidTypeDefinitionEntry,
    FeaturePerforationIntervalsDefinitionEntry,
    FeatureSedimentationEnvironmentDeterminationEntry,
    FeatureAnalogueFieldSelectionEntry,
    FeatureSummarySectionEntry,
    FeatureCalculatorEntry,
    FeatureAdminPanelEntry,
    userReduxEntry,
    notificationReduxEntry,
    buttonClickProviderReduxEntry,
  ];

  const connectedSagas: RootSaga[] = [];
  const connectedReducers: Partial<ReducersMap<IAppReduxState>> = {};

  const { runSaga, store } = configureStore();
  // TODO: research how it works with several concurrent request,
  // it seems that such bindings works well only if requests are synchronous
  try {
    container.getAll(TYPES.Store);
    container.rebind(TYPES.connectEntryToStore).toConstantValue(connectEntryToStore);
    container.rebind(TYPES.Store).toConstantValue(store);
  } catch {
    container.bind(TYPES.connectEntryToStore).toConstantValue(connectEntryToStore);
    container.bind(TYPES.Store).toConstantValue(store);
  }

  const dependencies = configureDeps();
  initializeI18n();

  sharedReduxEntries.forEach(connectEntryToStore);
  modules.forEach((module: IModule) => {
    if (module.getReduxEntry) {
      connectEntryToStore(module.getReduxEntry());
    }
  });

  function connectEntryToStore({ reducers, sagas }: IReduxEntry) {
    if (!store) {
      throw new Error('Cannot find store, while connecting module.');
    }

    if (reducers) {
      const keys = Object.keys(reducers) as ReducerName[];
      const isNeedReplace = keys.reduce(<K extends ReducerName>(acc: boolean, key: K) => {
        const featureReducer = reducers[key];
        if (!connectedReducers[key] && featureReducer) {
          connectedReducers[key] = featureReducer;
          return true;
        }
        return acc || false;
      }, false);

      if (isNeedReplace) {
        store.replaceReducer(createReducer(connectedReducers as ReducersMap<IAppReduxState>));
      }
    }

    if (sagas && __CLIENT__) {
      sagas.forEach((saga: RootSaga) => {
        if (!connectedSagas.includes(saga) && runSaga) {
          runSaga(saga(dependencies));
          connectedSagas.push(saga);
        }
      });
    }
  }

  return { modules, store };
}

export { configureApp };
