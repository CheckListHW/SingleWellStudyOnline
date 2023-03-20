import uuid from 'uuid';
import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { Chart } from 'shared/view/components/Chart/Chart';
import { DepthChart } from 'shared/view/components/DepthChart/DepthChart';
import { CurvesBrowser } from 'shared/view/components/CurvesBrowser/CurvesBrowser';
import { NotesChart } from 'shared/view/components/NotesChart/NotesChart';
import { StructureChart } from 'shared/view/components/StructureChart/StructureChart';
import { VerticalBarChart } from 'shared/view/components/VerticalBarChart/VerticalBarChart';
import { IAppReduxState } from 'shared/types/app';
import { ICurves, IChartsVisibilities, INote, IStructure,
  SelectedItems, IChartsPopoversSettings } from 'shared/types/models';
import { ICursor } from 'shared/types/common';
import { DIAGRAM_DEFAULT_COLORS, FIELD_SIZE, LITOLOGY_SELECT, LITHOLOGY_TRANSLATION_KEYS,
  STRUCTURES_SELECT, STRUCTURES_SELECT_TRANSLATION_KEYS } from 'shared/constants';
import { getTabIndex, cutDataByCore, getInitialSameState } from 'shared/helpers';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { selectors as buttonClickProviderSelectors } from 'services/buttonClickProvider';
import { actionCreators as notificationActions } from 'services/notification';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import './SedimentationEnvironmentDetermination.scss';


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
  lithologyIntervals: IStructure[];
  particlesSizes: INote[];
  structures: IStructure[];
  notes: INote[];
  resume: string;
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

const b = block('sedimentation-environment-determination');
const { depositionalEnvironment: intl } = tKeys.features;
const { lithologySelectList: lithologyIntl } = tKeys;

type LithologySelectListKey = 'shale' | 'sand' | 'coal' | 'limestone' | 'shalySand';
type StructereSelectListKey = 'bioturbationStructures' |
'climbingCurrentRipples' |
'crossBedding' |
'currentRipples' |
'doubleMudDrapes' |
'escapeStructures' |
'flameStructures' |
'flatLamination' |
'flazerBedding' |
'fluidMuds' |
'gradatedBedding' |
'hcs' |
'lenticularBedding' |
'loadCast' |
'softSedimentDeformation' |
'troughCrossBedding' |
'waveRipples' |
'wavyLamination';

class SedimentationEnvironmentDeterminationComponent extends React.Component<Props, IState> {
  private lithologySelectList = LITOLOGY_SELECT.map(item => {
    const key = lithologyIntl[LITHOLOGY_TRANSLATION_KEYS[Number(item
      .value) - 1] as LithologySelectListKey];
    return {
      value: item.value,
      label: this.props.t(key),
      color: item.color,
      imageUrl: item.imageUrl,
    };
  });

