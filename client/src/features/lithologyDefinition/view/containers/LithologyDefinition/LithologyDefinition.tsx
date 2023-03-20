/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import uuid from 'uuid';
import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { Chart } from 'shared/view/components/Chart/Chart';
import { MultiChart } from 'shared/view/components/MultiChart/MultiChart';
import { DepthChart } from 'shared/view/components/DepthChart/DepthChart';
import { ColorContentChart } from 'shared/view/components/ColorContentChart/ColorContentChart';
import { CurvesBrowser } from 'shared/view/components/CurvesBrowser/CurvesBrowser';
import { StateLine } from 'shared/view/components/StateLine/StateLine';
import { IAppReduxState } from 'shared/types/app';
import { ICurves, ILevel, INamedInterval, IChartsVisibilities,
  IChartsPopoversSettings } from 'shared/types/models';
import { ICursor } from 'shared/types/common';
import { DIAGRAM_DEFAULT_COLORS, FIELD_SIZE, LITOLOGY_SELECT,
  LITHOLOGY_TRANSLATION_KEYS } from 'shared/constants';
import { getDepth, getTabIndex, getInitialSameState } from 'shared/helpers';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { selectors as buttonClickProviderSelectors } from 'services/buttonClickProvider';
import { actionCreators as notificationActions } from 'services/notification';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import './LithologyDefinition.scss';


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
  lithologyLevels: ILevel[];
  lithologyIntervals: INamedInterval[];
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

const b = block('lithology-definition');
const { lithologySelectList: intl } = tKeys;

type Key = 'shale' | 'sand' | 'coal' | 'limestone' | 'shalySand';

class LithologyDefinitionComponent extends React.Component<Props, IState> {
  private lithologySelectList = LITOLOGY_SELECT.map(item => {
    const key = intl[LITHOLOGY_TRANSLATION_KEYS[Number(item.value) - 1] as Key];
    return {
      value: item.value,
      label: this.props.t(key),
      color: item.color,
      imageUrl: item.imageUrl,
    };
  });

  public state = getInitialState(this.props);

  public componentDidUpdate(prevProps: Props) {
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
      lithologyLevels,
      isAllChartsVisible,
      lithologyIntervals,
      chartPopoversSettings,
      chartsVisibilities,
    } = this.state;
    const { researchData, calculatedCurves, calculatedCurvesForTab,
      appPosition, verticalScale, t } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    const dataLength = researchData.DEPTH.length;
    const calculatedCurvesKeys = Object.keys(calculatedCurves);
    const calculatedCurvesForTabKeys = calculatedCurvesForTab[currentFeatureStateIndex]
      ? Object.keys(calculatedCurvesForTab[currentFeatureStateIndex])
      : [];

