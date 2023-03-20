import React, { RefObject } from 'react';
import block from 'bem-cn';
import uuid from 'uuid';
import { Badge } from 'consta-uikit-fork/Badge';

import { ILevel, ISameChartSettings, ICurves, IChartsPopoversSettings, IChartsVisibilities } from 'shared/types/models';
import { DIAGRAM_UNITS } from 'shared/constants';

import './MultiChart.scss';


interface IProps {
  researchData: ICurves;
  calculatedCurves: ICurves;
  calculatedCurvesForTab: ICurves;
  chartsSettings: IChartsPopoversSettings;
  chartsVisibilities: IChartsVisibilities;
  settings?: ISameChartSettings;
  levels?: ILevel[];
  cursor?: { position: [number, number], visible: boolean };
}

const b = block('chart');
const forbiddenCurves = ['DEPTH', 'PORO', 'SW', 'PERM'];

class MultiChart extends React.Component<IProps> {
  private chartCanvasRef: RefObject<HTMLCanvasElement> = React.createRef();

  public componentDidMount() {
    const { researchData, calculatedCurves, calculatedCurvesForTab, chartsSettings,
      chartsVisibilities, settings = {} } = this.props;
    this.drawChart(researchData, calculatedCurves, calculatedCurvesForTab, chartsSettings,
      chartsVisibilities, settings);
  }

  public componentDidUpdate() {
    const { researchData, calculatedCurves, calculatedCurvesForTab, chartsSettings,
      chartsVisibilities, settings = {} } = this.props;
    this.drawChart(researchData, calculatedCurves, calculatedCurvesForTab, chartsSettings,
      chartsVisibilities, settings);
  }

  public render() {
    const {
      settings = {},
      levels = [],
      cursor,
      researchData,
    } = this.props;
    const {
      header = 'Same chart',
      fieldSize = [160, 700],
    } = settings;
    const stepY = fieldSize[1] / researchData.DEPTH.length;

    return (
      <div className={b()}>
        <div className={b('header')}>
          {header && (
            <div className={b('header-wrapper')}>
              <Badge label={header} />
            </div>
          )}
        </div>
        <div className={b('scale-units')}>
          {DIAGRAM_UNITS[header]
            ? DIAGRAM_UNITS[header]
            : ''}
        </div>
        <div className={b('scale-labels')}>
          <div className={b('scale-labels-item')} />
          <div className={b('scale-labels-item', { marked: true })} />
          <div className={b('scale-labels-item')} />
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
        </div>
      </div>
    );
  }

