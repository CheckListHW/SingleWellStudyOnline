import React, { RefObject } from 'react';
import block from 'bem-cn';
import uuid from 'uuid';
import { Badge } from 'consta-uikit-fork/Badge';
import { IconSettings } from 'consta-uikit-fork/IconSettings';

import { ILevel, ISameChartSettings } from 'shared/types/models';
import { TranslateFunction, tKeys } from 'services/i18n';
import { ButtonWithTooltip } from 'shared/view/elements/ButtonWithTooltip/ButtonWithTooltip';
import { DIAGRAM_UNITS } from 'shared/constants';

import { Menu } from './elements/Menu/Menu';
import './Chart.scss';


interface IProps {
  data: number[];
  secondChannelData?: number[];
  settings?: ISameChartSettings;
  isLogarithmic?: boolean;
  levels?: ILevel[];
  cursor?: { position: [number, number], visible: boolean };
  verticalCursor?: { position: [number, number], visible: boolean };
  constraintLeft?: number;
  constraintRight?: number;
  isConstraintSet?: boolean;
  isChartWithoutControls?: boolean;
  clayLineValue?: number;
  sandLineValue?: number;
  t: TranslateFunction;
  onChangeColorButtonClickHandler?(color: string): void;
  onCheckboxChangeHandler?(leftConstraintValue: number, rightConstraintValue: number): void;
  onIsLogarithmicCheckboxChangeHandler?(): void;
}

const b = block('chart');
const { chart: intl } = tKeys;

class Chart extends React.Component<IProps> {
  private chartCanvasRef: RefObject<HTMLCanvasElement> = React.createRef();

  public componentDidMount() {
    const { data, settings = {}, constraintLeft = 0, constraintRight = 10,
      isConstraintSet = false, secondChannelData = [] } = this.props;
    this.drawChart(data, settings, constraintLeft,
      constraintRight, isConstraintSet, secondChannelData);
  }

  public componentDidUpdate() {
    const { data, settings = {}, constraintLeft = 0, constraintRight = 10,
      isConstraintSet = false, secondChannelData = [] } = this.props;
    this.drawChart(data, settings, constraintLeft,
      constraintRight, isConstraintSet, secondChannelData);
  }

