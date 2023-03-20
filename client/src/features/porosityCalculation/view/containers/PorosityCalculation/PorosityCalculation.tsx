import uuid from 'uuid';
import React, { Fragment } from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { Chart } from 'shared/view/components/Chart/Chart';
import { DepthChart } from 'shared/view/components/DepthChart/DepthChart';
import { ScatterPlot } from 'shared/view/components/ScatterPlot/ScatterPlot';
import { InstructionChart } from 'shared/view/components/InstructionChart/InstructionChart';
import { EditableList } from 'shared/view/components/EditableList/EditableList';
import { CurvesBrowser } from 'shared/view/components/CurvesBrowser/CurvesBrowser';
import { IAppReduxState } from 'shared/types/app';
import { ICurves, IChartsVisibilities, ICoreData } from 'shared/types/models';
import { DIAGRAM_DEFAULT_COLORS, MAX_CURVES_AMOUNT_IN_USERFORTAB_SECTION, FIELD_SIZE } from 'shared/constants';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { actionCreators as notificationActions } from 'services/notification';
import { selectors as buttonClickProviderSelectors } from 'services/buttonClickProvider';
import { getTabIndex, cutDataByCore, getInitialCoreData } from 'shared/helpers';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import './PorosityCalculation.scss';


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
  coreData: ICoreData[];
}

interface IState {
  chartsVisibilities: IChartsVisibilities;
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
    coreData: userSelectors.selectCoreData(state),
    isSaveButtonClicked: buttonClickProviderSelectors.selectSaveButtonClickStatus(state),
  };
}

const mapDispatch = {
  saveFeatureState: userActions.saveTabState,
  savePassedPoints: userActions.savePassedPoints,
  saveCoreData: userActions.saveCoreData,
  getAndSaveScreenshot: userActions.getAndSaveScreenshot,
  saveRouteTimePoint: userActions.saveRouteTimePoint,
  setNotification: notificationActions.setNotification,
};

const b = block('porosity-calculation');
const { porosity: intl } = tKeys.features;
const { shared: sharedIntl } = tKeys;

class PorosityCalculationComponent extends React.Component<Props, IState> {
  public state = getInitialState(this.props);
  private intervalMinDepth = getIntervalDepthBoundaries(this.props)[0];
  private intervalMaxDepth = getIntervalDepthBoundaries(this.props)[1];

  public componentDidMount() {
    const { researchData, userToken, coreData, saveCoreData } = this.props;

    if (coreData.length === 0) {
      saveCoreData({ coreData: getInitialCoreData(researchData), token: userToken });
    }
  }

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
    const { researchData: { DEPTH, PORO }, calculatedCurvesForTab, appPosition,
      verticalScale, coreData, t, setNotification } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    const { chartsVisibilities } = this.state;
    const calculatedCurvesForTabKeys = calculatedCurvesForTab[currentFeatureStateIndex]
      ? Object.keys(calculatedCurvesForTab[currentFeatureStateIndex])
      : [];

