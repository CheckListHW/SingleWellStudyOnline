import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { SimpleQuestionsForm } from 'shared/view/components/SimpleQuestionsForm/SimpleQuestionsForm';
import { IAppReduxState } from 'shared/types/app';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { actionCreators as notificationActions } from 'services/notification';
import { getTabIndex } from 'shared/helpers';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import { QUESTIONS, QUESTIONS_TRANSLATION_KEYS } from './constants';
import './AnalogueFieldSelection.scss';


interface IStateProps {
  appPosition: number;
  featuresStates: { [key: string]: { [key: string]: any }};
  userToken: string;
  passedPoints: string[];
}

type ActionProps = typeof mapDispatch;
type Props = IStateProps & ActionProps & ITranslationProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    appPosition: userSelectors.selectUserAppPosition(state),
    featuresStates: userSelectors.selectFeaturesStates(state),
    userToken: userSelectors.selectUserToken(state),
    passedPoints: userSelectors.selectPassedPoints(state),
  };
}

const mapDispatch = {
  saveFeatureState: userActions.saveTabState,
  savePassedPoints: userActions.savePassedPoints,
  getAndSaveScreenshot: userActions.getAndSaveScreenshot,
  saveRouteTimePoint: userActions.saveRouteTimePoint,
  setNotification: notificationActions.setNotification,
};

const b = block('analogue-field-selection');
const { analogueField: intl } = tKeys.features;

type Key = 'whatIsAnalogueField' |
'whatIsMainParametrs' |
'whatIsUsefulInfo' |
'analogueFieldName' |
'explanation' |
'gisScreenshotLink' |
'sourcesLink';

class AnalogueFieldSelectionComponent extends React.PureComponent<Props> {
  private questions = QUESTIONS.map((_item, index) => {
    const key = intl[QUESTIONS_TRANSLATION_KEYS[index] as Key];
    return this.props.t(key);
  });

  public render() {
    const { setNotification, featuresStates, appPosition, t } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);

    return (
      <div className={b()}>
        <div className={b('questions-form')}>
          <SimpleQuestionsForm
            questions={this.questions}
            t={t}
            initialAnswers={featuresStates[currentFeatureStateIndex]
              ? featuresStates[currentFeatureStateIndex].answers
              : undefined}
            onSubmitButtonClickHandler={this.onFormSubmitButtonClick}
            onSetNotificationHandler={setNotification}
          />
        </div>
      </div>
    );
  }

  @autobind
  private onFormSubmitButtonClick(answers: string[]): void {
    const { appPosition, userToken, passedPoints, saveFeatureState, savePassedPoints,
      getAndSaveScreenshot, saveRouteTimePoint } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    getAndSaveScreenshot({ token: userToken, appPosition: String(appPosition) });
    saveRouteTimePoint({
      token: userToken,
      routeTimePoint: { tracePoint: String(appPosition), time: new Date().getTime() },
    });
    saveFeatureState({
      tabState: { [String(currentFeatureStateIndex)]: { answers } },
      token: userToken,
    });

    if (!passedPoints.includes(String(currentFeatureStateIndex))) {
      savePassedPoints({
        passedPoints: [...passedPoints, String(currentFeatureStateIndex)],
        token: userToken,
      });
    }
  }
}

const connectedComponent = connect<IStateProps, ActionProps, {}>(mapState,
  mapDispatch)(AnalogueFieldSelectionComponent);
const AnalogueFieldSelection = withTranslation()(connectedComponent);

export { AnalogueFieldSelection };
