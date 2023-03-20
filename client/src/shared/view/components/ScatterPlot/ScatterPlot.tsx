import React, { RefObject } from 'react';
import block from 'bem-cn';
import { Badge } from 'consta-uikit-fork/Badge';

import { ICoreData, ISameChartSettings, CoreType } from 'shared/types/models';
import { TranslateFunction, tKeys } from 'services/i18n';

import './ScatterPlot.scss';


interface IProps {
  firstDataChannel: number[];
  secondDataChannel: ICoreData[];
  curveName?: string;
  coreType?: CoreType;
  settings?: ISameChartSettings;
  t: TranslateFunction;
}

const b = block('scatter-plot');
const { shared: sharedIntl } = tKeys;

class ScatterPlot extends React.PureComponent<IProps> {
  private chartCanvasRef: RefObject<HTMLCanvasElement> = React.createRef();

  public componentDidMount() {
    this.redrawScatterPlot();
  }

  public componentDidUpdate() {
    this.redrawScatterPlot();
  }

  public render() {
    const {
      settings = {},
      curveName,
      t,
    } = this.props;
    const {
      header = t(sharedIntl.scatterPlot),
    } = settings;

    return (
      <div className={b()}>
        <div className={b('header')}>
          {header && (
            <div className={b('header-wrapper')}>
              <Badge label={header} />
            </div>
          )}
        </div>
        <div className={b('scale-units')} />
        <div className={b('scale-labels')}>
          <div className={b('scale-labels-item')}>
            {curveName}
          </div>
          <div className={b('scale-labels-item')} />
        </div>
        <div className={b('sheet')}>
          <canvas className={b('canvas-sheet')} ref={this.chartCanvasRef} />
          <div className={b('sheet-low-label')}>
            {t(sharedIntl.core)}
          </div>
        </div>
      </div>
    );
  }

  private redrawScatterPlot(): void {
    const { firstDataChannel, secondDataChannel, settings = {}, coreType = 'porosity' } = this.props;
    const scatterPlotData = firstDataChannel.reduce((acc, element, index) => {
      if (secondDataChannel[index][coreType] > 0 && secondDataChannel[index].isVisible) {
        return {
          x: [...acc.x, secondDataChannel[index][coreType]],
          y: [...acc.y, element],
          ids: [...acc.ids, secondDataChannel[index].id],
        };
      }
      return acc;
    }, { x: [], y: [], ids: [] });
    this.drawScatterPlot(scatterPlotData.x, scatterPlotData.y, scatterPlotData.ids, settings);
  }

  private drawScatterPlot(x: number[], y: number[], ids: number[],
    settings: ISameChartSettings): void {
    const canvas = this.chartCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    const {
      fieldSize = [700, 700],
      lineColor = '#0f0',
      lineWidth = 2,
      gridStep = 20,
      gridColor = 'rgba(0, 0, 0, 0.2)',
      dotColor = 'rgba(0, 0, 0, 0.2)',
    } = settings;
    const correctedXMinValue = Math.min(...x) < 0 ? 0 : Math.min(...x);
    const correctedYMinValue = Math.min(...y) < 0 ? 0 : Math.min(...y);
    const ratioX = (Math.max(...x) - correctedXMinValue) / 20;
    const ratioY = (Math.max(...y) - correctedYMinValue) / 20;
    const xMinValue = (Math.min(...x) - ratioX) < 0 ? 0 : (Math.min(...x) - ratioX);
    const xMaxValue = Math.max(...x) + ratioX;
    const yMinValue = (Math.min(...y) - ratioY) < 0 ? 0 : (Math.min(...y) - ratioY);
    const yMaxValue = Math.max(...y) + ratioY;

    const size = y.length;
    const sum = y.reduce((acc, item) => acc + item, 0);
    const mean = sum / size;
    const temp = y.reduce((acc, item) => acc + (item - mean) ** 2, 0);
    const variance = Math.round((temp * 100) / (size - 1)) / 100;

    if (canvas && ctx) {
      [canvas.width, canvas.height] = fieldSize;

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = lineWidth;
      const stepX = fieldSize[0] / (xMaxValue - xMinValue);
      const stepY = fieldSize[1] / (yMaxValue - yMinValue);
      const trendLineParams = findTrendLineParametersByLeastSquares(x, y);
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // построение сетки и шкал
      for (let i = 0; i <= fieldSize[0]; i += gridStep) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, fieldSize[1]);
        if (i % 40 === 0 && i !== 0 && i !== fieldSize[0]) {
          ctx.fillText(`${Math.round((i / stepX + xMinValue) * 10) / 10}`, i, fieldSize[1] - 20);
        }
      }

      for (let i = fieldSize[1]; i >= 0; i -= gridStep) {
        ctx.moveTo(0, i);
        ctx.lineTo(fieldSize[0], i);
        if ((fieldSize[1] - i) % 40 === 0 && i !== 0 && i !== fieldSize[1]) {
          ctx.fillText(`${Math.round((((fieldSize[1] - i) / stepY) + yMinValue) * 10) / 10}`, 20, i);
        }
      }

      ctx.stroke();

      // обводка контура
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.moveTo(0, 0);
      ctx.lineTo(0, fieldSize[1]);
      ctx.moveTo(fieldSize[0], 0);
      ctx.lineTo(fieldSize[0], fieldSize[1]);
      ctx.moveTo(0, fieldSize[1]);
      ctx.lineTo(fieldSize[0], fieldSize[1]);
      ctx.stroke();

      // построение линии тренда
      ctx.beginPath();
      ctx.strokeStyle = lineColor;

      const x1 = xMinValue;
      const y1 = x1 * trendLineParams.m + trendLineParams.b;
      const x2 = xMaxValue;
      const y2 = x2 * trendLineParams.m + trendLineParams.b;

      ctx.moveTo((x1 - xMinValue) * stepX, fieldSize[1] - (y1 - yMinValue) * stepY);
      ctx.lineTo((x2 - xMinValue) * stepX, fieldSize[1] - (y2 - yMinValue) * stepY);
      ctx.stroke();

      // построение точек
      x.forEach((xValue, index) => {
        const yValue = y[index];
        ctx.beginPath();
        ctx.fillStyle = dotColor;
        ctx.arc((xValue - xMinValue) * stepX, fieldSize[1] - (yValue - yMinValue) * stepY,
          5, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(`${ids[index] + 1}`, (xValue - xMinValue) * stepX, fieldSize[1] - (yValue - yMinValue) * stepY);
      });

      const { t } = this.props;
      // данные диаграммы
      ctx.fillStyle = 'black';
      ctx.textAlign = 'end';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(`R^2: ${Math.round(trendLineParams.r2 * 10000) / 10000}, ${t(sharedIntl.samplesNumber)}: ${y.length}, D: ${
        variance}, ${t(sharedIntl.trendLine)}: y = ${Math.round(trendLineParams.m * 10000) / 10000} * x + ${Math.round(trendLineParams.b * 10000) / 10000}`, fieldSize[0] - 20, 10);
    }
  }
}

const findTrendLineParametersByLeastSquares = (x: number[], y: number[]):
{ [key: string]: number } => {
  const n = y.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for (let i = 0; i < n; i += 1) {
    sumX += x[i];
    sumY += y[i];
    sumXY += (x[i] * y[i]);
    sumXX += (x[i] * x[i]);
    sumYY += (y[i] * y[i]);
  }

  // y = x * m + a
  const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const a = (sumY - m * sumX) / n;
  const r2 = ((n * sumXY - sumX * sumY)
    / Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))) ** 2;

  return { m, b: a, r2 };
};

export { ScatterPlot };
