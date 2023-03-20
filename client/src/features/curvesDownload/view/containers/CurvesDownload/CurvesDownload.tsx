import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Button } from 'consta-uikit-fork/Button';
import { Badge } from 'consta-uikit-fork/Badge';
import { IconClose } from 'consta-uikit-fork/IconClose';

import { IAppReduxState } from 'shared/types/app';
import { ICurves, INamedInterval, IStructure, INote } from 'shared/types/models';
import { LITHOLOGY_DEFINITION_ID, LIMIT_VALUES_CALCULATION_ID, FLUID_TYPE_DEFINITION_ID,
  PERFORATION_INTERVALS_DEFINITION_ID, SEDIMENTATION_ENVIRONMENT_DETERMINATION_ID } from 'shared/constants';
import { downloadFile } from 'shared/helpers';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { actionCreators as notificationActions } from 'services/notification';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import './CurvesDownload.scss';


interface IStateProps {
  researchData: ICurves;
  calculatedCurves: ICurves;
  calculatedCurvesForTab: { [key: string]: ICurves };
  featuresStates: { [key: string]: { [key: string]: any }};
}

interface IOwnProps {
  onCloseButtonClickHandler(): void;
}

type ActionProps = typeof mapDispatch;
type Props = IStateProps & ActionProps & IOwnProps & ITranslationProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    researchData: userSelectors.selectResearchData(state),
    calculatedCurves: userSelectors.selectCalculatedCurves(state),
    calculatedCurvesForTab: userSelectors.selectCalculatedCurvesForTab(state),
    featuresStates: userSelectors.selectFeaturesStates(state),
  };
}

const mapDispatch = {
  saveFeatureState: userActions.saveTabState,
  savePassedPoints: userActions.savePassedPoints,
  setNotification: notificationActions.setNotification,
};

const fileName = 'curves.las';
const b = block('curves-download');
const { curvesDownload: intl } = tKeys.features;

class CurvesDownloadComponent extends React.PureComponent<Props> {
  private combinedCurvesData = this.getCombinedCurvesData();
  public render() {
    const { calculatedCurves, calculatedCurvesForTab,
      onCloseButtonClickHandler, t } = this.props;
    const calculatedCurvesKeys = Object.keys(calculatedCurves);
    const calculatedCurvesForTabsDataKeys = calculatedCurvesForTab
      ? Object.keys(calculatedCurvesForTab).reduce((acc, tab) =>
        (calculatedCurvesForTab[tab] && Object.keys(calculatedCurvesForTab[tab]).length !== 0
          ? [...acc, tab] : acc), [])
      : [];
    const changedCurvesForTabsDataKeys = calculatedCurvesForTabsDataKeys.reduce((mainAcc, tab) => {
      const tabKeys = calculatedCurvesForTab[tab] ? Object.keys(calculatedCurvesForTab[tab]) : [];
      const renamedTabsCurves = tabKeys.reduce((acc, key) => ([...acc, `${key}`]), []);
      return [...mainAcc, ...renamedTabsCurves];
    }, []);
    const otherCurvesKeys = this.combinedCurvesData.other
    && Object.keys(this.combinedCurvesData.other)
      ? Object.keys(this.combinedCurvesData.other)
      : [];

    return (
      <div className={b()}>
        <div className={b('main-header-panel')}>
          <Button
            iconLeft={IconClose}
            onlyIcon
            size="xs"
            onClick={onCloseButtonClickHandler}
          />
        </div>
        <div className={b('row', { type: 'list-main-header' })}>
          <div className={b('cell')}>
            {t(intl.number)}
          </div>
          <div className={b('cell')}>
            {t(intl.curve)}
          </div>
        </div>
        <div className={b('curves-list')}>
          <div className={b('row', { type: 'header' })}>
            <Badge label={t(intl.calculatedCurvesForApp)} />
          </div>
          {calculatedCurvesKeys && calculatedCurvesKeys.length > 0
          && calculatedCurvesKeys.map((curve, index) => (
            <div className={b('row')} key={index + 100}>
              <div className={b('cell')}>
                {index + 1}
              </div>
              <div className={b('cell')}>
                {curve}
              </div>
            </div>
          ))}
          {(!calculatedCurvesKeys || calculatedCurvesKeys.length === 0) && (
            <div className={b('row')}>
              {t(intl.noCurves)}
            </div>
          )}
          <div className={b('row', { type: 'header' })}>
            <Badge label={t(intl.calculatedCurvesForTabs)} />
          </div>
          {changedCurvesForTabsDataKeys && changedCurvesForTabsDataKeys.length > 0
          && changedCurvesForTabsDataKeys.map((curve, index) => (
            <div className={b('row')} key={index}>
              <div className={b('cell')}>
                {index + 1}
              </div>
              <div className={b('cell')}>
                {curve}
              </div>
            </div>
          ))}
          {(!changedCurvesForTabsDataKeys || changedCurvesForTabsDataKeys.length === 0) && (
            <div className={b('row')}>
              {t(intl.noCurves)}
            </div>
          )}
          <div className={b('row', { type: 'header' })}>
            <Badge label={t(intl.otherCurves)} />
          </div>
          {otherCurvesKeys && otherCurvesKeys.length > 0 && otherCurvesKeys.map((curve, index) => (
            <div className={b('row')} key={index}>
              <div className={b('cell')}>
                {index + 1}
              </div>
              <div className={b('cell')}>
                {curve}
              </div>
            </div>
          ))}
          {(!otherCurvesKeys || otherCurvesKeys.length === 0) && (
            <div className={b('row')}>
              {t(intl.noCurves)}
            </div>
          )}
        </div>
        <div className={b('constrol-button-row')}>
          <Button
            label={t(intl.downloadAll) as string}
            onClick={this.onDownloadAllButtonClick}
          />
        </div>
      </div>
    );
  }

