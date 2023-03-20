/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React from 'react';
import block from 'bem-cn';
import uuid from 'uuid';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Button } from 'consta-uikit-fork/Button';
import { IconEdit } from 'consta-uikit-fork/IconEdit';

import { Chart } from 'shared/view/components/Chart/Chart';
import { MultiChart } from 'shared/view/components/MultiChart/MultiChart';
import { DepthChart } from 'shared/view/components/DepthChart/DepthChart';
import { CurvesBrowser } from 'shared/view/components/CurvesBrowser/CurvesBrowser';
import { StateLine } from 'shared/view/components/StateLine/StateLine';
import { InstructionChart } from 'shared/view/components/InstructionChart/InstructionChart';
import { SimpleQuestionsForm } from 'shared/view/components/SimpleQuestionsForm/SimpleQuestionsForm';
import { IAppReduxState } from 'shared/types/app';
import { ICurves, IChartsVisibilities,
  IChartsPopoversSettings } from 'shared/types/models';
import { ICursor } from 'shared/types/common';
import { DIAGRAM_DEFAULT_COLORS, FIELD_SIZE } from 'shared/constants';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { selectors as buttonClickProviderSelectors } from 'services/buttonClickProvider';
import { actionCreators as notificationActions } from 'services/notification';
import { getTabIndex, getInitialSameState } from 'shared/helpers';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import './ReservoirsDefinition.scss';


interface IStateProps {
  researchData: ICurves;
  calculatedCurves: ICurves;
  calculatedCurvesForTab: { [key: string]: ICurves };
  appPosition: number;
  featuresStates: { [key: string]: { [key: string]: any }};
  userToken: string;
  passedPoints: string[];
  isSaveButtonClicked: boolean;
  verticalScale: number;
}

interface IState {
  cursor: ICursor;
  chartsVisibilities: IChartsVisibilities;
  isAllChartsVisible: boolean;
  chartPopoversSettings: IChartsPopoversSettings;
  isQuestionFormOpen: boolean;
  answers: string[];
}

type ActionProps = typeof mapDispatch;
type Props = IStateProps & ActionProps & ITranslationProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    researchData: userSelectors.selectResearchData(state),
    calculatedCurves: userSelectors.selectCalculatedCurves(state),
    calculatedCurvesForTab: userSelectors.selectCalculatedCurvesForTab(state),
    appPosition: userSelectors.selectUserAppPosition(state),
    featuresStates: userSelectors.selectFeaturesStates(state),
    userToken: userSelectors.selectUserToken(state),
    passedPoints: userSelectors.selectPassedPoints(state),
    verticalScale: userSelectors.selectVerticalScale(state),
    isSaveButtonClicked: buttonClickProviderSelectors.selectSaveButtonClickStatus(state),
  };
}

const mapDispatch = {
  saveFeatureState: userActions.saveTabState,
  savePassedPoints: userActions.savePassedPoints,
  getAndSaveScreenshot: userActions.getAndSaveScreenshot,
  saveRouteTimePoint: userActions.saveRouteTimePoint,
  setNotification: notificationActions.setNotification,
};

const b = block('reservoirs-definition');
const { reservoirsDefinition: intl } = tKeys.features;
const { shared: sharedIntl } = tKeys;

class ReservoirsDefinitionComponent extends React.Component<Props, IState> {
  public state = getInitialState(this.props);

  public async componentDidUpdate(prevProps: Props) {
    const { isSaveButtonClicked, userToken, appPosition, getAndSaveScreenshot,
      saveRouteTimePoint } = this.props;

    if (isSaveButtonClicked && prevProps.isSaveButtonClicked !== isSaveButtonClicked) {
      this.onSaveTabDataButtonClick();
      getAndSaveScreenshot({ token: userToken, appPosition: String(appPosition) });
      saveRouteTimePoint({
        token: userToken,
        routeTimePoint: { tracePoint: String(appPosition), time: new Date().getTime() },
      });
    }
  }

