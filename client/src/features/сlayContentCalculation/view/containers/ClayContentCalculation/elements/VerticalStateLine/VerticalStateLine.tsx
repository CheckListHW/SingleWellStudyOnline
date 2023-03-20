import React from 'react';
import block from 'bem-cn';

import { ICurves } from 'shared/types/models';
import { ICursor } from 'shared/types/common';

import './VerticalStateLine.scss';


interface IProps {
  data: ICurves;
  cursor: ICursor;
  chartWidth?: number;
  constraintLeft?: number;
  constraintRight?: number;
  isConstraintSet?: boolean;
  isLogarithmic?: boolean;
}

const b = block('vertical-state-line');

function VerticalStateLine(props: IProps): JSX.Element {
  const { cursor, chartWidth, data, isConstraintSet, constraintLeft,
    constraintRight, isLogarithmic } = props;
  const maxWidth = chartWidth || 160;
  const currentDataKey = Object.keys(data).find(key => key === cursor.chart);
  const verifiedCurrentDataKey = currentDataKey || 'unknown';
  const currentData = data[verifiedCurrentDataKey]
    ? data[verifiedCurrentDataKey] as number[]
    : [1, 2, 3];
  const isDiscreteChart = [...new Set(currentData)].length === 2;
  const ratio = isDiscreteChart
    ? 0
    : Math.abs((Math.max(...currentData) - Math.min(...currentData))) / 20;
  const minValue = Math.min(...currentData) - ratio;
  const maxValue = Math.max(...currentData) + ratio;
  const logarithmicLeftRestriction = isConstraintSet && constraintLeft !== undefined
    ? Math.log(constraintLeft <= 0 ? 1 : constraintLeft)
    : Math.log(minValue <= 0 ? 1 : minValue);
  const notLogarithmicLeftRestriction = isConstraintSet && constraintLeft !== undefined
    ? constraintLeft
    : minValue;
  const restrictionLeft = isLogarithmic
    ? logarithmicLeftRestriction
    : notLogarithmicLeftRestriction;
  const logarithmicRightRestriction = isConstraintSet && constraintRight !== undefined
    ? Math.log(constraintRight)
    : Math.log(maxValue);
  const notLogarithmicRightRestriction = isConstraintSet && constraintRight !== undefined
    ? constraintRight
    : maxValue;
  const restrictionRight = isLogarithmic
    ? logarithmicRightRestriction
    : notLogarithmicRightRestriction;
  const stepX = maxWidth / Math.abs(restrictionRight - restrictionLeft);
  const lineValue = isLogarithmic
    ? Math.round((Math.exp(((cursor.position[0] + 1) / stepX) + restrictionLeft)) * 100) / 100
    : Math.round((((cursor.position[0] + 1) / stepX) + restrictionLeft) * 100) / 100;
  const currentColor = cursor.chartColor ? cursor.chartColor : '#000000';
  const currentName = cursor.chart;

  return (
    <div className={b()}>
      <div className={b('item')}>
        <span style={{ color: currentColor }}>
          {cursor.chart && cursor.chart !== 'depth'
            ? `${currentName}: `
            : 'нет курсора над графиком there is no cursor under chart'}
        </span>
        {cursor.chart && cursor.chart !== 'depth' ? `${lineValue}` : ''}
      </div>
    </div>
  );
}

export { VerticalStateLine };
