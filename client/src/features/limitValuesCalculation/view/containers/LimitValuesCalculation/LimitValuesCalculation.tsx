import uuid from 'uuid';
import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { Chart } from 'shared/view/components/Chart/Chart';
import { DepthChart } from 'shared/view/components/DepthChart/DepthChart';
import { InstructionChart } from 'shared/view/components/InstructionChart/InstructionChart';
import { IAppReduxState } from 'shared/types/app';
import { ICurves, IChartsPopoversSettings } from 'shared/types/models';
import { DIAGRAM_DEFAULT_COLORS, RESERVOIRS_DEFINITION_ID,
  CLAY_CONTENT_CALCULATION_ID, POROSITY_CALCULATION_ID, WATER_SATURATION_CALCULATION_ID,
  PENETRABILITY_CALCULATION_ID, FIELD_SIZE, MAX_CURVES_AMOUNT_IN_USERFORTAB_SECTION } from 'shared/constants';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { selectors as buttonClickProviderSelectors } from 'services/buttonClickProvider';
import { actionCreators as notificationActions } from 'services/notification';
import { getTabIndex, getFirstCheckedCurveFromStates } from 'shared/helpers';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import { Controls } from './components/Controls/Controls';
import { FIELDS_HEADERS, CURVES_NAMES, DATA_STEP, LINES_COLORS,
  CURVES_NAMES_TRANSLATION_KEYS, FIELDS_HEADERS_TRANSLATION_KEYS } from './constants';
import './LimitValuesCalculation.scss';


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
  chartPopoversSettings: IChartsPopoversSettings;
  sandstoneThicknessCurveData: number[];
  collectorСapacityCurveData: number[];
  oilSaturatedReservoirCapacityCurveData: number[];
  permeableReservoirThicknessCurveData: number[];
  effectiveOilSaturatedReservoirCapacityCurveData: number[];
  boundaryValues: number[];
  thicknesses: number[];
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

const b = block('limit-values-calculation');
const { cutOffs: intl } = tKeys.features;
const { shared: sharedIntl } = tKeys;

type CurvesNamesKey = 'shaliness'|
'grossSand'|
'porosity'|
'netThickness'|
'waterSaturation'|
'grossOilPay'|
'permeability'|
'grossPay'|
'netPay';

type FieldsHeeadersKey = 'shaleCutOff' |
'porosityCutOff' |
'waterSaturationCutOff' |
'permeabilityCutOff';

class LimitValuesCalculationComponent extends React.Component<Props, IState> {
  private curvesNames = CURVES_NAMES.map((_item, index) => {
    const key = CURVES_NAMES_TRANSLATION_KEYS[index];
    return this.props.t(intl[key as CurvesNamesKey]);
  });

