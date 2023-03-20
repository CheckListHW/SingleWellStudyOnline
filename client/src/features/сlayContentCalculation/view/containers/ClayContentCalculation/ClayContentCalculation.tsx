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
import { ClayContentChart } from 'shared/view/components/ClayContentChart/ClayContentChart';
import { CurvesBrowser } from 'shared/view/components/CurvesBrowser/CurvesBrowser';
import { IAppReduxState } from 'shared/types/app';
import { ICurves, IVerticalLevel, IChartsVisibilities,
  IChartsPopoversSettings } from 'shared/types/models';
import { ICursor } from 'shared/types/common';
import { DIAGRAM_DEFAULT_COLORS, FIELD_SIZE } from 'shared/constants';
import { getTabIndex, getInitialSameState } from 'shared/helpers';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { selectors as buttonClickProviderSelectors } from 'services/buttonClickProvider';
import { actionCreators as notificationActions } from 'services/notification';
import { withTranslation, ITranslationProps } from 'services/i18n';

import { VerticalStateLine } from './elements/VerticalStateLine/VerticalStateLine';
import './ClayContentCalculation.scss';


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
  clayContentLevels: IVerticalLevel[];
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

const b = block('clay-content-calculation');

class ClayContentCalculationComponent extends React.Component<Props, IState> {
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
      clayContentLevels,
      isAllChartsVisible,
      chartPopoversSettings,
      chartsVisibilities,
    } = this.state;
    const { researchData, calculatedCurves, calculatedCurvesForTab, appPosition,
      verticalScale, t } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    const calculatedCurvesKeys = Object.keys(calculatedCurves)
      ? Object.keys(calculatedCurves)
      : [];
    const calculatedCurvesForTabKeys = calculatedCurvesForTab[currentFeatureStateIndex]
      ? Object.keys(calculatedCurvesForTab[currentFeatureStateIndex])
      : [];
    const combinedData = {
      main: Object.keys(researchData),
      user: calculatedCurvesKeys,
      userForTab: calculatedCurvesForTabKeys,
    };
    const currentItemIndex = cursor.type
      ? combinedData[cursor.type].findIndex(key => key === cursor.chart)
      : 0;

    return (
      <div className={b()}>
        <div className={b('state-line')}>
          <div className={b('state-line-inner-wrapper')}>
            <VerticalStateLine
              data={{
                ...researchData,
                ...calculatedCurves,
                ...calculatedCurvesForTab[currentFeatureStateIndex],
              }}
              cursor={cursor}
              chartWidth={FIELD_SIZE[0]}
              constraintLeft={cursor.type && chartPopoversSettings[cursor.type][currentItemIndex]
                ? chartPopoversSettings[cursor.type][currentItemIndex].constraint.left : 0}
              constraintRight={cursor.type && chartPopoversSettings[cursor.type][currentItemIndex]
                ? chartPopoversSettings[cursor.type][currentItemIndex].constraint.right : 10}
              isConstraintSet={cursor.type && chartPopoversSettings[cursor.type][currentItemIndex]
                ? chartPopoversSettings[cursor.type][currentItemIndex].isConstraintSet : false}
              isLogarithmic={cursor.type && chartPopoversSettings[cursor.type][currentItemIndex]
                ? chartPopoversSettings[cursor.type][currentItemIndex].isLogarithmic : false}
            />
          </div>
          <div className={b('state-line-button-wrapper')} />
        </div>
        <div className={b('main-block-wrapper')}>
          <div className={b('cells')}>
            <div className={b('cell', { visible: true })}>
              <DepthChart
                data={researchData.DEPTH}
                settings={{
                  gridColor: DIAGRAM_DEFAULT_COLORS.DEPTH,
                  header: 'DEPTH',
                  fieldSize: [90, verticalScale * FIELD_SIZE[1]],
                }}
              />
            </div>
            <div className={b('cells-inner-wrapper')}>
              {Object.keys(researchData).map((curveName: string, id: number) => {
                const chartVerticalLevels = clayContentLevels
                  .filter(level => level.chart === curveName);
                const sandValue = chartVerticalLevels.find(level => level.type === 'sand')?.position[0];
                const clayValue = chartVerticalLevels.find(level => level.type === 'clay')?.position[0];
                if (curveName !== 'DEPTH' && curveName !== 'PORO'
                  && curveName !== 'SW' && curveName !== 'PERM') {
                  const currentCurveData = researchData[curveName];
                  return (
                    <div
                      className={b('cell', { visible: chartsVisibilities.main[id] })}
                      key={`1${id}`}
                      onClick={event => this.onChartClick(event, curveName,
                        currentCurveData || [], chartPopoversSettings.main[id].isConstraintSet,
                        chartPopoversSettings.main[id].constraint.left,
                        chartPopoversSettings.main[id].constraint.right,
                        chartPopoversSettings.main[id].isLogarithmic,
                        chartPopoversSettings.main[id].chartColor)}
                      onMouseOver={event =>
                        this.onMouseOnCellsOver(event, curveName, 'main', chartPopoversSettings.main[id].chartColor)}
                    >
                      <Chart
                        data={currentCurveData || []}
                        settings={{
                          lineColor: chartPopoversSettings.main[id].chartColor,
                          header: curveName,
                          lineWidth: 2,
                          fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                        }}
                        t={t}
                        verticalCursor={cursor.chart === curveName ? cursor : undefined}
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
                        sandLineValue={sandValue}
                        clayLineValue={clayValue}
                      />
                    </div>
                  );
                }
                return false;
              })}

              {calculatedCurvesKeys.length !== 0 && calculatedCurvesKeys
                .map((curveName: string, id: number) => {
                  const chartVerticalLevels = clayContentLevels
                    .filter(level => level.chart === curveName);
                  const sandValue = chartVerticalLevels.find(level => level.type === 'sand')?.position[0];
                  const clayValue = chartVerticalLevels.find(level => level.type === 'clay')?.position[0];
                  if (curveName !== 'DEPTH' && curveName !== 'PORO'
                  && curveName !== 'SW' && curveName !== 'PERM') {
                    const currentCurveData = calculatedCurves[curveName];
                    return (
                      <div
                        className={b('cell', { visible: chartsVisibilities.user[id] })}
                        key={`2${id}`}
                        onClick={event => this.onChartClick(event, curveName as string,
                          currentCurveData, chartPopoversSettings.user[id].isConstraintSet,
                          chartPopoversSettings.user[id].constraint.left,
                          chartPopoversSettings.user[id].constraint.right,
                          chartPopoversSettings.user[id].isLogarithmic,
                          chartPopoversSettings.user[id].chartColor)}
                        onMouseOver={event =>
                          this.onMouseOnCellsOver(event, curveName as string, 'user', chartPopoversSettings.user[id].chartColor)}
                      >
                        <Chart
                          data={calculatedCurves[curveName]}
                          settings={{
                            header: curveName,
                            lineColor: chartPopoversSettings.user[id].chartColor,
                            lineWidth: 2,
                            fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                          }}
                          t={t}
                          verticalCursor={cursor.chart === curveName ? cursor : undefined}
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
                          sandLineValue={sandValue}
                          clayLineValue={clayValue}
                        />
                      </div>
                    );
                  }
                  return false;
                })}

              {calculatedCurvesForTabKeys.length !== 0
                && calculatedCurvesForTabKeys.map((curveName: string, id: number) => {
                  const chartVerticalLevels = clayContentLevels
                    .filter(level => level.chart === curveName);
                  const sandValue = chartVerticalLevels.find(level => level.type === 'sand')?.position[0];
                  const clayValue = chartVerticalLevels.find(level => level.type === 'clay')?.position[0];
                  if (curveName !== 'DEPTH' && curveName !== 'PORO'
                    && curveName !== 'SW' && curveName !== 'PERM') {
                    // eslint-disable-next-line max-len
                    const currentCurveData = calculatedCurvesForTab[currentFeatureStateIndex][curveName];
                    return (
                      <div
                        className={b('cell', { visible: chartsVisibilities.userForTab[id] })}
                        key={`3${id}`}
                        onClick={event => this.onChartClick(event, curveName as string,
                          currentCurveData, chartPopoversSettings.userForTab[id].isConstraintSet,
                          chartPopoversSettings.userForTab[id].constraint.left,
                          chartPopoversSettings.userForTab[id].constraint.right,
                          chartPopoversSettings.userForTab[id].isLogarithmic,
                          chartPopoversSettings.userForTab[id].chartColor)}
                        onMouseOver={event =>
                          this.onMouseOnCellsOver(event, curveName as string, 'userForTab',
                            chartPopoversSettings.userForTab[id].chartColor)}
                      >
                        <Chart
                          data={calculatedCurvesForTab[currentFeatureStateIndex][curveName]}
                          settings={{
                            header: curveName,
                            lineColor: chartPopoversSettings.userForTab[id].chartColor,
                            lineWidth: 2,
                            fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                          }}
                          t={t}
                          verticalCursor={cursor.chart === curveName ? cursor : undefined}
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
                          sandLineValue={sandValue}
                          clayLineValue={clayValue}
                        />
                      </div>
                    );
                  }
                  return false;
                })}
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
                  settings={{
                    lineWidth: 2,
                    fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                  }}
                />
              </div>
            </div>
            <ClayContentChart
              verticalLevels={clayContentLevels}
              settings={{ fieldSize: [240, verticalScale * FIELD_SIZE[1]] }}
              t={t}
              onDeleteAllLevelsButtonClickHandler={this.onDeleteAllClayContentLevelsButtonClick}
              onDeleteLevelButtonClickHandler={this.onDeleteClayContentLevelButtonClick}
            />
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

  private onChartClick(event: any, chart: string, itemChartData: number[],
    isConstraintSet: boolean, constraintLeft: number, constraintRight: number,
    isLogarithmic: boolean, chartColor: string): void {
    const siblingElement = event.target.previousElementSibling;
    if (siblingElement && siblingElement.tagName === 'CANVAS') {
      const cellsXCoordinate = siblingElement.getBoundingClientRect().x;
      const xCoordinate = event.clientX - cellsXCoordinate;
      const preparedItemChartData = itemChartData.map(item => (item === -9999 ? 0 : item));
      const isDiscreteChart = [...new Set(preparedItemChartData)].length === 2;
      const ratio = isDiscreteChart
        ? 0
        : Math.abs((Math.max(...preparedItemChartData) - Math.min(...preparedItemChartData))) / 20;
      const minValue = Math.min(...preparedItemChartData) - ratio;
      const maxValue = Math.max(...preparedItemChartData) + ratio;
      const logarithmicLeftRestriction = isConstraintSet
        ? Math.log(constraintLeft <= 0 ? 1 : constraintLeft)
        : Math.log(minValue <= 0 ? 1 : minValue);
      const notLogarithmicLeftRestriction = isConstraintSet
        ? constraintLeft
        : minValue;
      const restrictionLeft = isLogarithmic
        ? logarithmicLeftRestriction
        : notLogarithmicLeftRestriction;
      const logarithmicRightRestriction = isConstraintSet
        ? Math.log(constraintRight)
        : Math.log(maxValue);
      const notLogarithmicRightRestriction = isConstraintSet
        ? constraintRight
        : maxValue;
      const restrictionRight = isLogarithmic
        ? logarithmicRightRestriction
        : notLogarithmicRightRestriction;
      const stepX = FIELD_SIZE[0] / Math.abs(restrictionRight - restrictionLeft);
      const positionByXAxis = isLogarithmic
        ? Math.round((Math.exp(((xCoordinate + 1) / stepX) + restrictionLeft)) * 100) / 100
        : Math.round((((xCoordinate + 1) / stepX) + restrictionLeft) * 100) / 100;

      this.setState((prevState: IState) => {
        const clayContentLevelsForChat = prevState.clayContentLevels
          .filter(level => level.chart === chart);
        const type = clayContentLevelsForChat.length === 0 ? 'clay' : 'sand' as 'clay' | 'sand';
        const verticalLevel = {
          chart,
          type,
          position: [positionByXAxis, 0] as [number, number],
          chartColor,
        };

        return clayContentLevelsForChat.length > 1
          ? { clayContentLevels: [...prevState.clayContentLevels] }
          : { clayContentLevels: [...prevState.clayContentLevels, verticalLevel] };
      });
    }
  }

  @autobind
  private onDeleteAllClayContentLevelsButtonClick(): void {
    this.setState({ clayContentLevels: [] });
  }

  @autobind
  private onDeleteClayContentLevelButtonClick(index: number): void {
    this.setState((prevState: IState) =>
      ({ clayContentLevels: [
        ...prevState.clayContentLevels.slice(0, index),
        ...prevState.clayContentLevels.slice(index + 1)],
      }));
  }

  private onMouseOnCellsOver(event: any, chart: string, type: 'main' | 'user' | 'userForTab', chartColor: string): void {
    if (event.target.tagName === 'CANVAS') {
      const cellsXCoordinate = event.target.getBoundingClientRect().x;
      const cellsYCoordinate = event.target.getBoundingClientRect().y;
      const xCoordinate = event.clientX - cellsXCoordinate;
      const yCoordinate = event.clientY - cellsYCoordinate;
      this.setState({
        cursor: { position: [xCoordinate, yCoordinate], chart, visible: true, type, chartColor },
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
    clayContentLevels: [],
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
  mapDispatch)(ClayContentCalculationComponent);
const ClayContentCalculation = withTranslation()(connectedComponent);

export { ClayContentCalculation };
