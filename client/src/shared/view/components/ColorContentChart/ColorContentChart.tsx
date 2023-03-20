/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import React from 'react';
import block from 'bem-cn';
import uuid from 'uuid';
import { autobind } from 'core-decorators';
import { Badge } from 'consta-uikit-fork/Badge';
import { Button } from 'consta-uikit-fork/Button';
import { Modal } from 'consta-uikit-fork/Modal';
import { IconCheck } from 'consta-uikit-fork/IconCheck';
import { IconCancel } from 'consta-uikit-fork/IconCancel';
import { IconTrash } from 'consta-uikit-fork/IconTrash';
import { IconAdd } from 'consta-uikit-fork/IconAdd';
import { IconEdit } from 'consta-uikit-fork/IconEdit';

import { CustomSelect } from 'shared/view/elements';
import { FIELD_SIZE } from 'shared/constants';
import { ILevel, INamedInterval, ISameChartSettings } from 'shared/types/models';
import { TranslateFunction, tKeys } from 'services/i18n';

import './ColorContentChart.scss';


interface IProps {
  dataLength: number;
  selectOptions: { value: string; label: string; color: string; imageUrl: string; }[];
  settings?: ISameChartSettings;
  levels?: ILevel[];
  intervals: INamedInterval[];
  withoutEditControls?: boolean;
  t: TranslateFunction;
  onAddIntervalsButtonClickHandler?(): void;
  onDeleteAllIntervalsButtonClickHandler?(): void;
  onSelectChangeHandler?(v: any, currentIntervalId: number): void;
}

interface IState {
  isModalOpen: boolean;
  currentIntervalId: number;
}

const b = block('color-content-chart');
const { shared: sharedIntl } = tKeys;
const { lithology: intl } = tKeys.features;

class ColorContentChart extends React.Component<IProps, IState> {
  public state = { isModalOpen: false, currentIntervalId: 100500 };

  public render() {
    const {
      settings = {},
      levels = [],
      dataLength,
      intervals = [],
      selectOptions,
      withoutEditControls,
      onAddIntervalsButtonClickHandler,
      onDeleteAllIntervalsButtonClickHandler,
      onSelectChangeHandler,
      t,
    } = this.props;
    const { isModalOpen } = this.state;
    const {
      fieldSize = [240, 700],
      header = t(intl.lithology),
      initialMessage = t(intl.instructionMessage),
    } = settings;
    const stepY = fieldSize[1] / dataLength;

    return (
      <div className={b()}>
        <div className={b('header')}>
          <div className={b('header-wrapper')}>
            <Badge label={header} />
          </div>
          {onAddIntervalsButtonClickHandler && (
            <div className={b('header-wrapper')}>
              <Button size="xs" iconLeft={IconAdd} onlyIcon onClick={onAddIntervalsButtonClickHandler} />
            </div>
          )}
          {onDeleteAllIntervalsButtonClickHandler && (
            <Button size="xs" iconLeft={IconTrash} onlyIcon onClick={onDeleteAllIntervalsButtonClickHandler} />
          )}
        </div>
        <div className={b('scale-units')} />
        <div className={b('scale-labels')} />
        <div className={b('sheet')} style={{ width: fieldSize[0], height: fieldSize[1] }}>
          <div className={b('sheet-initial-message', { visible: levels.length === 0 && intervals.length === 0 })}>
            {initialMessage}
          </div>
          {intervals.map((interval: INamedInterval, index) => {
            const backgroundWithoutImage = selectOptions[Number(interval.name) - 1]
              ? selectOptions[Number(interval.name) - 1].color
              : 'rgba(255, 255, 255, 0.5)';
            const backgroundWithRepeatedOrWithoutImage = interval.imageUrl && !interval.repeatByY
              ? `url(${require(`shared/${interval.imageUrl}`)}) repeat`
              : backgroundWithoutImage;
            const background = interval.imageUrl && interval.repeatByY
              ? `url(${require(`shared/${interval.imageUrl}`)}) repeat-y`
              : backgroundWithRepeatedOrWithoutImage;
            const top = (interval.beginCoordinate * fieldSize[1]) / FIELD_SIZE[1];
            const height = ((interval.endCoordinate - interval.beginCoordinate)
              * fieldSize[1]) / FIELD_SIZE[1];
            return (
              <React.Fragment key={index}>
                <div
                  className={b('block')}
                  style={{
                    top,
                    height,
                    background,
                  }}
                  key={uuid()}
                >
                  <div
                    className={b('block-button')}
                    style={{
                      top: height / 2 - 12,
                    }}
                    key={uuid()}
                  >
                    {selectOptions[Number(interval.name) - 1]
                      ? (
                        <span className={b('block-button-inner-wrapper')}>
                          {selectOptions[Number(interval.name) - 1].label}
                        </span>
                      )
                      : ''}
                    {!withoutEditControls && (
                      <Button size="xs" iconLeft={IconEdit} onlyIcon onClick={() => this.onEditIntervalButtonClick(index)} />
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
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
        {onSelectChangeHandler && (
          <Modal isOpen={isModalOpen} className={b('modal')}>
            <div className={b('modal-content')}>
              <div className={b('select-input')}>
                <CustomSelect
                  placeholder={t(intl.choose)}
                  options={selectOptions}
                  onChange={this.onSelectChange}
                />
              </div>
              <div className={b('modal-buttons')}>
                <Button
                  onClick={this.onModalSaveButtonClick}
                  label={t(sharedIntl.save) as string}
                  iconLeft={IconCheck}
                />
                <Button
                  onClick={this.onModalCancelButtonClick}
                  label={t(sharedIntl.cancel) as string}
                  iconLeft={IconCancel}
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  private onEditIntervalButtonClick(index: number): void {
    this.setState({ isModalOpen: true, currentIntervalId: index });
  }

  @autobind
  private onSelectChange(v: any): void {
    const { currentIntervalId } = this.state;
    const { onSelectChangeHandler } = this.props;
    if (onSelectChangeHandler) {
      onSelectChangeHandler(v, currentIntervalId);
    }
  }

  @autobind
  private onModalSaveButtonClick(): void {
    this.setState({ isModalOpen: false });
  }

  @autobind
  private onModalCancelButtonClick(): void {
    this.setState({ isModalOpen: false });
  }
}

export { ColorContentChart };