  @autobind
  private onDownloadAllButtonClick(): void {
    const LASfileBodyString = this.getLASfileBodyString();
    downloadFile(fileName, LASfileBodyString);
  }

  private getLASfileBodyString(): string {
    const { researchData: { DEPTH } } = this.props;
    const combinedData = this.combinedCurvesData.all;

    const minDepth = Math.min(...DEPTH);
    const maxDepth = Math.max(...DEPTH);
    const combinedDataKeys = Object.keys(combinedData);
    const mainHeader = getLASfileHeader(minDepth, maxDepth);
    const curveInformation = ''.concat(...combinedDataKeys.map(curveName => ''.concat(curveName, '.', ...Array(29 - curveName.length - 1).fill(' '), ':', '\n')));
    const curveHeadersString = '~A       DEPT'.concat(...combinedDataKeys.map(curveName => ''.concat(...Array(13 - curveName.length).fill(' '), curveName)));
    const curves = DEPTH.reduce((acc, depthItem, index) => {
      const formattedDepthValueString = getFormattedValueString(depthItem);
      const startValue = ''.concat(...Array(13 - formattedDepthValueString.length).fill(' '), String(formattedDepthValueString));
      const currentString = combinedDataKeys.reduce((stringAcc, key: keyof typeof combinedData) => {
        const formattedValueString = getFormattedValueString(combinedData[key][index]);

        return combinedData[key][index] !== undefined
          ? stringAcc.concat(...Array(13 - formattedValueString.length).fill(' '), formattedValueString)
          : stringAcc.concat('-9999.0000');
      }, startValue);
      return acc.concat(`${currentString}\n`);
    }, '');

    return (`${mainHeader}${curveInformation}${curveHeadersString}\n${curves}`);
  }