    return (
      <div className={b()}>
        <div className={b('state-line')} />
        <div className={b('main-block-wrapper')}>
          <div className={b('cells')}>
            <div className={b('cells-inner-wrapper')}>
              {calculatedCurvesForTabKeys
                && calculatedCurvesForTabKeys.map((curveName: string, id: number) => {
                  const currentData = cutDataByCore(DEPTH,
                    calculatedCurvesForTab[currentFeatureStateIndex][curveName], PORO);
                  const minKernValue = Math.min(...currentData.secondCurve
                    .filter(item => item >= 0));
                  const maxKernValue = Math.max(...currentData.secondCurve);
                  const minCurveValue = Math.min(...currentData.firstCurve
                    .filter(item => item >= 0));
                  const maxCurveValue = Math.max(...currentData.firstCurve);
                  const leftConstraint = Math
                    .min(minKernValue, maxKernValue, minCurveValue, maxCurveValue) - 2;
                  const rightConstraint = Math
                    .max(minKernValue, maxKernValue, minCurveValue, maxCurveValue) + 2;
                  return (
                    <Fragment key={`2${id}`}>
                      <div className={b('cell', { visible: chartsVisibilities.userForTab[id] })}>
                        <DepthChart
                          data={currentData.depth}
                          settings={{
                            gridColor: DIAGRAM_DEFAULT_COLORS.DEPTH,
                            header: 'DEPTH',
                            fieldSize: [90, verticalScale * FIELD_SIZE[1]],
                          }}
                        />
                      </div>
                      <div
                        className={b('cell', { visible: chartsVisibilities.userForTab[id] })}
                        key={`3${id}`}
                      >
                        <Chart
                          data={currentData.firstCurve}
                          secondChannelData={coreData
                            .map(item => (item.isVisible ? item.porosity : -9999))}
                          settings={{
                            header: curveName,
                            lineWidth: 2,
                            dotColor: 'red',
                            fieldSize: [320, verticalScale * FIELD_SIZE[1]],
                          }}
                          t={t}
                          constraintLeft={leftConstraint}
                          constraintRight={rightConstraint}
                          isConstraintSet
                          isChartWithoutControls
                          key={uuid()}
                        />
                      </div>
                      <div
                        className={b('cell', { visible: chartsVisibilities.userForTab[id] })}
                        key={`4${id}`}
                      >
                        <ScatterPlot
                          firstDataChannel={currentData.firstCurve}
                          secondDataChannel={coreData}
                          coreType="porosity"
                          curveName={curveName}
                          settings={{
                            lineWidth: 2,
                            dotColor: 'red',
                          }}
                          t={t}
                        />
                      </div>
                    </Fragment>
                  );
                })}
              {PORO && (
                <div
                  className={b('cell', { visible: true })}
                  key={uuid()}
                >
                  <EditableList
                    settings={{
                      header: t(sharedIntl.core),
                      fieldSize: [320, verticalScale * FIELD_SIZE[1]],
                    }}
                    data={coreData}
                    coreType="porosity"
                    t={t}
                    setNotificationHandler={setNotification}
                    onSaveButtonClickHandler={this.onSaveCoreDataItemButtonClick}
                    onCancelAllButtonClickHandler={this.onCancelAllListChagesButtonClick}
                  />
                </div>
              )}
              <div
                className={b('cell', { visible: true })}
                key={uuid()}
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
          </div>
          <CurvesBrowser
            calculatedCurvesForTabData={calculatedCurvesForTab[currentFeatureStateIndex]}
            isRadioSwitch
            chartsVisibilities={chartsVisibilities}
            t={t}
            onCheckboxClickHandler={this.onRadioClick}
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
  private onCancelAllListChagesButtonClick(): void {
    const { researchData, userToken, saveCoreData } = this.props;
    saveCoreData({ coreData: getInitialCoreData(researchData), token: userToken });
  }

  @autobind
  private onSaveCoreDataItemButtonClick(coreItem: ICoreData): void {
    const { coreData, userToken, saveCoreData } = this.props;
    const roundedValue = Math.round(coreItem.depth * 10) / 10;
    const correctedValueByTop = roundedValue < this.intervalMinDepth
      ? this.intervalMinDepth
      : roundedValue;
    const correctedValueByBottom = correctedValueByTop > this.intervalMaxDepth
      ? this.intervalMaxDepth
      : correctedValueByTop;
    const coreDataWithChange = coreData
      .map(coreDataItem => (coreItem.id === coreDataItem.id
        ? { ...coreItem, depth: correctedValueByBottom } : coreDataItem))
      .sort((firstValue, secondValue) => firstValue.depth - secondValue.depth);

    saveCoreData({ coreData: coreDataWithChange, token: userToken });
  }

  @autobind
  private onRadioClick(id: number, type: 'same' | 'user' | 'userForTab'): void {
    this.setState((prevState: IState) => {
      if (type === 'same') {
        const newMainChartsVisibilities = prevState.chartsVisibilities.main.map((_item, index) => {
          if (index === id) {
            return true;
          }
          return false;
        });
        return { chartsVisibilities: {
          ...prevState.chartsVisibilities,
          main: newMainChartsVisibilities,
        } };
      } if (type === 'user') {
        const newUserChartsVisibilities = prevState.chartsVisibilities.user.map((_item, index) => {
          if (index === id) {
            return true;
          }
          return false;
        });
        return { chartsVisibilities: {
          ...prevState.chartsVisibilities,
          user: newUserChartsVisibilities,
        } };
      }
      const newUserForTabChartsVisibilities = prevState.chartsVisibilities.userForTab
        .map((_item, index) => {
          if (index === id) {
            return true;
          }
          return false;
        });
      return { chartsVisibilities: {
        ...prevState.chartsVisibilities,
        userForTab: newUserForTabChartsVisibilities,
      } };
    });
  }
}

const getInitialState = (props: Props): IState => {
  const { appPosition, featuresStates } = props;
  const currentFeatureStateIndex = getTabIndex(appPosition);
  const state = {
    chartsVisibilities: {
      main: [],
      user: [],
      userForTab: Array(MAX_CURVES_AMOUNT_IN_USERFORTAB_SECTION).fill(null)
        .map((_item, id) => id < 1),
    },
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

const getIntervalDepthBoundaries = (props: Props): [number, number] => {
  const { researchData: { DEPTH, PORO } } = props;
  const currentData = cutDataByCore(DEPTH, DEPTH, PORO);
  return [Math.min(...currentData.depth), Math.max(...currentData.depth)];
};

const connectedComponent = connect<IStateProps, ActionProps, {}>(mapState,
  mapDispatch)(PorosityCalculationComponent);
const PorosityCalculation = withTranslation()(connectedComponent);

export { PorosityCalculation };
