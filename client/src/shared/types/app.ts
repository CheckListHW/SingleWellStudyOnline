import { ReactElement } from 'react';
import { RouteProps } from 'react-router';
import { Store, Reducer, ActionCreator, Action } from 'redux';
import { SagaIterator } from 'redux-saga';

import * as features from 'features';
import * as UserService from 'services/user';
import { Api } from 'services/api/Api';
import { namespace as NotificationNamespace } from 'services/notification';
import { namespace as ButtonClickProviderNameSpace } from 'services/buttonClickProvider';

export abstract class IModule {
  public getRoutes?(): ReactElement<RouteProps> | Array<ReactElement<RouteProps>>;
  public getReduxEntry?(): IReduxEntry;
}

export interface IAppData {
  modules: IModule[];
  store: Store<IAppReduxState>;
}

export interface IDependencies {
  api: Api;
}

export interface IReduxEntry {
  reducers?: { [key in keyof IAppReduxState]?: Reducer<IAppReduxState[key]> };
  sagas?: Array<(deps: IDependencies) => () => SagaIterator>;
}

export interface IFeatureEntry {
  containers?: Record<string, React.ComponentType<any>>;
  actionCreators?: Record<string, ActionCreator<Action>>;
  selectors?: Record<string, (state: any, ...args: any[]) => any>;
  reduxEntry?: IReduxEntry;
}

export interface IAppReduxState {
  // services
  user: UserService.namespace.IReduxState;
  notification: NotificationNamespace.IReduxState;
  buttonClickProvider: ButtonClickProviderNameSpace.IReduxState;
  // features
  authorization: features.authorization.namespace.IReduxState;
  privateArea: features.privateArea.namespace.IReduxState;
  traceBuild: features.traceBuild.namespace.IReduxState;
  trace: features.trace.namespace.IReduxState;
  reservoirsDefinition: features.reservoirsDefinition.namespace.IReduxState;
  lithologyDefinition: features.lithologyDefinition.namespace.IReduxState;
  сlayContentCalculation: features.сlayContentCalculation.namespace.IReduxState;
  porosityCalculation: features.porosityCalculation.namespace.IReduxState;
  waterSaturationCalculation: features.waterSaturationCalculation.namespace.IReduxState;
  penetrabilityCalculation: features.penetrabilityCalculation.namespace.IReduxState;
  limitValuesCalculation: features.limitValuesCalculation.namespace.IReduxState;
  basicParametersCalculation: features.basicParametersCalculation.namespace.IReduxState;
  fluidTypeDefinition: features.fluidTypeDefinition.namespace.IReduxState;
  perforationIntervalsDefinition: features.perforationIntervalsDefinition.namespace.IReduxState;
  analogueFieldSelection: features.analogueFieldSelection.namespace.IReduxState;
  sedimentationEnvironmentDetermination: features.sedimentationEnvironmentDetermination
    .namespace.IReduxState;
  summarySection: features.summarySection.namespace.IReduxState;
  calculator: features.calculator.namespace.IReduxState;
  adminPanel: features.adminPanel.namespace.IReduxState;
}

export type RootSaga = (deps: IDependencies) => () => SagaIterator;

export type Uid = number;

export type Lang = 'en-US' | 'ru-RU';

export interface IAssets {
  javascript: string[];
  styles: string[];
  favicons: CheerioElement[];
}