    return (
      <div className={b()}>
        <div className={b('state-line')}>
          <div className={b('state-line-inner-wrapper')}>
            <StateLine
              data={researchData}
              calculatedCurvesData={calculatedCurves}
              calculatedCurvesDataForTab={calculatedCurvesForTab[currentFeatureStateIndex]}
              chartsVisibilities={chartsVisibilities}
              cursorPositionByY={cursor.position[1]}
              dataLength={dataLength}
              chartSettings={chartPopoversSettings}
              fieldSize={[90, verticalScale * FIELD_SIZE[1]]}
            />
          </div>
          <div className={b('state-line-button-wrapper')} />
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
                levels={lithologyLevels}
                onDeleteLevelButtonClickHandler={this.onDeleteLithologyLevelButtonClick}
              />
            </div>
            <div className={b('cells-inner-wrapper')}>
              {Object.keys(researchData).map((curveName: string, id: number) => {
                if (curveName !== 'DEPTH' && curveName !== 'PORO' && curveName !== 'SW'
                && curveName !== 'PERM') {
                  const currentCurveData = researchData[curveName];
                  return (
                    <div
                      className={b('cell', { visible: chartsVisibilities.main[id] })}
                      key={`1${id}`}
                      onClick={event => this.onChartClick(event)}
                    >
                      <Chart
                        data={currentCurveData || []}
                        settings={{
                          lineColor: chartPopoversSettings.main[id].chartColor,
                          header: curveName,
                          lineWidth: 2,
                          fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                        }}
                        levels={lithologyLevels}
                        cursor={cursor}
                        t={t}
                        constraintLeft={chartPopoversSettings.main[id].constraint.left}
                        constraintRight={chartPopoversSettings.main[id].constraint.right}
                        isConstraintSet={chartPopoversSettings.main[id].isConstraintSet}
                        isLogarithmic={chartPopoversSettings.main[id].isLogarithmic}
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
              {calculatedCurvesKeys && calculatedCurvesKeys.map((curveName: string, id: number) => (
                <div className={b('cell', { visible: chartsVisibilities.user[id] })} key={`2${id}`}>
                  <Chart
                    data={calculatedCurves[curveName]}
                    settings={{
                      header: curveName,
                      lineColor: chartPopoversSettings.user[id].chartColor,
                      lineWidth: 2,
                      fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                    }}
                    levels={lithologyLevels}
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
                        header: curveName,
                        lineColor: chartPopoversSettings.userForTab[id].chartColor,
                        lineWidth: 2,
                        fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                      }}
                      levels={lithologyLevels}
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
                  levels={lithologyLevels}
                  settings={{
                    lineWidth: 2,
                    fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                  }}
                />
              </div>
            </div>
            <div className={b('cell', { visible: true })} key={uuid()}>
              <ColorContentChart
                dataLength={dataLength}
                selectOptions={this.lithologySelectList}
                levels={lithologyLevels}
                intervals={lithologyIntervals}
                settings={{
                  fieldSize: [240, verticalScale * FIELD_SIZE[1]],
                }}
                t={t}
                onAddIntervalsButtonClickHandler={this.onAddLithologyIntervalsButtonClick}
                onSelectChangeHandler={this.onLithologySelectChange}
                onDeleteAllIntervalsButtonClickHandler={
                  this.onDeleteAllLithologyIntervalsButtonClick
                }
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
  private onAddLithologyIntervalsButtonClick(): void {
    const { researchData } = this.props;
    const { lithologyLevels } = this.state;

    const stepY = FIELD_SIZE[1] / researchData.DEPTH.length;
    const levelsPositions = lithologyLevels.map((item: ILevel) => item.position[1] * stepY);
    const sortedLevelsPositions = [0, ...levelsPositions, FIELD_SIZE[1]]
      .sort((firstNumber, secondNumber) => firstNumber - secondNumber);
    const lithologyIntervals = sortedLevelsPositions.reduce((acc, item, index) => {
      if (index < (sortedLevelsPositions.length - 1)) {
        return [...acc, {
          beginCoordinate: item,
          endCoordinate: sortedLevelsPositions[index + 1],
          name: '',
          id: index,
        }];
      }
      return acc;
    }, []);
    this.setState({ lithologyIntervals });
  }

  @autobind
  private onDeleteAllLithologyIntervalsButtonClick(): void {
    this.setState({ lithologyIntervals: [], lithologyLevels: [] });
  }

  @autobind
  private onLithologySelectChange(v: any, currentIntervalId: number): void {
    const { lithologyIntervals } = this.state;
    const newIntervals = lithologyIntervals.map((interval: INamedInterval) => {
      if (interval.id === currentIntervalId) {
        return { ...interval, name: v.value };
      }
      return interval;
    });
    this.setState({ lithologyIntervals: newIntervals });
  }

  @autobind
  private onDeleteLithologyLevelButtonClick(id: string): void {
    this.setState((prevState: IState) => {
      const { lithologyLevels } = prevState;
      const newLevels = lithologyLevels.reduce((acc, level) => {
        if (level.id !== id) {
          return [...acc, level];
        }
        return acc;
      }, []);
      return { lithologyLevels: newLevels };
    });
  }

  private onChartClick(event: any): void {
    const { researchData, calculatedCurves, calculatedCurvesForTab,
      appPosition, verticalScale } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    const combinedData: ICurves = {
      ...researchData,
      ...calculatedCurves,
      ...calculatedCurvesForTab[currentFeatureStateIndex],
    };
    const siblingElement = event.target.previousElementSibling;

    if (siblingElement && siblingElement.tagName === 'CANVAS') {
      const cellsXCoordinate = siblingElement.getBoundingClientRect().x;
      const cellsYCoordinate = siblingElement.getBoundingClientRect().y;
      const xCoordinate = event.clientX - cellsXCoordinate;
      const yCoordinate = event.clientY - cellsYCoordinate;
      const index = getDepth([xCoordinate, yCoordinate], researchData.DEPTH,
        [FIELD_SIZE[0], FIELD_SIZE[1] * verticalScale]);
      const level = Object.keys(combinedData).reduce((acc, key: string) => {
        const currentData = combinedData[key];
        if (currentData) {
          const levelData = {
            [key]: currentData[index],
          };
          return { ...acc, data: { ...acc.data, ...levelData }, id: uuid() };
        }
        return acc;
      }, { data: { DEPTH: 0 }, name: '', color: '#000000', position: [0, index] as [number, number], id: '' });
      this.setState((prevState: IState) => {
        const sortedLevels = [...prevState.lithologyLevels, level]
          .sort((firstLevel, secondLevel) => firstLevel.position[1] - secondLevel.position[1]);
        return {
          lithologyLevels: sortedLevels,
        };
      });
    }
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
    lithologyLevels: [],
    lithologyIntervals: [],
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
  mapDispatch)(LithologyDefinitionComponent);
const LithologyDefinition = withTranslation()(connectedComponent);

export { LithologyDefinition };