  private getCombinedCurvesData(): { all: {[key: string]: number[]};
    other: {[key: string]: number[]}; } {
    const { researchData: { DEPTH }, calculatedCurves,
      calculatedCurvesForTab, featuresStates } = this.props;
    const calculatedCurvesForTabsDataKeys = calculatedCurvesForTab
      ? Object.keys(calculatedCurvesForTab).reduce((acc, tab) => (calculatedCurvesForTab[tab]
        && Object.keys(calculatedCurvesForTab[tab]).length !== 0 ? [...acc, tab] : acc), [])
      : [];
    const changedCurvesForTabsData = calculatedCurvesForTabsDataKeys.reduce((mainAcc, tab) => {
      const tabKeys = calculatedCurvesForTab[tab] ? Object.keys(calculatedCurvesForTab[tab]) : [];
      const renamedTabsCurves = tabKeys.reduce((acc, key) => ({ ...acc, [`${key}`]: calculatedCurvesForTab[tab][key] }), {});
      return { ...mainAcc, ...renamedTabsCurves };
    }, {});
    const lithologyIntervals = featuresStates[LITHOLOGY_DEFINITION_ID]
      && featuresStates[LITHOLOGY_DEFINITION_ID].lithologyIntervals
      ? featuresStates[LITHOLOGY_DEFINITION_ID].lithologyIntervals
      : [];
    const lithologyCurve = getCurveFromInterval(lithologyIntervals, DEPTH);
    const sandstoneThicknessCurveData: number[] = featuresStates[LIMIT_VALUES_CALCULATION_ID]
      && featuresStates[LIMIT_VALUES_CALCULATION_ID].sandstoneThicknessCurveData
      ? featuresStates[LIMIT_VALUES_CALCULATION_ID].sandstoneThicknessCurveData
      : [];
    const collectorСapacityCurveData: number[] = featuresStates[LIMIT_VALUES_CALCULATION_ID]
      && featuresStates[LIMIT_VALUES_CALCULATION_ID].collectorСapacityCurveData
      ? featuresStates[LIMIT_VALUES_CALCULATION_ID].collectorСapacityCurveData
      : [];
    const oilSaturatedReservoirCapacityCurveData:
    number[] = featuresStates[LIMIT_VALUES_CALCULATION_ID]
      && featuresStates[LIMIT_VALUES_CALCULATION_ID].oilSaturatedReservoirCapacityCurveData
      ? featuresStates[LIMIT_VALUES_CALCULATION_ID].oilSaturatedReservoirCapacityCurveData
      : [];
    const permeableReservoirThicknessCurveData:
    number[] = featuresStates[LIMIT_VALUES_CALCULATION_ID]
      && featuresStates[LIMIT_VALUES_CALCULATION_ID].permeableReservoirThicknessCurveData
      ? featuresStates[LIMIT_VALUES_CALCULATION_ID].permeableReservoirThicknessCurveData
      : [];
    const effectiveOilSaturatedReservoirCapacityCurveData:
    number[] = featuresStates[LIMIT_VALUES_CALCULATION_ID]
      && featuresStates[LIMIT_VALUES_CALCULATION_ID].effectiveOilSaturatedReservoirCapacityCurveData
      ? featuresStates[LIMIT_VALUES_CALCULATION_ID].effectiveOilSaturatedReservoirCapacityCurveData
      : [];
    const fluidIntervals = featuresStates[FLUID_TYPE_DEFINITION_ID]
      && featuresStates[FLUID_TYPE_DEFINITION_ID].fluidIntervals
      ? featuresStates[FLUID_TYPE_DEFINITION_ID].fluidIntervals
      : [];
    const fluidCurve = getCurveFromInterval(fluidIntervals, DEPTH);
    const perforationIntervals = featuresStates[PERFORATION_INTERVALS_DEFINITION_ID]
      && featuresStates[PERFORATION_INTERVALS_DEFINITION_ID].perforationIntervals
      ? featuresStates[PERFORATION_INTERVALS_DEFINITION_ID].perforationIntervals
      : [];
    const perforationCurve = getCurveFromInterval(perforationIntervals, DEPTH);
    const particlesSizes = featuresStates[SEDIMENTATION_ENVIRONMENT_DETERMINATION_ID]
      && featuresStates[SEDIMENTATION_ENVIRONMENT_DETERMINATION_ID].particlesSizes
      ? featuresStates[SEDIMENTATION_ENVIRONMENT_DETERMINATION_ID].particlesSizes
      : [];
    const structures = featuresStates[SEDIMENTATION_ENVIRONMENT_DETERMINATION_ID]
      && featuresStates[SEDIMENTATION_ENVIRONMENT_DETERMINATION_ID].structures
      ? featuresStates[SEDIMENTATION_ENVIRONMENT_DETERMINATION_ID].structures
      : [];
    const coreLithologyIntervals = featuresStates[SEDIMENTATION_ENVIRONMENT_DETERMINATION_ID]
      && featuresStates[SEDIMENTATION_ENVIRONMENT_DETERMINATION_ID].lithologyIntervals
      ? featuresStates[SEDIMENTATION_ENVIRONMENT_DETERMINATION_ID].lithologyIntervals
      : [];
    const coreLithologyCurve = getCurveFromStructure(coreLithologyIntervals, DEPTH);
    const texturesCurve = getCurveFromStructure(structures, DEPTH);
    const particlesSizesCurve = getCurveOrNotesFromNotesArray(particlesSizes, DEPTH);

    const unpeeledCombinedData = {
      ...calculatedCurves,
      ...changedCurvesForTabsData,
      LITHO: lithologyCurve,
      SANDTHICK: sandstoneThicknessCurveData,
      COLCAPAC: collectorСapacityCurveData,
      OILSRCAPAC: oilSaturatedReservoirCapacityCurveData,
      PERMRETHICK: permeableReservoirThicknessCurveData,
      EOILSRCAPAC: effectiveOilSaturatedReservoirCapacityCurveData,
      FLUID: fluidCurve,
      PERFO: perforationCurve,
      LITHOCORE: coreLithologyCurve,
      PARTSIZES: particlesSizesCurve,
      TEXTURES: texturesCurve,
    };

    const unpeeledOtherCurvesData = {
      LITHO: lithologyCurve,
      SANDTHICK: sandstoneThicknessCurveData,
      COLCAPAC: collectorСapacityCurveData,
      OILSRCAPAC: oilSaturatedReservoirCapacityCurveData,
      PERMRETHICK: permeableReservoirThicknessCurveData,
      EOILSRCAPAC: effectiveOilSaturatedReservoirCapacityCurveData,
      FLUID: fluidCurve,
      PERFO: perforationCurve,
      LITHOCORE: coreLithologyCurve,
      PARTSIZES: particlesSizesCurve,
      TEXTURES: texturesCurve,
    };

    const combinedCurves = Object.keys(unpeeledCombinedData)
      .reduce((acc, key: keyof typeof unpeeledCombinedData) => (unpeeledCombinedData[key].length > 0
        ? { ...acc, [key]: unpeeledCombinedData[key] }
        : acc),
      {});
    const otherCurves = Object.keys(unpeeledOtherCurvesData)
      .reduce((acc, key: keyof typeof unpeeledOtherCurvesData) =>
        (unpeeledOtherCurvesData[key].length > 0
          ? { ...acc, [key]: unpeeledOtherCurvesData[key] }
          : acc),
      {});

    return { all: combinedCurves, other: otherCurves };
  }
}

