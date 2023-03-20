import React, { RefObject } from 'react';
import block from 'bem-cn';
import uuid from 'uuid';
import { Badge } from 'consta-uikit-fork/Badge';
import { Button } from 'consta-uikit-fork/Button';
import { IconClose } from 'consta-uikit-fork/IconClose';

import { ILevel, ISameChartSettings } from 'shared/types/models';
import { DIAGRAM_UNITS } from 'shared/constants';

import './DepthChart.scss';


interface IProps {
  data: number[];
  settings?: ISameChartSettings;
  levels?: ILevel[];
  cursor?: { position: [number, number], visible: boolean };
  onDeleteLevelButtonClickHandler?(id: string): void;
}

const b = block('depth-chart');

class DepthChart extends React.Component<IProps> {
  private depthChartCanvasRef: RefObject<HTMLCanvasElement> = React.createRef();

  public componentDidMount() {
    const { data, settings = {} } = this.props;
    this.drawChart(data, settings);
  }

  public componentDidUpdate() {
    const { data, settings = {} } = this.props;
    this.drawChart(data, settings);
  }

  public render() {
    const {
      data,
      settings = {},
      levels = [],
      cursor,
      onDeleteLevelButtonClickHandler,
    } = this.props;
    const {
      fieldSize = [90, 700],
      header = 'Depth',
    } = settings;
    const stepY = fieldSize[1] / data.length;

    return (
      <div className={b()}>
        <div className={b('header')}>
          {header
            && <Badge label={header} status="success" />}
        </div>
        <div className={b('scale-units')}>
          {DIAGRAM_UNITS[header]
            ? DIAGRAM_UNITS[header]
            : ''}
        </div>
        <div className={b('scale-labels')} />
        <div className={b('sheet')}>
          <canvas className={b('canvas-sheet')} ref={this.depthChartCanvasRef} />
          {cursor && cursor.visible && (
            <div
              className={b('horizontal-line')}
              style={{ top: cursor.position[1] - 1, background: 'none', borderRadius: 0 }}
              key={uuid()}
            />
          )}
          {levels?.map((level: ILevel) => (
            <div
              className={b('horizontal-line')}
              style={{
                top: level.position[1] * stepY - 1,
                padding: '0.1rem',
                border: 'none',
                borderTop: `1px solid ${level.color}`,
              }}
              key={uuid()}
            >
              <div className={b('horizontal-line-wrap')}>
                <span>{level.name}</span>
                <span>{level.data.DEPTH}</span>
              </div>
              {onDeleteLevelButtonClickHandler && (
                <Button
                  iconLeft={IconClose}
                  size="xs"
                  onlyIcon
                  onClick={() => this.onDeleteLevelButtonClick(level.id)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  private onDeleteLevelButtonClick(id: string) {
    const { onDeleteLevelButtonClickHandler } = this.props;
    if (onDeleteLevelButtonClickHandler) {
      onDeleteLevelButtonClickHandler(id);
    }
  }

  private drawChart(data: number[], settings: ISameChartSettings) {
    const canvas = this.depthChartCanvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      const {
        fieldSize = [90, 700],
        lineWidth = 1,
        gridStep = 20,
        gridColor = 'rgba(0, 0, 0, 0.8)',
      } = settings;

      [canvas.width, canvas.height] = fieldSize;
      const smallScaleLineWidth = 5;
      const bigScaleLineWidth = 15;
      const textSize = '10px';
      const lastScaleLabelOffset = 9;

      ctx.lineWidth = lineWidth;
      ctx.font = `bold ${textSize} Arial`;
      ctx.textBaseline = 'top';
      ctx.strokeStyle = gridColor;
      let counter = 0;
      const bigGridStep = 5 * gridStep;
      const stepByYAxis = fieldSize[1] / gridStep;
      const step = (Math.max(...data) - Math.min(...data)) / stepByYAxis;

      for (let i = 0; i <= fieldSize[1]; i += gridStep) {
        const depth = Math.round((Math.min(...data) + (counter * step) / gridStep) * 10) / 10;
        if (counter === i) {
          ctx.moveTo(fieldSize[0] - bigScaleLineWidth, i);
          ctx.lineTo(fieldSize[0], i);
          ctx.fillText(String(depth), 5, counter);
          counter += bigGridStep;
        } else {
          ctx.moveTo(fieldSize[0] - smallScaleLineWidth, i);
          ctx.lineTo(fieldSize[0], i);
        }
      }
      ctx.moveTo(fieldSize[0] - bigScaleLineWidth, fieldSize[1] - 1);
      ctx.lineTo(fieldSize[0], fieldSize[1] - 1);
      ctx.fillText(String(Math.max(...data)), 5, fieldSize[1] - lastScaleLabelOffset);

      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.moveTo(fieldSize[0], 0);
      ctx.lineTo(fieldSize[0], fieldSize[1]);
      ctx.stroke();
    }
  }
}

export { DepthChart };