  private boundaryNames = FIELDS_HEADERS.map((_item, index) => {
    const key = FIELDS_HEADERS_TRANSLATION_KEYS[index];
    return this.props.t(intl[key as FieldsHeeadersKey]);
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
      chartPopoversSettings,
      sandstoneThicknessCurveData,
      collectorСapacityCurveData,
      oilSaturatedReservoirCapacityCurveData,
      permeableReservoirThicknessCurveData,
      effectiveOilSaturatedReservoirCapacityCurveData,
      boundaryValues,
      thicknesses,
    } = this.state;
    const { researchData, calculatedCurvesForTab, featuresStates, verticalScale, t } = this.props;

    const clayContentCurve = getFirstCheckedCurveFromStates(featuresStates,
      CLAY_CONTENT_CALCULATION_ID, calculatedCurvesForTab);
    const porosityCurve = getFirstCheckedCurveFromStates(featuresStates,
      POROSITY_CALCULATION_ID, calculatedCurvesForTab);
    const waterSaturationCurve = getFirstCheckedCurveFromStates(featuresStates,
      WATER_SATURATION_CALCULATION_ID, calculatedCurvesForTab);
    const penetrabilityCurve = getFirstCheckedCurveFromStates(featuresStates,
      PENETRABILITY_CALCULATION_ID, calculatedCurvesForTab);
    const curves = [
      clayContentCurve,
      sandstoneThicknessCurveData,
      porosityCurve,
      collectorСapacityCurveData,
      waterSaturationCurve,
      oilSaturatedReservoirCapacityCurveData,
      penetrabilityCurve,
      permeableReservoirThicknessCurveData,
      effectiveOilSaturatedReservoirCapacityCurveData,
    ];

    return (
      <div className={b()}>
        <div className={b('main-block-wrapper')}>
          <div className={b('cells')}>
            <div className={b('cell', { visible: true })}>
              <DepthChart
                data={researchData.DEPTH}
                settings={{
                  fieldSize: [60, verticalScale * FIELD_SIZE[1]],
                  gridColor: DIAGRAM_DEFAULT_COLORS.DEPTH,
                  header: 'DEPTH',
                }}
              />
            </div>
            {curves.map((curve: number[], id: number) => {
              const lastCellFieldSize = id === curves.length - 1 ? 64 : 160;
              return (
                <div className={b('cell', { visible: true })} key={`1${id}`}>
                  <Chart
                    data={curve}
                    settings={{
                      header: this.curvesNames[id],
                      fieldSize: [
                        id % 2 !== 0 ? 55 : lastCellFieldSize,
                        verticalScale * FIELD_SIZE[1],
                      ],
                      lineWidth: 2,
                      lineColor: chartPopoversSettings.userForTab[id].chartColor,
                    }}
                    constraintLeft={chartPopoversSettings.userForTab[id].constraint.left}
                    constraintRight={chartPopoversSettings.userForTab[id].constraint.right}
                    isConstraintSet={chartPopoversSettings.userForTab[id].isConstraintSet}
                    isLogarithmic={chartPopoversSettings.userForTab[id].isLogarithmic}
                    isChartWithoutControls={id % 2 !== 0 || id === curves.length - 1}
                    clayLineValue={id % 2 === 0 ? boundaryValues[id / 2] : undefined}
                    t={t}
                    key={uuid()}
                    onChangeColorButtonClickHandler={(color: string) =>
                      this.onChartPopoverColorChangeButtonClick(color, id, 'userForTab')}
                    onCheckboxChangeHandler={(leftConstraintValue: number,
                      rightConstraintValue: number) =>
                      this.onChartPopoverCheckboxChange(leftConstraintValue,
                        rightConstraintValue, id, 'userForTab')}
                    onIsLogarithmicCheckboxChangeHandler={() =>
                      this.onChartPopoverIsLogarithmicCheckboxChange(id, 'userForTab')}
                  />
                </div>
              );
            })}
            <div className={b('cell', { visible: true })} key={uuid()}>
              <InstructionChart
                settings={{
                  fieldSize: [260, verticalScale * FIELD_SIZE[1]],
                  header: t(sharedIntl.instruction),
                }}
                text={t(intl.instructionMessage)}
              />
            </div>
            <div className={b('cell', { visible: true })} key={uuid()}>
              <Controls
                boundaryNames={this.boundaryNames}
                boundaryValues={boundaryValues}
                thicknesses={thicknesses}
                t={t}
                onSubmitButtonClickHandler={this.onOKButtonClick}
              />
            </div>
          </div>
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
  private onOKButtonClick(values: string[]): void {
    const { calculatedCurvesForTab, featuresStates, researchData } = this.props;
    const clayContentCurve = getFirstCheckedCurveFromStates(featuresStates,
      CLAY_CONTENT_CALCULATION_ID, calculatedCurvesForTab);
    const porosityCurve = getFirstCheckedCurveFromStates(featuresStates,
      POROSITY_CALCULATION_ID, calculatedCurvesForTab);
    const waterSaturationCurve = getFirstCheckedCurveFromStates(featuresStates,
      WATER_SATURATION_CALCULATION_ID, calculatedCurvesForTab);
    const penetrabilityCurve = getFirstCheckedCurveFromStates(featuresStates,
      PENETRABILITY_CALCULATION_ID, calculatedCurvesForTab);

    const sandstoneThicknessCurveData = values[0]
      ? clayContentCurve.map(value => (value < Number(values[0]) ? 1 : 0))
      : [];
    const collectorСapacityCurveData = values[1]
      ? porosityCurve.map(value => (value > Number(values[1]) ? 1 : 0))
      : [];
    const oilSaturatedReservoirCapacityCurveData = values[2]
      ? waterSaturationCurve.map(value => (value < Number(values[2]) ? 1 : 0))
      : [];
    const permeableReservoirThicknessCurveData = values[3]
      ? penetrabilityCurve.map(value => (value > Number(values[3]) ? 1 : 0))
      : [];
    const combinedThicknessArray = [sandstoneThicknessCurveData, collectorСapacityCurveData,
      oilSaturatedReservoirCapacityCurveData, permeableReservoirThicknessCurveData];
    const maximumPossibleAmount = combinedThicknessArray
      .reduce((acc, item) => (item.length > 0 ? acc + 1 : acc), 0);
    const effectiveOilSaturatedReservoirCapacityCurveData = researchData.DEPTH
      .map((_item, index) => {
        const significantUnitsArray = [
          sandstoneThicknessCurveData[index] ? sandstoneThicknessCurveData[index] : 0,
          collectorСapacityCurveData[index] ? collectorСapacityCurveData[index] : 0,
          oilSaturatedReservoirCapacityCurveData[index]
            ? oilSaturatedReservoirCapacityCurveData[index] : 0,
          permeableReservoirThicknessCurveData[index]
            ? permeableReservoirThicknessCurveData[index] : 0,
        ];
        const significantUnitsNumber = significantUnitsArray
          .reduce((acc, item) => (item && item > 0 ? acc + 1 : acc), 0);

        if (significantUnitsNumber === maximumPossibleAmount) {
          return 1;
        }
        return 0;
      });

    const sandstoneThickness = Math.round(sandstoneThicknessCurveData
      .reduce((acc, item) => acc + item, 0) * DATA_STEP * 10) / 10;
    const collectorСapacity = Math.round(collectorСapacityCurveData
      .reduce((acc, item) => acc + item, 0) * DATA_STEP * 10) / 10;
    const oilSaturatedReservoirCapacity = Math.round(oilSaturatedReservoirCapacityCurveData
      .reduce((acc, item) => acc + item, 0) * DATA_STEP * 10) / 10;
    const permeableReservoirThickness = Math.round(permeableReservoirThicknessCurveData
      .reduce((acc, item) => acc + item, 0) * DATA_STEP * 10) / 10;
    const combinedThickness = Math.round(effectiveOilSaturatedReservoirCapacityCurveData
      .reduce((acc, item) => acc + item, 0) * DATA_STEP * 10) / 10;
    const reservoirsDevinitionCurve = getFirstCheckedCurveFromStates(featuresStates,
      RESERVOIRS_DEFINITION_ID, calculatedCurvesForTab);
    const totalThickness = reservoirsDevinitionCurve.length !== 0
      ? Math.round(reservoirsDevinitionCurve
        .reduce((acc, item) => (item <= 0 ? acc : acc + item), 0) * DATA_STEP * 10) / 10
      : 0;
    const thicknesses = [sandstoneThickness, collectorСapacity,
      oilSaturatedReservoirCapacity, permeableReservoirThickness,
      combinedThickness, totalThickness];

    this.setState({ sandstoneThicknessCurveData,
      collectorСapacityCurveData,
      oilSaturatedReservoirCapacityCurveData,
      permeableReservoirThicknessCurveData,
      effectiveOilSaturatedReservoirCapacityCurveData,
      thicknesses,
      boundaryValues: values.map(value => Number(value)) });
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
  const { featuresStates, appPosition, calculatedCurvesForTab } = props;
  const currentFeatureStateIndex = getTabIndex(appPosition);
  const reservoirsDevinitionCurve = getFirstCheckedCurveFromStates(featuresStates,
    RESERVOIRS_DEFINITION_ID, calculatedCurvesForTab);
  const totalThickness = reservoirsDevinitionCurve.length !== 0
    ? Math.round(reservoirsDevinitionCurve
      .reduce((acc, item) => (item <= 0 ? acc : acc + item), 0) * DATA_STEP * 10) / 10
    : 0;

  const chartPopoversSettings: IChartsPopoversSettings = {
    main: [],
    user: [],
    userForTab: Array(MAX_CURVES_AMOUNT_IN_USERFORTAB_SECTION).fill(null)
      .map((_item, id) => ({
        chartColor: LINES_COLORS[id],
        isConstraintSet: false,
        isLogarithmic: false,
        constraint: { left: 0, right: 10 },
      })),
  };
  const state = {
    chartPopoversSettings,
    sandstoneThicknessCurveData: [],
    collectorСapacityCurveData: [],
    oilSaturatedReservoirCapacityCurveData: [],
    permeableReservoirThicknessCurveData: [],
    effectiveOilSaturatedReservoirCapacityCurveData: [],
    boundaryValues: [],
    thicknesses: [0, 0, 0, 0, 0, totalThickness],
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
  mapDispatch)(LimitValuesCalculationComponent);
const LimitValuesCalculation = withTranslation()(connectedComponent);

export { LimitValuesCalculation };