const getLASfileHeader = (startDepth: number, stopDepth: number): string => {
  const formattedStartDepth = getFormattedValueString(startDepth);
  const formattedStopDepth = getFormattedValueString(stopDepth);
  const startDepthStringWithSpaces = ''.concat(...Array(23 - formattedStartDepth.length).fill(' '), formattedStartDepth);
  const stopDepthStringWithSpaces = ''.concat(...Array(23 - formattedStopDepth.length).fill(' '), formattedStopDepth);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  const startDepthString = `STRT.M${startDepthStringWithSpaces}: Start depth\n`;
  const stopDepthString = `STOP.M${stopDepthStringWithSpaces}: Stop depth\n`;
  const downloadDate = `DATE_ZAGR.          DATE_ZAGR: ${day}-${months[month]}-${year}\n`;

  return (`${'~VERSION INFORMATION\n'
      + 'VERS.                    1.20: CWLS LOG ASCII STANDARD VERSION 1.20\n'
      + 'WRAP.                    NO  : One line per depth step\n'
      + '~WELL INFORMATION\n'}${
    startDepthString
  }${stopDepthString
  }STEP.M                 0.1000: Step\n`
      + 'NULL.              -9999.0000: Null value\n'
      + 'COMP.                 COMPANI: TPU HERIOT_WATT\n'
      + 'CNTY.                  COUNTY: WEST_SYBIRIAN\n'
      + 'FLD .                   FIELD: 999\n'
      + 'STAT.                   STATE: RUSSIA\n'
      + `DATE.                    DATE: LOG\n${
        downloadDate
      }SRVC.         SERVICE COMPANY: UNKNOWN\n`
      + 'WELL.                    WELL: 999\n'
      + 'UWI .                     UWI: 999_999\n'
      + '~CURVE INFORMATION\n'
      + 'DEPT.M                       :\n');
};

const getFormattedValueString = (value: number): string => {
  if (!/\./.test(String(value))) {
    return `${value}.0000`;
  }
  const dotPositionIndex = String(value).indexOf('.') + 1;
  const charactersNumberAfterDot = String(value).length - dotPositionIndex;
  if (charactersNumberAfterDot >= 4) {
    return `${Math.round(value * 10000) / 10000}`;
  }
  return String(value).concat(...Array(4 - charactersNumberAfterDot).fill('0'));
};

const getCurveFromInterval = (intervals: INamedInterval[], depthArray: number[]): number[] => {
  if (intervals && intervals.length > 0) {
    const lastElementIndex = intervals.length - 1;
    const maxColumnHeight = intervals[lastElementIndex]
      ? intervals[lastElementIndex].endCoordinate
      : 700;
    const minDepth = Math.min(...depthArray);
    const maxDepth = Math.max(...depthArray);
    const depthInterval = maxDepth - minDepth;
    const correctedIntervals = intervals
      .reduce((acc, item) => [...acc, {
        beginCoordinate: Math.ceil((minDepth
          + ((item.beginCoordinate * depthInterval) / maxColumnHeight)) * 10) / 10,
        endCoordinate: Math.floor((minDepth
          + ((item.endCoordinate * depthInterval) / maxColumnHeight)) * 10) / 10,
        name: item.name,
      }], []);
    return correctedIntervals.reduce((acc, interval) => {
      const dimension = Math.round((interval.endCoordinate - interval.beginCoordinate) / 0.1 + 1);
      return [...acc, ...Array(dimension).fill(Number(interval.name))];
    }, []);
  }
  return [];
};

