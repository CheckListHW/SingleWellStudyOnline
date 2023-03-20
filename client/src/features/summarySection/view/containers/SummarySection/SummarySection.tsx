import uuid from 'uuid';
import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Button } from 'consta-uikit-fork/Button';
import { Badge } from 'consta-uikit-fork/Badge';

import { Chart } from 'shared/view/components/Chart/Chart';
import { DepthChart } from 'shared/view/components/DepthChart/DepthChart';
import { ColorContentChart } from 'shared/view/components/ColorContentChart/ColorContentChart';
import { CurvesBrowser } from 'shared/view/components/CurvesBrowser/CurvesBrowser';
import { SimpleQuestionsForm } from 'shared/view/components/SimpleQuestionsForm/SimpleQuestionsForm';
import { IAppReduxState } from 'shared/types/app';
import { ICurves, IChartsVisibilities, IChartsPopoversSettings } from 'shared/types/models';
import { DIAGRAM_DEFAULT_COLORS, TRACE_ITEMS, CLAY_CONTENT_CALCULATION_ID,
  POROSITY_CALCULATION_ID, WATER_SATURATION_CALCULATION_ID,
  PENETRABILITY_CALCULATION_ID, LITHOLOGY_DEFINITION_ID, LITOLOGY_SELECT,
  LITHOLOGY_TRANSLATION_KEYS, FLUID_TYPE_SELECT, FLUID_TYPE_SELECT_TRANSLATION_KEYS,
  FLUID_TYPE_DEFINITION_ID, PERFORATION_SELECT, PERFORATION_SELECT_TRANSLATION_KEYS,
  FIELD_SIZE, PERFORATION_INTERVALS_DEFINITION_ID, LIMIT_VALUES_CALCULATION_ID } from 'shared/constants';
import { getTabIndex, getFirstCheckedCurveFromStates, getInitialSameState } from 'shared/helpers';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { selectors as buttonClickProviderSelectors } from 'services/buttonClickProvider';
import { actionCreators as notificationActions } from 'services/notification';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import { QUESTIONS, QUESTIONS_TRANSLATION_KEYS } from './constants';
import './SummarySection.scss';


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
  chartsVisibilities: IChartsVisibilities;
  isAllChartsVisible: boolean;
  chartPopoversSettings: IChartsPopoversSettings;
  isModalOpen: boolean;
  answers: string[];
  isTabletVisible: boolean;
  isRecommendationsVisible: boolean;
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

const b = block('summary-section');
const { summarySection: intl, fluidsType: fluidIntl,
  perforationIntervals: perfIntl } = tKeys.features;
const { lithologySelectList: lithologyIntl, notification: notificationIntl } = tKeys;

type Key = 'recommendations' |
'stoiip' |
'recoveryFactor' |
'oilPrice' |
'profit';
type LithologyKey = 'shale' | 'sand' | 'coal' | 'limestone' | 'shalySand';
type FluidTypeSelectListKey = 'oil' | 'water' | 'oilWithWater' | 'waterWithOil';

class SummarySectionComponent extends React.PureComponent<Props, IState> {
  private questions = QUESTIONS.map((_item, index) => {
    const key = intl[QUESTIONS_TRANSLATION_KEYS[index] as Key];
    return this.props.t(key);
  });

  private lithologySelectList = LITOLOGY_SELECT.map(item => {
    const key = lithologyIntl[LITHOLOGY_TRANSLATION_KEYS[Number(item.value) - 1] as LithologyKey];
    return {
      value: item.value,
      label: this.props.t(key),
      color: item.color,
      imageUrl: item.imageUrl,
    };
  });

  private fluidTypeSelectList = FLUID_TYPE_SELECT.map(item => {
    const key = fluidIntl[FLUID_TYPE_SELECT_TRANSLATION_KEYS[Number(item
      .value) - 1] as FluidTypeSelectListKey];
    return {
      value: item.value,
      label: this.props.t(key),
      color: item.color,
      imageUrl: item.imageUrl,
    };
  });