  public render() {
    const {
      cursor,
      isAllChartsVisible,
      chartPopoversSettings,
      isQuestionFormOpen,
      chartsVisibilities,
      answers,
    } = this.state;
    const { researchData, calculatedCurves, calculatedCurvesForTab, appPosition, verticalScale,
      setNotification, t } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    const dataLength = researchData.DEPTH.length;
    const calculatedCurvesKeys = Object.keys(calculatedCurves);
    const calculatedCurvesForTabKeys = calculatedCurvesForTab[currentFeatureStateIndex]
      ? Object.keys(calculatedCurvesForTab[currentFeatureStateIndex])
      : [];

    return (
      <div className={b()}>
        {isQuestionFormOpen && (
          <div className={b('questions-form')}>
            <SimpleQuestionsForm
              questions={[t(intl.firstQuestion), t(intl.secondQuestion)]}
              initialAnswers={answers}
              t={t}
              onSubmitButtonClickHandler={this.onFormSubmitButtonClick}
              onSetNotificationHandler={setNotification}
            />
          </div>
        )}
        {!isQuestionFormOpen && (
          <>
            <div className={b('state-line')}>
              <div className={b('state-line-inner-wrapper')}>
                <StateLine
                  data={researchData}
                  calculatedCurvesData={calculatedCurves}
                  calculatedCurvesDataForTab={calculatedCurvesForTab[currentFeatureStateIndex]}
                  chartsVisibilities={chartsVisibilities}
                  chartSettings={chartPopoversSettings}
                  cursorPositionByY={cursor.position[1]}
                  dataLength={dataLength}
                  fieldSize={[90, verticalScale * FIELD_SIZE[1]]}
                />
              </div>
              <div className={b('state-line-button-wrapper')}>
                <Button
                  label={t(sharedIntl.editQuestionsForm) as string}
                  size="s"
                  iconLeft={IconEdit}
                  type="button"
                  onClick={this.onQuestionFormEditButtonClick}
                />
              </div>
            </div>
            <div className={b('main-block-wrapper')}>
              <div
                className={b('cells')}
                onMouseOver={this.onMouseOnCellsOver}
              >
                <div className={b('cell', { visible: true })}>
                  <DepthChart
                    data={researchData.DEPTH}
                    settings={{
                      gridColor: DIAGRAM_DEFAULT_COLORS.DEPTH,
                      header: 'DEPTH',
                      fieldSize: [90, verticalScale * FIELD_SIZE[1]],
                    }}
                    cursor={cursor}
                  />
                </div>
                <div className={b('cells-inner-wrapper')}>
                  {Object.keys(researchData).map((curveName: string, id: number) => {
                    if (curveName !== 'DEPTH' && curveName !== 'PORO' && curveName !== 'SW'
                      && curveName !== 'PERM') {
                      const currentCurveData = researchData[curveName];
                      return (
                        <div className={b('cell', { visible: chartsVisibilities.main[id] })} key={`1${id}`}>
                          <Chart
                            data={currentCurveData || []}
                            settings={{
                              lineColor: chartPopoversSettings.main[id].chartColor,
                              header: curveName,
                              lineWidth: 2,
                              fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                            }}
                            cursor={cursor}
                            constraintLeft={chartPopoversSettings.main[id].constraint.left}
                            constraintRight={chartPopoversSettings.main[id].constraint.right}
                            isConstraintSet={chartPopoversSettings.main[id].isConstraintSet}
                            isLogarithmic={chartPopoversSettings.main[id].isLogarithmic}
                            t={t}
                            onChangeColorButtonClickHandler={(color: string) =>
                              this.onChartPopoverColorChangeButtonClick(color, id, 'main')}
                            onCheckboxChangeHandler={(leftConstraintValue: number,
                              rightConstraintValue: number) =>
                              this.onChartPopoverCheckboxChange(leftConstraintValue,
                                rightConstraintValue, id, 'main')}
                            onIsLogarithmicCheckboxChangeHandler={() =>
                              this.onChartPopoverIsLogarithmicCheckboxChange(id, 'main')}
                            key={uuid()}
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                  {calculatedCurvesKeys && calculatedCurvesKeys
                    .map((curveName: string, id: number) => (
                      <div className={b('cell', { visible: chartsVisibilities.user[id] })} key={`2${id}`}>
                        <Chart
                          data={calculatedCurves[curveName]}
                          settings={{
                            lineColor: chartPopoversSettings.user[id].chartColor,
                            header: curveName,
                            lineWidth: 2,
                            fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                          }}
                          cursor={cursor}
                          t={t}
                          constraintLeft={chartPopoversSettings.user[id].constraint.left}
                          constraintRight={chartPopoversSettings.user[id].constraint.right}
                          isConstraintSet={chartPopoversSettings.user[id].isConstraintSet}
                          isLogarithmic={chartPopoversSettings.user[id].isLogarithmic}
                          onChangeColorButtonClickHandler={(color: string) =>
                            this.onChartPopoverColorChangeButtonClick(color, id, 'user')}
                          onCheckboxChangeHandler={(leftConstraintValue: number,
                            rightConstraintValue: number) =>
                            this.onChartPopoverCheckboxChange(leftConstraintValue,
                              rightConstraintValue, id, 'user')}
                          onIsLogarithmicCheckboxChangeHandler={() =>
                            this.onChartPopoverIsLogarithmicCheckboxChange(id, 'user')}
                          key={uuid()}
                        />
                      </div>
                    ))}
                  {calculatedCurvesForTabKeys
                    && calculatedCurvesForTabKeys.map((curveName: string, id: number) => (
                      <div className={b('cell', { visible: chartsVisibilities.userForTab[id] })} key={`3${id}`}>
                        <Chart
                          data={calculatedCurvesForTab[currentFeatureStateIndex][curveName]}
                          settings={{
                            lineColor: chartPopoversSettings.userForTab[id].chartColor,
                            header: curveName,
                            lineWidth: 2,
                            fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                          }}
                          cursor={cursor}
                          t={t}
                          constraintLeft={chartPopoversSettings.userForTab[id].constraint.left}
                          constraintRight={chartPopoversSettings.userForTab[id].constraint.right}
                          isConstraintSet={chartPopoversSettings.userForTab[id].isConstraintSet}
                          isLogarithmic={chartPopoversSettings.userForTab[id].isLogarithmic}
                          onChangeColorButtonClickHandler={(color: string) =>
                            this.onChartPopoverColorChangeButtonClick(color, id, 'userForTab')}
                          onCheckboxChangeHandler={(leftConstraintValue: number,
                            rightConstraintValue: number) =>
                            this.onChartPopoverCheckboxChange(leftConstraintValue,
                              rightConstraintValue, id, 'userForTab')}
                          onIsLogarithmicCheckboxChangeHandler={() =>
                            this.onChartPopoverIsLogarithmicCheckboxChange(id, 'userForTab')}
                          key={uuid()}
                        />
                      </div>
                    ))}
                  <div
                    className={b('cell', { visible: true })}
                    key="40"
                  >
                    <MultiChart
                      researchData={researchData}
                      calculatedCurves={calculatedCurves}
                      calculatedCurvesForTab={calculatedCurvesForTab[currentFeatureStateIndex]}
                      chartsSettings={chartPopoversSettings}
                      chartsVisibilities={chartsVisibilities}
                      cursor={cursor}
                      settings={{
                        lineWidth: 2,
                        fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                      }}
                    />
                  </div>
                </div>
                <div
                  className={b('cell', { visible: true })}
                  key="50"
                >
                  <InstructionChart
                    settings={{
                      header: t(sharedIntl.instruction),
                      fieldSize: [190, verticalScale * FIELD_SIZE[1]],
                    }}
                    text={t(intl.instructionMessage)}
                  />
                </div>
              </div>
              <CurvesBrowser
                researchData={researchData}
                calculatedCurvesData={calculatedCurves}
                calculatedCurvesForTabData={calculatedCurvesForTab[currentFeatureStateIndex]}
                isAllChartsVisible={isAllChartsVisible}
                chartsVisibilities={chartsVisibilities}
                t={t}
                onCheckboxClickHandler={this.onCheckboxClick}
                onShowAllChartsCheckboxClick={this.onShowAllChartsCheckboxClick}
              />
            </div>
          </>
        )}
      </div>
    );
  }

  @autobind
  private onSaveTabDataButtonClick(): void {
    const { saveFeatureState, savePassedPoints, appPosition, userToken, passedPoints } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    saveFeatureState({
      tabState: { [String(currentFeatureStateIndex)]: this.state },
      token: userToken,
    });

    if (!passedPoints.includes(String(currentFeatureStateIndex))) {
      savePassedPoints({
        passedPoints: [...passedPoints, String(currentFeatureStateIndex)],
        token: userToken,
      });
    }
  }

  @autobind
  private onQuestionFormEditButtonClick(): void {
    this.setState({ isQuestionFormOpen: true });
  }

  @autobind
  private onFormSubmitButtonClick(answers: string[]): void {
    const { userToken, appPosition, getAndSaveScreenshot } = this.props;
    getAndSaveScreenshot({ token: userToken, appPosition: `${appPosition}-form` });
    this.setState({ isQuestionFormOpen: false, answers });
  }

  @autobind
  private onMouseOnCellsOver(event: any): void {
    if (event.target.tagName === 'CANVAS') {
      const cellsXCoordinate = event.target.getBoundingClientRect().x;
      const cellsYCoordinate = event.target.getBoundingClientRect().y;
      const xCoordinate = event.clientX - cellsXCoordinate;
      const yCoordinate = event.clientY - cellsYCoordinate;
      this.setState({
        cursor: { position: [xCoordinate, yCoordinate], visible: true },
      });
    }
  }

  @autobind
  private onCheckboxClick(id: number, type: 'same' | 'user' | 'userForTab'): void {
    this.setState((prevState: IState) => {
      if (type === 'same') {
        const newMainChartsVisibilities = prevState.chartsVisibilities.main.map((item, index) => {
          if (index === id) {
            return !prevState.chartsVisibilities.main[index];
          }
          return item;
        });
        return { chartsVisibilities: {
          ...prevState.chartsVisibilities,
          main: newMainChartsVisibilities,
        } };
      } if (type === 'user') {
        const newUserChartsVisibilities = prevState.chartsVisibilities.user.map((item, index) => {
          if (index === id) {
            return !prevState.chartsVisibilities.user[index];
          }
          return item;
        });
        return { chartsVisibilities: {
          ...prevState.chartsVisibilities,
          user: newUserChartsVisibilities,
        } };
      }
      const newUserForTabChartsVisibilities = prevState.chartsVisibilities.userForTab
        .map((item, index) => {
          if (index === id) {
            return !prevState.chartsVisibilities.userForTab[index];
          }
          return item;
        });
      return { chartsVisibilities: {
        ...prevState.chartsVisibilities,
        userForTab: newUserForTabChartsVisibilities,
      } };
    });
  }

  @autobind
  private onShowAllChartsCheckboxClick(): void {
    this.setState((prevState: IState) => {
      const newMainChartsVisibilities = prevState.chartsVisibilities.main.map((item, index) => {
        if (index !== 0) {
          return !prevState.isAllChartsVisible;
        }
        return item;
      });
      return { chartsVisibilities: {
        ...prevState.chartsVisibilities,
        main: newMainChartsVisibilities,
      },
      isAllChartsVisible: !prevState.isAllChartsVisible,
      };
    });
  }

  private onChartPopoverCheckboxChange(leftConstraintValue: number,
    rightConstraintValue: number, index: number, type: 'main' | 'user' | 'userForTab'): void {
    this.setState((prevState: IState) => ({
      chartPopoversSettings: {
        ...prevState.chartPopoversSettings,
        [type]: prevState.chartPopoversSettings[type]
          .map((item, id) => (id === index
            ? { ...item,
              isConstraintSet: !prevState.chartPopoversSettings[type][id].isConstraintSet,
              constraint: { left: leftConstraintValue, right: rightConstraintValue } }
            : item)),
      },
    }));
  }

  private onChartPopoverIsLogarithmicCheckboxChange(index: number, type: 'main' | 'user' | 'userForTab'): void {
    this.setState((prevState: IState) => ({
      chartPopoversSettings: {
        ...prevState.chartPopoversSettings,
        [type]: prevState.chartPopoversSettings[type]
          .map((item, id) => (id === index
            ? { ...item, isLogarithmic: !prevState.chartPopoversSettings[type][id].isLogarithmic }
            : item)),
      },
    }));
  }

  private onChartPopoverColorChangeButtonClick(color: string, index: number, type: 'main' | 'user' | 'userForTab'): void {
    this.setState((prevState: IState) => ({
      chartPopoversSettings: {
        ...prevState.chartPopoversSettings,
        [type]: prevState.chartPopoversSettings[type]
          .map((item, id) => (id === index
            ? { ...item, chartColor: color }
            : item)),
      },
    }));
  }
}

const getInitialState = (props: Props): IState => {
  const { researchData, appPosition, featuresStates } = props;
  const currentFeatureStateIndex = getTabIndex(appPosition);
  const state = {
    ...getInitialSameState(researchData),
    isAllChartsVisible: false,
    isQuestionFormOpen: true,
    answers: [],
  };
  const savedState = featuresStates[currentFeatureStateIndex]
  && Object.keys(featuresStates[currentFeatureStateIndex]).length !== 0
    ? featuresStates[currentFeatureStateIndex] as IState
    : null;

  if (savedState) {
    return savedState;
  }

  return state;
};

const connectedComponent = connect<IStateProps, ActionProps, {}>(mapState,
  mapDispatch)(ReservoirsDefinitionComponent);
const ReservoirsDefinition = withTranslation()(connectedComponent);

export { ReservoirsDefinition };