const getCurveFromStructure = (structures: IStructure[], depthArray: number[]): number[] => {
  if (structures && structures.length > 0) {
    const minDepth = Math.min(...depthArray);
    const maxDepth = Math.max(...depthArray);
    const preparedIntervals = structures
      .reduce((acc, item, index) => {
        if (index === 0) {
          if (Number(item.minDepth) > Number(minDepth)) {
            return [
              ...acc,
              { minDepth, maxDepth: Math.round((Number(item.minDepth) - 0.1) * 10) / 10, structureItems: [{ value: '-1', checked: false, label: '', imageUrl: '' }] },
              item,
            ];
          }
          return [...acc, item];
        }

        const lastAccElement = acc.length > 0 ? acc[acc.length - 1] : { maxDepth: 3000 };

        if (Number(lastAccElement.maxDepth) < Number(item.minDepth)) {
          return [
            ...acc,
            { minDepth: Math.round((Number(lastAccElement.maxDepth) + 0.1) * 10) / 10, maxDepth: Math.round((Number(item.minDepth) - 0.1) * 10) / 10, structureItems: [{ value: '-1', checked: false, label: '', imageUrl: '' }] },
            item,
          ];
        }
        return [
          ...acc,
          { ...item, minDepth: Math.round((Number(item.minDepth) + 0.1) * 10) / 10 },
        ];
      }, []);

    const correctedIntervals = Number(preparedIntervals[preparedIntervals
      .length - 1].maxDepth) < maxDepth
      ? [...preparedIntervals, { minDepth: Math.round((Number(preparedIntervals[preparedIntervals.length - 1].maxDepth) + 0.1) * 10) / 10, maxDepth, structureItems: [{ value: '-1', checked: false, label: '', imageUrl: '' }] }]
      : preparedIntervals;

    return correctedIntervals.reduce((acc, interval) => {
      const dimension = Math.abs(Math.round((interval.maxDepth - interval.minDepth) / 0.1 + 1));
      const currentValue = interval.structureItems
        .reduce((currentValueAcc, item) =>
          (item.checked ? [...currentValueAcc, Number(item.value)] : currentValueAcc), []);
      return [...acc, ...Array(dimension).fill(currentValue[0] ? currentValue[0] : -9999)];
    }, []);
  }
  return [];
};

const getCurveOrNotesFromNotesArray = (notes: INote[], depthArray: number[]): number[] => {
  if (notes && notes.length > 0) {
    const minDepth = Math.min(...depthArray);
    const maxDepth = Math.max(...depthArray);
    const preparedIntervals = notes
      .reduce((acc, item, index) => {
        if (index === 0) {
          if (Number(item.minDepth) > Number(minDepth)) {
            return [
              ...acc,
              { minDepth, maxDepth: Math.round((Number(item.minDepth) - 0.1) * 10) / 10, noteText: '' },
              item,
            ];
          }
          return [...acc, item];
        }

        const lastAccElement = acc.length > 0 ? acc[acc.length - 1] : { maxDepth: 3000 };

        if (Number(lastAccElement.maxDepth) < Number(item.minDepth)) {
          return [
            ...acc,
            { minDepth: Math.round((Number(lastAccElement.maxDepth) + 0.1) * 10) / 10, maxDepth: Math.round((Number(item.minDepth) - 0.1) * 10) / 10, noteText: '' },
            item,
          ];
        }
        return [
          ...acc,
          { ...item, minDepth: Math.round((Number(item.minDepth) + 0.1) * 10) / 10 },
        ];
      }, []);

    const correctedIntervals = Number(preparedIntervals[preparedIntervals
      .length - 1].maxDepth) < maxDepth
      ? [...preparedIntervals, { minDepth: Number(preparedIntervals[preparedIntervals.length - 1].maxDepth) + 0.1, maxDepth, noteText: '' }]
      : preparedIntervals;

    return correctedIntervals.reduce((acc, interval) => {
      const dimension = Math.round(((interval.maxDepth - interval.minDepth) / 0.1) + 1);
      return [...acc, ...Array(Math.abs(dimension)).fill(interval.noteText === '' ? -9999 : Number(interval.noteText))];
    }, []);
  }
  return [];
};

const connectedComponent = connect<IStateProps, ActionProps, {}>(mapState,
  mapDispatch)(CurvesDownloadComponent);
const CurvesDownload = withTranslation()(connectedComponent);

export { CurvesDownload };