  public render() {
    const {
      settings = {},
      data,
      levels = [],
      cursor,
      verticalCursor,
      isChartWithoutControls,
      isConstraintSet,
      constraintLeft,
      constraintRight,
      clayLineValue,
      sandLineValue,
      isLogarithmic,
      onChangeColorButtonClickHandler,
      onIsLogarithmicCheckboxChangeHandler,
      onCheckboxChangeHandler,
      t,
    } = this.props;
    const {
      fieldSize = [160, 700],
      header = 'Dia',
    } = settings;
    const ratio = data
      ? Math.abs((Math.max(...data) - Math.min(...data))) / 20
      : 0;
    const minValue = data
      ? Math.min(...data) - ratio
      : 0;
    const maxValue = data
      ? Math.max(...data) + ratio
      : 0;
    const stepY = data
      ? fieldSize[1] / data.length
      : 1;
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
    const stepX = fieldSize[0] / Math.abs(restrictionRight - restrictionLeft);
    const uniqueNumbersArrayLength = [...new Set(data)].length;
    const isDiscreteChart = data
      ? uniqueNumbersArrayLength === 2
      : false;
    const minLabelValue = Number.isFinite(Math.round(minValue * 10) / 10)
      ? Math.round(minValue * 10) / 10
      : 0;
    const maxLabelValue = Number.isFinite(Math.round(maxValue * 10) / 10)
      ? Math.round(maxValue * 10) / 10
      : 0;
    const minimalLabelValue = isLogarithmic && minLabelValue < 0 ? 0 : minLabelValue;
    const leftLabel = isConstraintSet
      ? constraintLeft
      : minimalLabelValue;
    const rightLabel = isConstraintSet
      ? constraintRight
      : maxLabelValue;
    const isClayLineBetweenBoundaries = isLogarithmic
      ? clayLineValue && ((Math.log(clayLineValue) - restrictionLeft) * stepX - 1) > 0
        && ((Math.log(clayLineValue) - restrictionLeft) * stepX - 1) < fieldSize[0]
      : clayLineValue && ((clayLineValue - restrictionLeft) * stepX - 1) > 0
        && ((clayLineValue - restrictionLeft) * stepX - 1) < fieldSize[0];
    const isSandLineBetweenBoundaries = isLogarithmic
      ? sandLineValue && ((Math.log(sandLineValue) - restrictionLeft) * stepX - 1) > 0
        && ((Math.log(sandLineValue) - restrictionLeft) * stepX - 1) < fieldSize[0]
      : sandLineValue && ((sandLineValue - restrictionLeft) * stepX - 1) > 0
        && ((sandLineValue - restrictionLeft) * stepX - 1) < fieldSize[0];

    return (
      <div className={b()}>
        <div className={b('header')}>
          {header && (
            <div className={b('header-wrapper')}>
              <Badge label={header} status={isConstraintSet || isLogarithmic ? 'error' : 'normal'} />
            </div>
          )}
          {!isChartWithoutControls && (
            <ButtonWithTooltip
              iconLeft={IconSettings}
              onlyIcon
              type="button"
              size="xs"
              tooltipProps={{
                content: (
                  <Menu
                    minDataValue={calculateMinValue(data)}
                    maxDataValue={calculateMaxValue(data)}
                    isLogarithmic={isLogarithmic}
                    constraintLeft={constraintLeft}
                    constraintRight={constraintRight}
                    isConstraintSet={isConstraintSet}
                    color={settings && settings.lineColor ? settings.lineColor : '#0f0'}
                    t={t}
                    onChangeColorButtonClickHandler={onChangeColorButtonClickHandler}
                    onCheckboxChangeHandler={onCheckboxChangeHandler}
                    onIsLogarithmicCheckboxChangeHandler={onIsLogarithmicCheckboxChangeHandler}
                  />
                ),
                mode: 'click',
                direction: 'downCenter',
              }}
            />
          )}
        </div>
        <div className={b('scale-units')}>
          {DIAGRAM_UNITS[header]
            ? DIAGRAM_UNITS[header]
            : ''}
        </div>
        <div className={b('scale-labels')}>
          <div className={b('scale-labels-item')}>
            {isDiscreteChart ? '' : leftLabel}
          </div>
          <div className={b('scale-labels-item', { marked: true })}>
            {isLogarithmic ? t(intl.logarithmic) : null}
          </div>
          <div className={b('scale-labels-item')}>
            {isDiscreteChart ? '' : rightLabel}
          </div>
        </div>
        <div className={b('sheet')}>
          <canvas className={b('canvas-sheet')} ref={this.chartCanvasRef} />
          {cursor && cursor.visible && (
            <div
              className={b('horizontal-line')}
              style={{ top: cursor.position[1] - 1 }}
              key={uuid()}
            />
          )}
          {levels?.map((level: ILevel) => (
            <div
              className={b('horizontal-line')}
              style={{
                top: level.position[1] * stepY - 1,
                border: `${level.width ? level.width : 1}px solid ${level.color}`,
              }}
              key={uuid()}
            />
          ))}
          {verticalCursor && verticalCursor.visible && (
            <div
              className={b('vertical-line')}
              style={{ left: verticalCursor.position[0] - 1 }}
              key={uuid()}
            />
          )}
          {clayLineValue !== undefined && isClayLineBetweenBoundaries && (
            <div
              className={b('vertical-line', { type: 'clay' })}
              style={{
                left: isLogarithmic
                  ? (Math.log(clayLineValue) - restrictionLeft) * stepX - 1
                  : (clayLineValue - restrictionLeft) * stepX - 1,
              }}
              key={uuid()}
            />
          )}
          {sandLineValue && isSandLineBetweenBoundaries && (
            <div
              className={b('vertical-line', { type: 'sand' })}
              style={{
                left: isLogarithmic
                  ? (Math.log(sandLineValue) - restrictionLeft) * stepX - 1
                  : (sandLineValue - restrictionLeft) * stepX - 1,
              }}
              key={uuid()}
            />
          )}
        </div>
      </div>
    );
  }