  private structereSelectList = STRUCTURES_SELECT.map(item => {
    const key = intl[STRUCTURES_SELECT_TRANSLATION_KEYS[Number(item
      .value) - 1] as StructereSelectListKey];
    return {
      value: item.value,
      label: this.props.t(key),
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
      isAllChartsVisible,
      lithologyIntervals,
      chartPopoversSettings,
      chartsVisibilities,
      structures,
      particlesSizes,
      notes,
      resume,
    } = this.state;
    const { researchData, researchData: { DEPTH, PORO }, calculatedCurves, calculatedCurvesForTab,
      appPosition, verticalScale, t } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    const calculatedCurvesKeys = Object.keys(calculatedCurves);
    const calculatedCurvesForTabKeys = calculatedCurvesForTab[currentFeatureStateIndex]
      ? Object.keys(calculatedCurvesForTab[currentFeatureStateIndex])
      : [];

    const trimmedData = cutDataByCore(DEPTH, DEPTH, PORO);
    const minDepth = Math.min(...trimmedData.depth);
    const maxDepth = Math.max(...trimmedData.depth);

    return (
      <div className={b()}>
        <div className={b('main-block-wrapper')}>
          <div className={b('cells')}>
            <div className={b('cell', { visible: true })}>
              <DepthChart
                data={trimmedData.depth}
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
                  const currentData = cutDataByCore(DEPTH, researchData[curveName], PORO);
                  return (
                    <div
                      className={b('cell', { visible: chartsVisibilities.main[id] })}
                      key={`1${id}`}
                    >
                      <Chart
                        data={currentData.firstCurve}
                        settings={{
                          header: curveName,
                          lineColor: chartPopoversSettings.main[id].chartColor,
                          lineWidth: 2,
                          fieldSize: [160, verticalScale * FIELD_SIZE[1]],
                        }}
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
              {calculatedCurvesKeys && calculatedCurvesKeys.map((curveName: string, id: number) => {
                const currentData = cutDataByCore(DEPTH, calculatedCurves[curveName], PORO);
                return (
                  <div className={b('cell', { visible: chartsVisibilities.user[id] })} key={`2${id}`}>
                    <Chart
                      data={currentData.firstCurve}
                      settings={{
                        header: curveName,
                        lineColor: chartPopoversSettings.user[id].chartColor,
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
                );
              })}
              {calculatedCurvesForTabKeys
                && calculatedCurvesForTabKeys.map((curveName: string, id: number) => {
                  const currentData = cutDataByCore(DEPTH,
                    calculatedCurvesForTab[currentFeatureStateIndex][curveName], PORO);
                  return (
                    <div className={b('cell', { visible: chartsVisibilities.userForTab[id] })} key={`3${id}`}>
                      <Chart
                        data={currentData.firstCurve}
                        settings={{
                          header: curveName,
                          lineColor: chartPopoversSettings.userForTab[id].chartColor,
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
                  );
                })}
            </div>
            <div className={b('cell', { visible: true })} key={4}>
              <StructureChart
                data={lithologyIntervals}
                settings={{
                  header: t(intl.coreLithology),
                  minDepth,
                  maxDepth,
                  fieldSize: [220, verticalScale * FIELD_SIZE[1]],
                  initialMessage: t(intl.instructionMessage),
                }}
                selectItems={this.lithologySelectList}
                t={t}
                isSingleSelect
                onSaveStructureButtonClickHandler={this.onSaveLithologyButtonClick}
                onEditStructureButtonClickHandler={this.onEditLithologyButtonClick}
                onDeleteStructureButtonClickHandler={this.onDeleteLithologyButtonClick}
                onDeleteAllStructuresButtonClickHandler={this.onDeleteAllLithologyButtonClick}
              />
            </div>
            <div className={b('cell', { visible: true })} key={5}>
              <VerticalBarChart
                data={particlesSizes}
                settings={{
                  header: t(intl.grainSize),
                  fieldSize: [220, verticalScale * FIELD_SIZE[1]],
                  minDepth,
                  maxDepth,
                  initialMessage: t(intl.secondInstructionMessage),
                }}
                isWithoutMainControls
                isLogarithmic
                t={t}
                onEditNoteButtonClickHandler={this.onEditParticleSizeButtonClick}
              />
            </div>
            <div className={b('cell', { visible: true })} key={6}>
              <StructureChart
                data={structures}
                settings={{
                  header: t(intl.depositionalStructures),
                  minDepth,
                  maxDepth,
                  fieldSize: [220, verticalScale * FIELD_SIZE[1]],
                  initialMessage: t(intl.secondInstructionMessage),
                }}
                isWithoutMainControls
                selectItems={this.structereSelectList}
                t={t}
                onEditStructureButtonClickHandler={this.onEditStructureButtonClick}
              />
            </div>
            <div className={b('cell', { visible: true })} key={7}>
              <NotesChart
                data={notes}
                settings={{
                  header: t(intl.coreDescription),
                  fieldSize: [220, verticalScale * FIELD_SIZE[1]],
                  minDepth,
                  maxDepth,
                  initialMessage: t(intl.secondInstructionMessage),
                }}
                isWithoutMainControls
                t={t}
                onEditNoteButtonClickHandler={this.onEditNoteButtonClick}
              />
            </div>
            <div className={b('cell', { visible: true })} key={8}>
              <NotesChart
                data={[
                  {
                    minDepth,
                    maxDepth: minDepth + (maxDepth - minDepth) * 0.25,
                    noteText: t(intl.thirdInstructionMessage),
                    controls: null,
                  },
                  {
                    minDepth: minDepth + (maxDepth - minDepth) * 0.25,
                    maxDepth,
                    noteText: resume,
                    controls: { edit: true, delete: false },
                  },
                ]}
                isWithoutMainControls
                settings={{
                  header: t(intl.result),
                  fieldSize: [300, verticalScale * FIELD_SIZE[1]],
                  minDepth,
                  maxDepth,
                  initialMessage: '',
                }}
                t={t}
                onEditNoteButtonClickHandler={this.onEditResumeButtonClick}
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
  private onSaveLithologyButtonClick(minDepth: number, maxDepth: number,
    selectedItems: SelectedItems[]): void {
    const { setNotification, t } = this.props;
    const { lithologyIntervals } = this.state;
    const isMinDepthAmongBoundariesOfExistIntervals = lithologyIntervals
      .some(interval => minDepth >= interval.minDepth && minDepth < interval.maxDepth);
    const isMaxDepthAmongBoundariesOfExistIntervals = lithologyIntervals
      .some(interval => maxDepth > interval.minDepth && maxDepth <= interval.maxDepth);
    const isIntervalCrossedExistIntervals = isMinDepthAmongBoundariesOfExistIntervals
      || isMaxDepthAmongBoundariesOfExistIntervals;

    if (minDepth < maxDepth && !isIntervalCrossedExistIntervals) {
      this.setState((prevState: IState) => {
        const newLithologyIntervals = [
          ...prevState.lithologyIntervals, {
            minDepth,
            maxDepth,
            structureItems: selectedItems,
            controls: { edit: true, delete: true },
          },
        ].sort((firstLithology, secondLithology) =>
          firstLithology.minDepth - secondLithology.minDepth);
        const structures = [
          ...prevState.structures, {
            minDepth,
            maxDepth,
            structureItems: [],
            controls: { edit: true, delete: false },
          },
        ].sort((firstStructure, secondStructure) =>
          firstStructure.minDepth - secondStructure.minDepth);
        const notes = [
          ...prevState.notes, {
            minDepth,
            maxDepth,
            noteText: '',
            controls: { edit: true, delete: false },
          },
        ].sort((firstNote, secondNote) => firstNote.minDepth - secondNote.minDepth);
        const particlesSizes = [
          ...prevState.particlesSizes, {
            minDepth,
            maxDepth,
            noteText: '',
            controls: { edit: true, delete: false },
          },
        ].sort((firstSize, secondSize) => firstSize.minDepth - secondSize.minDepth);
        return { lithologyIntervals: newLithologyIntervals, structures, notes, particlesSizes };
      });
    } else {
      setNotification({
        text: t(intl.incorrectInterval),
        kind: 'warning',
      });
    }
  }

  @autobind
  private onEditLithologyButtonClick(minDepth: number, maxDepth: number,
    selectedItems: SelectedItems[]): void {
    const { setNotification, t } = this.props;
    const { lithologyIntervals } = this.state;
    const isMinDepthAmongBoundariesOfExistIntervals = lithologyIntervals
      .some(interval => minDepth > interval.minDepth && minDepth < interval.maxDepth);
    const isMiaxDepthAmongBoundariesOfExistIntervals = lithologyIntervals
      .some(interval => maxDepth > interval.minDepth && maxDepth < interval.maxDepth);
    const isIntervalCrossedExistIntervals = isMinDepthAmongBoundariesOfExistIntervals
      || isMiaxDepthAmongBoundariesOfExistIntervals;
    if (minDepth < maxDepth && !isIntervalCrossedExistIntervals) {
      this.setState((prevState: IState) => (
        { lithologyIntervals: prevState.lithologyIntervals.reduce((acc, lithology) => {
          if (lithology.minDepth === minDepth || lithology.maxDepth === maxDepth) {
            return [...acc, {
              minDepth,
              maxDepth,
              structureItems: selectedItems,
              controls: { edit: true, delete: true },
            }];
          }
          return [...acc, lithology];
        }, []) }
      ));
    } else {
      setNotification({
        text: t(intl.incorrectInterval),
        kind: 'warning',
      });
    }
  }

  @autobind
  private onDeleteLithologyButtonClick(index: number): void {
    this.setState((prevState: IState) => {
      const lithologyIntervals = prevState.lithologyIntervals.reduce((acc, lithology, id) => {
        if (id !== index) {
          return [...acc, lithology];
        }
        return acc;
      }, []);
      const notes = prevState.notes.reduce((acc, note, id) => {
        if (id !== index) {
          return [...acc, note];
        }
        return acc;
      }, []);
      const structures = prevState.structures.reduce((acc, structure, id) => {
        if (id !== index) {
          return [...acc, structure];
        }
        return acc;
      }, []);
      const particlesSizes = prevState.particlesSizes.reduce((acc, particleSize, id) => {
        if (id !== index) {
          return [...acc, particleSize];
        }
        return acc;
      }, []);
      return { lithologyIntervals, notes, structures, particlesSizes };
    });
  }

  @autobind
  private onDeleteAllLithologyButtonClick(): void {
    this.setState({ lithologyIntervals: [], notes: [], structures: [], particlesSizes: [] });
  }

  @autobind
  private onEditNoteButtonClick(minDepth: number, maxDepth: number, noteText: string): void {
    this.setState((prevState: IState) => (
      { notes: prevState.notes.reduce((acc, note) => {
        if (note.minDepth === minDepth || note.maxDepth === maxDepth) {
          return [...acc, {
            minDepth,
            maxDepth,
            noteText,
            controls: { edit: true, delete: false },
          }];
        }
        return [...acc, note];
      }, []) }
    ));
  }

  @autobind
  private onEditParticleSizeButtonClick(minDepth: number, maxDepth: number,
    noteText: string): void {
    this.setState((prevState: IState) => (
      { particlesSizes: prevState.particlesSizes.reduce((acc, particleSize) => {
        if (particleSize.minDepth === minDepth || particleSize.maxDepth === maxDepth) {
          return [...acc, {
            minDepth,
            maxDepth,
            noteText,
            controls: { edit: true, delete: false },
          }];
        }
        return [...acc, particleSize];
      }, []) }
    ));
  }

  @autobind
  private onEditStructureButtonClick(minDepth: number, maxDepth: number,
    selectedItems: SelectedItems[]): void {
    this.setState((prevState: IState) => (
      { structures: prevState.structures.reduce((acc, structure) => {
        if (structure.minDepth === minDepth || structure.maxDepth === maxDepth) {
          return [...acc, {
            minDepth,
            maxDepth,
            structureItems: selectedItems,
            controls: { edit: true, delete: false },
          }];
        }
        return [...acc, structure];
      }, []) }
    ));
  }

  @autobind
  private onEditResumeButtonClick(_minDepth: number, _maxDepth: number, noteText: string): void {
    this.setState({ resume: noteText });
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
    lithologyIntervals: [],
    structures: [],
    particlesSizes: [],
    notes: [],
    resume: '',
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
  mapDispatch)(SedimentationEnvironmentDeterminationComponent);
const SedimentationEnvironmentDetermination = withTranslation()(connectedComponent);

export { SedimentationEnvironmentDetermination };
