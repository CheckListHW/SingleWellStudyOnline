import React from 'react';
import block from 'bem-cn';
import { Badge } from 'consta-uikit-fork/Badge';

import { ISameChartSettings } from 'shared/types/models';

import './InstructionChart.scss';


interface IProps {
  text: string;
  settings?: ISameChartSettings;
}

const b = block('instruction-chart');

function InstructionChart(props: IProps) {
  const { text, settings = {} } = props;
  const {
    fieldSize = [190, 700],
    header = 'Инструкция',
  } = settings;

  return (
    <div className={b()}>
      <div className={b('header')}>
        <div className={b('header-wrapper')}>
          <Badge label={header} />
        </div>
      </div>
      <div className={b('scale-units')} />
      <div className={b('scale-labels')} />
      <div className={b('sheet')} style={{ width: fieldSize[0], height: fieldSize[1] }}>
        <div className={b('sheet-initial-message', { visible: true })}>
          {text}
        </div>
      </div>
    </div>
  );
}

export { InstructionChart };