  private drawChart(researchData: ICurves, calculatedCurves: ICurves,
    calculatedCurvesForTab: ICurves, chartsSettings: IChartsPopoversSettings,
    chartsVisibilities: IChartsVisibilities, settings: ISameChartSettings) {
    const canvas = this.chartCanvasRef.current;
    const ctx = canvas?.getContext('2d');

    const {
      fieldSize = [160, 700],
      lineWidth = 1,
      gridStep = 20,
      gridColor = 'rgba(0, 0, 0, 0.2)',
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

      if (researchData) {
        Object.keys(researchData).forEach((item, index) => {
          if (chartsVisibilities.main[index] && !forbiddenCurves.includes(item)) {
            const isDiscreteChart = [...new Set(researchData[item])].length === 2;
            const ratio = isDiscreteChart
              ? 0
              : Math.abs((Math.max(...researchData[item]) - Math.min(...researchData[item]))) / 20;
            const minValue = Math.min(...researchData[item]) - ratio;
            const maxValue = Math.max(...researchData[item]) + ratio;
            const constraintLeft = chartsSettings.main[index].constraint.left;
            const constraintRight = chartsSettings.main[index].constraint.right;
            const { isConstraintSet, isLogarithmic, chartColor } = chartsSettings.main[index];
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
            const stepY = fieldSize[1] / researchData[item].length;
            ctx.lineWidth = lineWidth;

            // построение линии
            ctx.beginPath();
            ctx.strokeStyle = chartColor;
            let counter = 1;

            const initialX = isLogarithmic
              ? (Math.log(researchData[item][0]) - restrictionLeft) * stepX
              : (researchData[item][0] - restrictionLeft) * stepX;
            ctx.moveTo(initialX, 0);
            for (let i = 1; i < fieldSize[1]; i += stepY) {
              const currentX = isLogarithmic
                ? (Math.log(researchData[item][counter]) - restrictionLeft) * stepX
                : (researchData[item][counter] - restrictionLeft) * stepX;
              ctx.lineTo(currentX, i);
              if (isDiscreteChart) {
                ctx.moveTo(restrictionLeft, i);
              }
              counter += 1;
            }

            ctx.stroke();
          }
        });
      }

      if (calculatedCurves) {
        Object.keys(calculatedCurves).forEach((item, index) => {
          if (chartsVisibilities.user[index]) {
            const isDiscreteChart = [...new Set(calculatedCurves[item])].length === 2;
            const ratio = isDiscreteChart
              ? 0
              : Math.abs((Math.max(...calculatedCurves[item]) - Math
                .min(...calculatedCurves[item]))) / 20;
            const minValue = Math.min(...calculatedCurves[item]) - ratio;
            const maxValue = Math.max(...calculatedCurves[item]) + ratio;
            const constraintLeft = chartsSettings.user[index].constraint.left;
            const constraintRight = chartsSettings.user[index].constraint.right;
            const { isConstraintSet, isLogarithmic, chartColor } = chartsSettings.user[index];
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
            const stepY = fieldSize[1] / calculatedCurves[item].length;
            ctx.lineWidth = lineWidth;

            // построение линии
            ctx.beginPath();
            ctx.strokeStyle = chartColor;
            let counter = 1;

            const initialX = isLogarithmic
              ? (Math.log(calculatedCurves[item][0]) - restrictionLeft) * stepX
              : (calculatedCurves[item][0] - restrictionLeft) * stepX;
            ctx.moveTo(initialX, 0);
            for (let i = 1; i < fieldSize[1]; i += stepY) {
              const currentX = isLogarithmic
                ? (Math.log(calculatedCurves[item][counter]) - restrictionLeft) * stepX
                : (calculatedCurves[item][counter] - restrictionLeft) * stepX;
              ctx.lineTo(currentX, i);
              if (isDiscreteChart) {
                ctx.moveTo(restrictionLeft, i);
              }
              counter += 1;
            }

            ctx.stroke();
          }
        });
      }

      if (calculatedCurvesForTab) {
        Object.keys(calculatedCurvesForTab).forEach((item, index) => {
          if (chartsVisibilities.userForTab[index]) {
            const isDiscreteChart = [...new Set(calculatedCurvesForTab[item])].length === 2;
            const ratio = isDiscreteChart
              ? 0
              : Math.abs((Math.max(...calculatedCurvesForTab[item]) - Math
                .min(...calculatedCurvesForTab[item]))) / 20;
            const minValue = Math.min(...calculatedCurvesForTab[item]) - ratio;
            const maxValue = Math.max(...calculatedCurvesForTab[item]) + ratio;
            const constraintLeft = chartsSettings.userForTab[index].constraint.left;
            const constraintRight = chartsSettings.userForTab[index].constraint.right;
            const { isConstraintSet, isLogarithmic, chartColor } = chartsSettings.userForTab[index];
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
            const stepY = fieldSize[1] / calculatedCurvesForTab[item].length;
            ctx.lineWidth = lineWidth;

            // построение линии
            ctx.beginPath();
            ctx.strokeStyle = chartColor;
            let counter = 1;

            const initialX = isLogarithmic
              ? (Math.log(calculatedCurvesForTab[item][0]) - restrictionLeft) * stepX
              : (calculatedCurvesForTab[item][0] - restrictionLeft) * stepX;
            ctx.moveTo(initialX, 0);
            for (let i = 1; i < fieldSize[1]; i += stepY) {
              const currentX = isLogarithmic
                ? (Math.log(calculatedCurvesForTab[item][counter]) - restrictionLeft) * stepX
                : (calculatedCurvesForTab[item][counter] - restrictionLeft) * stepX;
              ctx.lineTo(currentX, i);
              if (isDiscreteChart) {
                ctx.moveTo(restrictionLeft, i);
              }
              counter += 1;
            }

            ctx.stroke();
          }
        });
      }
    }
  }
}

export { MultiChart };
