import React from 'react';
import block from 'bem-cn';
import { Badge } from 'consta-uikit-fork/Badge';
import { TextField } from 'consta-uikit-fork/TextField';
import { Checkbox } from 'consta-uikit-fork/Checkbox';
import { Button } from 'consta-uikit-fork/Button';
import { IconCancel } from 'consta-uikit-fork/IconCancel';

import { ISameChartSettings, ICoreData, CoreType } from 'shared/types/models';
import { INotification } from 'shared/types/common';
import { ISetNotification } from 'services/notification/namespace';
import { TranslateFunction, tKeys } from 'services/i18n';

import './EditableList.scss';


interface IProps {
  data: ICoreData[];
  coreType?: CoreType;
  settings?: ISameChartSettings;
  t: TranslateFunction;
  setNotificationHandler(notification: INotification): ISetNotification;
  onSaveButtonClickHandler(coreItem: ICoreData): void;
  onCancelAllButtonClickHandler(): void;
}

interface IState {
  listData: ICoreData[];
}

const b = block('editable-list');
const { shared: sharedIntl, editableList: intl } = tKeys;

class EditableList extends React.PureComponent<IProps, IState> {
  public state = { listData: this.props.data.slice() };

  public render() {
    const { settings = {}, coreType = 'porosity', onCancelAllButtonClickHandler, t } = this.props;
    const { listData } = this.state;
    const {
      fieldSize = [320, 700],
      header = 'Данные по керну',
    } = settings;

    return (
      <div className={b()}>
        <div className={b('header')}>
          <div className={b('header-wrapper')}>
            <Badge label={header} />
          </div>
          <Button
            size="xs"
            iconLeft={IconCancel}
            onlyIcon
            type="button"
            onClick={onCancelAllButtonClickHandler}
          />
        </div>
        <div className={b('scale-units')} />
        <div className={b('scale-labels')}>
          <div className={b('scale-labels-item')} style={{ width: `${fieldSize[0] / 6.4}px` }}>
            №
          </div>
          <div className={b('scale-labels-item')} style={{ width: `${fieldSize[0] / 4.3}px` }}>
            {t(intl.depth)}
          </div>
          <div className={b('scale-labels-item')} style={{ width: `${fieldSize[0] / 4.3}px` }}>
            {t(intl.value)}
          </div>
          <div className={b('scale-labels-item')} style={{ width: `${fieldSize[0] / 14.55}px` }}>
            {t(intl.visibility)}
          </div>
          <div className={b('scale-labels-item')} style={{ width: `${fieldSize[0] / 3.3}px` }} />

        </div>
        <div className={b('list')} style={{ width: fieldSize[0], height: fieldSize[1] }}>
          {listData.map((item, index) => {
            const currentItemValue = listData[index][coreType];
            if (currentItemValue > 0) {
              return (
                <div className={b('list-row')} key={index}>
                  <div className={b('list-cell')} style={{ width: `${fieldSize[0] / 6.4}px` }}>
                    <TextField
                      value={String(item.id + 1)}
                      size="xs"
                      readOnly
                    />
                  </div>
                  <div className={b('list-cell')} style={{ width: `${fieldSize[0] / 4.3}px` }}>
                    <TextField
                      value={String(item.depth)}
                      size="xs"
                      onChange={args => this.onDepthInputChange(args, index)}
                    />
                  </div>
                  <div className={b('list-cell')} style={{ width: `${fieldSize[0] / 4.3}px` }}>
                    <TextField
                      value={String(item[coreType])}
                      size="xs"
                      readOnly
                    />
                  </div>
                  <div className={b('list-cell-checkbox-wrapper')} style={{ width: `${fieldSize[0] / 14.54}px` }}>
                    <Checkbox
                      checked={item.isVisible}
                      size="l"
                      onChange={() => this.onListCheckboxChange(index)}
                    />
                  </div>
                  <div className={b('list-cell-checkbox-wrapper')} style={{ width: `${fieldSize[0] / 3.3}px` }}>
                    <Button
                      label={t(sharedIntl.save) as string}
                      size="xs"
                      onClick={() => this.onChangeButtonClick(index)}
                    />
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  private onDepthInputChange(args: any, id: number) {
    const correctedStringValue = args.value ? args.value.replace(/[^\d.,]/g, '').replace(/,/g, '.') : '0';
    this.setState((prevState: IState) => {
      const listData = prevState.listData
        .map((listDataItem, index) => (index === id
          ? { ...listDataItem, depth: correctedStringValue } : listDataItem));
      return { listData };
    });
  }

  private onListCheckboxChange(id: number): void {
    const { data, setNotificationHandler, t } = this.props;
    const tenPercentOfCoreData = Math.round(data
      .reduce((acc, item) => (item.id > 0 ? acc + 1 : acc), 0) / 10);
    const numberOfCorrectedDots = data
      .reduce((acc, item) => (!item.isVisible ? acc + 1 : acc), 0) + 1;

    if (numberOfCorrectedDots <= tenPercentOfCoreData || !data[id].isVisible) {
      this.setState((prevState: IState) => {
        const listData = prevState.listData
          .map((listDataItem, index) => (index === id
            ? { ...listDataItem, isVisible: !prevState.listData[id].isVisible } : listDataItem));
        return { listData };
      });
    } else {
      setNotificationHandler({
        text: t(sharedIntl.warningOnlyTenPercentFromCoreData),
        kind: 'warning',
      });
    }
  }

  private onChangeButtonClick(index: number) {
    const { onSaveButtonClickHandler } = this.props;
    const { listData } = this.state;
    onSaveButtonClickHandler(listData[index]);
  }
}

export { EditableList };
