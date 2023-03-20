import React from 'react';
import block from 'bem-cn';

import { ICurves, IChartsVisibilities, IChartsPopoversSettings } from 'shared/types/models';
import { getDepth } from 'shared/helpers';

import './StateLine.scss';


interface IProps {
  data: ICurves;
  calculatedCurvesData?: ICurves;
  calculatedCurvesDataForTab?: ICurves;
  chartsVisibilities: IChartsVisibilities;
  chartSettings: IChartsPopoversSettings;
  cursorPositionByY: number;
  dataLength: number;
  fieldSize: [number, number];
}

const b = block('state-line');

function StateLine(props: IProps) {
  const { data, calculatedCurvesData, calculatedCurvesDataForTab, cursorPositionByY,
    dataLength, chartsVisibilities, fieldSize, chartSettings } = props;
  const dataKeys = Object.keys(data);
  const calculatedCurvesDataKeys = calculatedCurvesData
    ? Object.keys(calculatedCurvesData)
    : [];
  const calculatedCurvesDataForTabKeys = calculatedCurvesDataForTab
    ? Object.keys(calculatedCurvesDataForTab)
    : [];

  return (
    <div className={b()}>
      {dataKeys.map((key: string, index: number) => {
        if (key !== 'PORO' && key !== 'SW' && key !== 'PERM') {
          const currentDataArray = data[key];
          const currentData = currentDataArray
            ? currentDataArray[getDepth([0, cursorPositionByY], dataLength, fieldSize)] as number
            : -9999;
          const currentColor = chartSettings.main[index].chartColor;
          if (chartsVisibilities.main[index]) {
            return (
              <div className={b('item')} key={key}>
                <span style={{ color: currentColor }}>
                  {`${key}: `}
                </span>
                {`${Math.round(currentData * 10) / 10}`}
              </div>
            );
          }
        }
        return null;
      })}
      {calculatedCurvesData && calculatedCurvesDataKeys.map((key: string, index: number) => {
        if (key !== 'PORO' && key !== 'SW' && key !== 'PERM') {
          const currentDataArray = calculatedCurvesData[key];
          const currentData = currentDataArray
            ? currentDataArray[getDepth([0, cursorPositionByY], dataLength, fieldSize)] as number
            : -9999;
          const currentColor = chartSettings.user[index].chartColor;
          if (chartsVisibilities.user[index]) {
            return (
              <div className={b('item')} key={key}>
                <span style={{ color: currentColor }}>
                  {`${key}: `}
                </span>
                {`${Math.round(currentData * 10) / 10}`}
              </div>
            );
          }
        }
        return null;
      })}
      {calculatedCurvesDataForTab && calculatedCurvesDataForTabKeys
        .map((key: string, index: number) => {
          if (key !== 'PORO' && key !== 'SW' && key !== 'PERM') {
            const currentDataArray = calculatedCurvesDataForTab[key];
            const currentData = currentDataArray
              ? currentDataArray[getDepth([0, cursorPositionByY],
                dataLength, fieldSize)] as number
              : -9999;
            const currentColor = chartSettings.userForTab[index].chartColor;
            if (chartsVisibilities.userForTab[index]) {
              return (
                <div className={b('item')} key={key}>
                  <span style={{ color: currentColor }}>
                    {`${key}: `}
                  </span>
                  {`${Math.round(currentData * 10) / 10}`}
                </div>
              );
            }
          }
          return null;
        })}
    </div>
  );
}

export { StateLine };
