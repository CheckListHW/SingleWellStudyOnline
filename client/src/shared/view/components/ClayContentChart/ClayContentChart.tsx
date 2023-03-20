import React, { Fragment } from 'react';
import block from 'bem-cn';
import { Badge } from 'consta-uikit-fork/Badge';
import { Button } from 'consta-uikit-fork/Button';
import { IconTrash } from 'consta-uikit-fork/IconTrash';
import { IconClose } from 'consta-uikit-fork/IconClose';

import { IVerticalLevel, ISameChartSettings } from 'shared/types/models';
import { TranslateFunction, tKeys } from 'services/i18n';

import './ClayContentChart.scss';


interface IProps {
  verticalLevels: IVerticalLevel[];
  settings?: ISameChartSettings;
  t: TranslateFunction;
  onDeleteAllLevelsButtonClickHandler?(): void;
  onDeleteLevelButtonClickHandler?(index: number): void;
}

const b = block('clay-content-chart');
const { shaliness: intl } = tKeys.features;

function ClayContentChart(props: IProps) {
  const {
    verticalLevels,
    settings = {},
    t,
    onDeleteAllLevelsButtonClickHandler,
    onDeleteLevelButtonClickHandler,
  } = props;
  const {
    fieldSize = [240, 700],
    header = t(intl.shaliness),
    initialMessage = t(intl.instructionMessage),
  } = settings;

  return (
    <div className={b()}>
      <div className={b('header')}>
        <div className={b('header-wrapper')}>
          <Badge label={header} />
        </div>
        <div className={b('header-wrapper')}>
          {onDeleteAllLevelsButtonClickHandler && (
            <Button size="xs" iconLeft={IconTrash} onlyIcon onClick={onDeleteAllLevelsButtonClickHandler} />
          )}
        </div>
      </div>
      <div className={b('scale-units')} />
      <div className={b('scale-labels')}>
        <div className={b('scale-labels-item')} />
        <div className={b('scale-labels-item')} />
      </div>
      <div className={b('sheet')} style={{ width: fieldSize[0], height: fieldSize[1] }}>
        <div className={b('sheet-initial-message', { visible: verticalLevels.length === 0 })}>
          {initialMessage}
        </div>
        {verticalLevels.map((level: IVerticalLevel, index: number) => (
          <Fragment key={index}>
            <div className={b('content-block')}>
              <span style={{ color: level.chartColor ? level.chartColor : '#0f0' }}>
                {`${level.chart}: `}
              </span>
              <span style={{ color: level.type === 'clay' ? 'red' : 'orange' }}>
                {`${level.type === 'clay' ? `${t(intl.shaleLine)} ` : `${t(intl.sandLine)} `}`}
              </span>
              {`${level.position[0]} `}
              {onDeleteLevelButtonClickHandler && (
                <Button size="xs" iconLeft={IconClose} onlyIcon onClick={() => onDeleteLevelButtonClickHandler(index)} />
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export { ClayContentChart };
