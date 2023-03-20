import { ICurves } from 'shared/types/models';

const getFirstCheckedCurveFromStates = (states: { [key: string]: { [key: string]: any }},
  index: string, calculatedCurvesForTab: { [key: string]: ICurves }): number[] => {
  const positionIndex = states && states[index]
    && states[index].chartsVisibilities
    ? states[index].chartsVisibilities.userForTab
      .findIndex((item: boolean) => item === true)
    : -1;
  const curveKey = calculatedCurvesForTab[index]
    ? Object.keys(calculatedCurvesForTab[index])[positionIndex]
    : 'none';
  return calculatedCurvesForTab && calculatedCurvesForTab[index]
  && curveKey && calculatedCurvesForTab[index][curveKey]
    ? calculatedCurvesForTab[index][curveKey]
    : [];
};

export { getFirstCheckedCurveFromStates };