  private drawChart(data: number[] | undefined, settings: ISameChartSettings,
    constraintLeft: number, constraintRight: number, isConstraintSet: boolean,
    secondChannelData?: number[]) {
    const canvas = this.chartCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    const { isLogarithmic } = this.props;
    const {
      fieldSize = [160, 700],
      lineColor = '#0f0',
      lineWidth = 1,
      gridStep = 20,
      gridColor = 'rgba(0, 0, 0, 0.2)',
      dotColor = 'rgba(0, 0, 0, 0.2)',
    } = settings;

    if (canvas && ctx) {
      [canvas.width, canvas.height] = fieldSize;

      ctx.strokeStyle = gridColor;

      // построение сетки
      for (let i = 0; i <= fieldSize[0]; i += gridStep) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, fieldSize[1]);
      }

      for (let i = 0; i <= fieldSize[1]; i += gridStep) {
        ctx.moveTo(0, i);
        ctx.lineTo(fieldSize[0], i);
      }

      ctx.stroke();

      // обводка контура
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.moveTo(0, 0);
      ctx.lineTo(0, fieldSize[1]);
      ctx.moveTo(fieldSize[0], 0);
      ctx.lineTo(fieldSize[0], fieldSize[1]);
      ctx.stroke();

      if (data) {
        const isDiscreteChart = [...new Set(data)].length === 2;
        const ratio = isDiscreteChart
          ? 0
          : Math.abs((Math.max(...data) - Math.min(...data))) / 20;
        const minValue = Math.min(...data) - ratio;
        const maxValue = Math.max(...data) + ratio;
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
        const stepX = fieldSize[0] / Math.abs(restrictionRight - restrictionLeft);
        const stepY = fieldSize[1] / data.length;
        ctx.lineWidth = lineWidth;

        // построение линии
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        let counter = 1;

        const initialX = isLogarithmic
          ? (Math.log(data[0]) - restrictionLeft) * stepX
          : (data[0] - restrictionLeft) * stepX;
        ctx.moveTo(initialX, 0);
        for (let i = 1; i < fieldSize[1]; i += stepY) {
          const currentX = isLogarithmic
            ? (Math.log(data[counter]) - restrictionLeft) * stepX
            : (data[counter] - restrictionLeft) * stepX;
          ctx.lineTo(currentX, i);
          if (isDiscreteChart) {
            ctx.moveTo(restrictionLeft, i);
          }
          counter += 1;
        }

        ctx.stroke();

        // построение точек
        if (secondChannelData) {
          let secondCounter = 0;

          for (let i = 0; i < fieldSize[1]; i += stepY) {
            const x = isLogarithmic
              ? (Math.log(secondChannelData[secondCounter]) - restrictionLeft) * stepX
              : (secondChannelData[secondCounter] - restrictionLeft) * stepX;
            if (x > 0) {
              ctx.beginPath();
              ctx.fillStyle = dotColor;
              ctx.arc(x, i, 2, 0, 2 * Math.PI, true);
              ctx.fill();
            }
            secondCounter += 1;
          }
        }
      }
    }
  }
}

const calculateMinValue = (data: number[]): number => {
  if (!data) {
    return 0;
  }
  const correctedMinValue = Math.min(...data) < 0 ? 0 : Math.min(...data);
  const ratio = (Math.max(...data) - correctedMinValue) / 20;
  return Math.round(((Math.min(...data) - ratio) < 0
    ? 0
    : (Math.min(...data) - ratio)) * 10) / 10;
};

const calculateMaxValue = (data: number[]): number => {
  if (!data) {
    return 0;
  }
  const correctedMinValue = Math.min(...data) < 0 ? 0 : Math.min(...data);
  const ratio = (Math.max(...data) - correctedMinValue) / 20;
  return Math.round((Math.max(...data) + ratio) * 10) / 10;
};

export { Chart };