  private perforationSelectList = PERFORATION_SELECT.map(item => {
    const key = perfIntl[PERFORATION_SELECT_TRANSLATION_KEYS[Number(item.value) - 1] as 'perforationInterval'];
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
      chartsVisibilities,
      isAllChartsVisible,
      chartPopoversSettings,
      answers,
      isTabletVisible,
      isRecommendationsVisible,
    } = this.state;
    const { researchData, calculatedCurves, calculatedCurvesForTab,
      featuresStates, passedPoints, setNotification, verticalScale, t } = this.props;
    const calculatedCurvesKeys = Object.keys(calculatedCurves);
    const dataLength = researchData.DEPTH.length;

    const reservoirsDefinitionCurve = featuresStates[LIMIT_VALUES_CALCULATION_ID]
      ? featuresStates[LIMIT_VALUES_CALCULATION_ID].effectiveOilSaturatedReservoirCapacityCurveData
      : [];
    const clayContentCurve = getFirstCheckedCurveFromStates(featuresStates,
      CLAY_CONTENT_CALCULATION_ID, calculatedCurvesForTab);
    const porosityCurve = getFirstCheckedCurveFromStates(featuresStates,
      POROSITY_CALCULATION_ID, calculatedCurvesForTab);
    const waterSaturationCurve = getFirstCheckedCurveFromStates(featuresStates,
      WATER_SATURATION_CALCULATION_ID, calculatedCurvesForTab);
    const penetrabilityCurve = getFirstCheckedCurveFromStates(featuresStates,
      PENETRABILITY_CALCULATION_ID, calculatedCurvesForTab);
    const curves: ICurves = {
      POROSITY: porosityCurve,
      PERMABIL: penetrabilityCurve,
      WATERSAT: waterSaturationCurve,
      RESERVOIRS: reservoirsDefinitionCurve,
      CLAYCONT: clayContentCurve,
    };
    const calculatedCurvesForTabKeys = Object.keys(curves);
    const lithologyIntervals = featuresStates && featuresStates[LITHOLOGY_DEFINITION_ID]
      ? featuresStates[LITHOLOGY_DEFINITION_ID].lithologyIntervals
      : [];
    const fluidIntervals = featuresStates && featuresStates[FLUID_TYPE_DEFINITION_ID]
      ? featuresStates[FLUID_TYPE_DEFINITION_ID].fluidIntervals
      : [];
    const perforationIntervals = featuresStates
    && featuresStates[PERFORATION_INTERVALS_DEFINITION_ID]
      ? featuresStates[PERFORATION_INTERVALS_DEFINITION_ID].perforationIntervals
      : [];

    return (
      <div className={b()}>
        {TRACE_ITEMS.length - 1 !== passedPoints.length
        && passedPoints.length !== TRACE_ITEMS.length && (
          <div className={b('warning-text')}>
            {t(intl.warning)}
          </div>
        )}
        {(TRACE_ITEMS.length - 1 === passedPoints.length
        || passedPoints.length === TRACE_ITEMS.length) && (
          <div className={b('main-block-wrapper')}>
            <div className={b('final-tablet-line')}>
              <div className={b('final-tablet-line-wrapper')}>
                <Badge
                  label={t(intl.resultLogView)}
                  size="s"
                />
              </div>
              <div className={b('final-tablet-line-text-wrapper')}>
                {t(intl.createResultLog)}
              </div>
              <Button
                label={(isTabletVisible ? t(intl.collapse) : t(intl.expand)) as string}
                size="xs"
                onClick={this.onExpandTabletButtonClick}
              />
            </div>
            <div className={b('final-tablet', { visible: isTabletVisible })}>
              <div className={b('final-tablet-wrapper')}>
                <div
                  className={b('cells')}
                >
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
                      if (curveName !== 'DEPTH' && curveName !== 'PORO' && curveName !== 'SW'
                        && curveName !== 'PERM') {
                        const currentCurveData = researchData[curveName];
                        return (
                          <div
                            className={b('cell', { visible: chartsVisibilities.main[id] })}
                            key={uuid()}
                          >
                            <Chart
                              data={currentCurveData || []}
                              settings={{
                                header: curveName,
                                lineColor: chartPopoversSettings.main[id].chartColor,
                                lineWidth: 2,
                                fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                              }}
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
                    {calculatedCurvesKeys && calculatedCurvesKeys
                      .map((curveName: string, id: number) => (
                        <div
                          className={b('cell', { visible: chartsVisibilities.user[id] })}
                          key={`2${id}`}
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
                      <div
                        className={b('cell', { visible: chartsVisibilities.userForTab[id] })}
                        key={`3${id}`}
                      >
                        <Chart
                          data={curves[curveName]}
                          settings={{
                            header: curveName,
                            lineColor: chartPopoversSettings.userForTab[id].chartColor,
                            lineWidth: 2,
                            fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                          }}
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
                      className={b('cell', { visible: chartsVisibilities.userForTab[5] })}
                      key={4}
                    >
                      <ColorContentChart
                        dataLength={dataLength}
                        selectOptions={this.lithologySelectList}
                        intervals={lithologyIntervals}
                        withoutEditControls
                        settings={{
                          fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                          initialMessage: t(intl.lithologyDataSource),
                        }}
                        t={t}
                      />
                    </div>
                    <div
                      className={b('cell', { visible: chartsVisibilities.userForTab[6] })}
                      key={5}
                    >
                      <ColorContentChart
                        dataLength={dataLength}
                        selectOptions={this.fluidTypeSelectList}
                        intervals={fluidIntervals}
                        withoutEditControls
                        settings={{
                          header: t(intl.fluid),
                          initialMessage: t(intl.fluidDataSource),
                          fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                        }}
                        t={t}
                      />
                    </div>
                    <div
                      className={b('cell', { visible: chartsVisibilities.userForTab[7] })}
                      key={6}
                    >
                      <ColorContentChart
                        dataLength={dataLength}
                        selectOptions={this.perforationSelectList}
                        intervals={perforationIntervals}
                        withoutEditControls
                        settings={{
                          header: t(intl.perforation),
                          initialMessage: t(intl.perforationDataSource),
                          fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                        }}
                        t={t}
                      />
                    </div>
                  </div>
                </div>
                <CurvesBrowser
                  researchData={researchData}
                  calculatedCurvesData={calculatedCurves}
                  calculatedCurvesForTabData={{ ...curves, LITHO: [], FLUID: [], PERFO: [] }}
                  isAllChartsVisible={isAllChartsVisible}
                  chartsVisibilities={chartsVisibilities}
                  t={t}
                  onCheckboxClickHandler={this.onCheckboxClick}
                  onShowAllChartsCheckboxClick={this.onShowAllChartsCheckboxClick}
                />
              </div>
            </div>
            <div className={b('recommendations-line')}>
              <div className={b('recommendations-line-wrapper')}>
                <Badge
                  label={t(intl.calculationsAndRecommendations)}
                  size="s"
                />
              </div>
              <div className={b('recommendations-line-text-wrapper')}>
                {t(intl.writeSomeRecommendations)}
              </div>
              <Button
                label={(isRecommendationsVisible ? t(intl.collapse) : t(intl.expand)) as string}
                size="xs"
                onClick={this.onExpandRecommendationsButtonClick}
              />
            </div>
            <div className={b('recommendations', { visible: isRecommendationsVisible })}>
              <SimpleQuestionsForm
                questions={this.questions}
                initialAnswers={answers}
                t={t}
                onSubmitButtonClickHandler={this.onFormSubmitButtonClick}
                onSetNotificationHandler={setNotification}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  @autobind
  private onSaveTabDataButtonClick(): void {
    const { appPosition, userToken, passedPoints, saveFeatureState,
      savePassedPoints, setNotification, t } = this.props;
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

    setNotification({
      text: t(intl.congratulations),
      kind: 'success',
      link: t(notificationIntl.link),
      duration: 120,
    });
  }

  @autobind
  private onExpandTabletButtonClick(): void {
    this.setState((prevState: IState) => ({ isTabletVisible: !prevState.isTabletVisible }));
  }

  @autobind
  private onExpandRecommendationsButtonClick(): void {
    this.setState((prevState: IState) =>
      ({ isRecommendationsVisible: !prevState.isRecommendationsVisible }));
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

  @autobind
  private onFormSubmitButtonClick(answers: string[]): void {
    this.setState({ answers });
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
    isModalOpen: false,
    answers: [],
    isTabletVisible: false,
    isRecommendationsVisible: false,
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
  mapDispatch)(SummarySectionComponent);
const SummarySection = withTranslation()(connectedComponent);

export { SummarySection };
