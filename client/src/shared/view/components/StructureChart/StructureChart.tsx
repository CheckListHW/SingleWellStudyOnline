/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { Badge } from 'consta-uikit-fork/Badge';
import { Button } from 'consta-uikit-fork/Button';
import { Modal } from 'consta-uikit-fork/Modal';
import { TextField } from 'consta-uikit-fork/TextField';
import { IconAdd } from 'consta-uikit-fork/IconAdd';
import { IconClose } from 'consta-uikit-fork/IconClose';
import { IconCheck } from 'consta-uikit-fork/IconCheck';
import { IconCancel } from 'consta-uikit-fork/IconCancel';
import { IconTrash } from 'consta-uikit-fork/IconTrash';
import { IconEdit } from 'consta-uikit-fork/IconEdit';

import { ISameChartSettings, ICustomMultiSelectOption, IStructure, SelectedItems } from 'shared/types/models';
import { CustomMultiSelect } from 'shared/view/elements/CustomMultiSelect/CustomMultiSelect';
import { TranslateFunction, tKeys } from 'services/i18n';

import './StructureChart.scss';


interface IState {
  isModalOpen: boolean;
  isSelectOpen: boolean;
  isEditMode: boolean;
  currentStructureMinDepth: number;
  currentStructureMaxDepth: number;
  currentStructureItems: SelectedItems[];
}

interface IProps {
  data: IStructure[];
  selectItems: ICustomMultiSelectOption[];
  settings?: ISameChartSettings;
  isWithoutMainControls?: boolean;
  isSingleSelect?: boolean;
  t: TranslateFunction;
  onSaveStructureButtonClickHandler?(minDepth: number,
    maxDepth: number, structureItems: SelectedItems[]): void;
  onEditStructureButtonClickHandler?(minDepth: number, maxDepth: number,
    structureItems: SelectedItems[]): void;
  onDeleteStructureButtonClickHandler?(index: number): void;
  onDeleteAllStructuresButtonClickHandler?(): void;
}

const b = block('structure-chart');
const { shared: sharedIntl, structureChart: intl } = tKeys;

class StructureChart extends React.Component<IProps, IState> {
  public state = this.getInitialState(this.props);

  private getInitialState(props: IProps): IState {
    const { settings } = props;
    return {
      isModalOpen: false,
      isSelectOpen: true,
      isEditMode: false,
      currentStructureMinDepth: (settings && settings.minDepth) ? settings.minDepth : 2500,
      currentStructureMaxDepth: (settings && settings.maxDepth) ? settings.maxDepth : 3100,
      currentStructureItems: [],
    };
  }

  public render() {
    const { data, settings = {}, isWithoutMainControls,
      selectItems, isSingleSelect,
      onDeleteAllStructuresButtonClickHandler,
      onEditStructureButtonClickHandler, t } = this.props;
    const {
      isModalOpen,
      currentStructureMinDepth,
      currentStructureMaxDepth,
      isSelectOpen,
      isEditMode,
    } = this.state;
    const {
      fieldSize = [190, 700],
      header = t(intl.structures),
      minDepth = 2500,
      maxDepth = 3100,
      initialMessage = t(intl.instructionMessage),
    } = settings;
    const interval = maxDepth - minDepth;

    return (
      <div className={b()}>
        <div className={b('header')}>
          <div className={b('header-wrapper')}>
            <Badge label={header} />
          </div>
          {!isWithoutMainControls && (
            <>
              <div className={b('header-wrapper')}>
                <Button size="xs" iconLeft={IconAdd} onlyIcon onClick={this.onAddButtonClick} />
              </div>
              {onDeleteAllStructuresButtonClickHandler && (
                <Button size="xs" iconLeft={IconTrash} onlyIcon onClick={onDeleteAllStructuresButtonClickHandler} />
              )}
            </>
          )}
        </div>
        <div className={b('scale-units')} />
        <div className={b('scale-labels')} />
        <div className={b('sheet')} style={{ width: fieldSize[0], height: fieldSize[1] }}>
          <div className={b('sheet-initial-message', { visible: data.length === 0 })}>
            {initialMessage}
          </div>
          {data.length !== 0 && data.map((structure, index) => {
            const top = ((structure.minDepth - minDepth) * fieldSize[1]) / interval;
            const height = (((structure.maxDepth - minDepth) * fieldSize[1]) / interval) - top;
            const checkedItem = structure.structureItems
              .find(structureItem => structureItem.checked === true);
            const colorProperty = checkedItem
              ? selectItems.find(selectItem => selectItem.value === checkedItem.value)?.color
              : null;

            return (
              <div
                className={b('structure')}
                style={{
                  top,
                  height,
                  background: colorProperty || undefined,
                }}
                key={index}
              >
                {structure.structureItems.map((item, id) => {
                  if (item.checked && !colorProperty) {
                    return (
                      <div className={b('icon')} key={id}>
                        <img
                          className={b('icon-image')}
                          src={require(`shared/${item.imageUrl}`)}
                          alt="icon"
                        />
                      </div>
                    );
                  }
                  return false;
                })}
                {findAmountOfCheckedItems(structure.structureItems) === 1
                  && (
                    <div className={b('structure-header-wrap')}>
                      {structure.structureItems[findPositionOfFirstCheckedItem(structure
                        .structureItems)].label}
                    </div>
                  )}
                {structure.controls !== null && structure.controls !== undefined && (
                  <div className={b('structure-header-button')}>
                    {onEditStructureButtonClickHandler && structure.controls.edit && (
                      <div className={b('structure-header-inner')}>
                        <Button size="xs" iconLeft={IconEdit} onlyIcon onClick={() => this.onEditButtonClick(index)} />
                      </div>
                    )}
                    {structure.controls.delete && (
                      <Button size="xs" iconLeft={IconClose} onlyIcon onClick={() => this.onDeleteButtonClick(index)} />
                    )}
                  </div>
                )}
                {structure.controls === undefined && (
                  <div className={b('note-header')}>
                    {onEditStructureButtonClickHandler && (
                      <div className={b('note-header-inner')}>
                        <Button size="xs" iconLeft={IconEdit} onlyIcon onClick={() => this.onEditButtonClick(index)} />
                      </div>
                    )}
                    <Button size="xs" iconLeft={IconClose} onlyIcon onClick={() => this.onDeleteButtonClick(index)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Modal
          isOpen={isModalOpen}
          className={b('modal')}
          container={document.getElementsByClassName('main-layout')[0] as HTMLDivElement}
          onOverlayClick={this.onModalOverlayClick}
        >
          <div className={b('modal-content')}>
            <div className={b('min-height-input')}>
              <TextField
                placeholder={t(sharedIntl.minDepth)}
                id="min-height-input"
                value={String(currentStructureMinDepth)}
                disabled={isEditMode}
                width="full"
                onChange={this.onMinHeightInputChange}
              />
            </div>
            <div className={b('max-height-input')}>
              <TextField
                placeholder={t(sharedIntl.maxDepth)}
                id="max-height-input"
                value={String(currentStructureMaxDepth)}
                disabled={isEditMode}
                width="full"
                onChange={this.onMaxHeightInputChange}
              />
            </div>
            <div className={b('structure-select-input')}>
              <CustomMultiSelect
                isSelectOpen={isSelectOpen}
                placeholder={t(intl.placeholder)}
                options={selectItems as ICustomMultiSelectOption[]}
                isSingleSelect={isSingleSelect}
                onChange={this.onStructureSelectChange}
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
      </div>
    );
  }

  @autobind
  private onAddButtonClick(): void {
    this.setState({ isModalOpen: true });
  }

  @autobind
  private onModalSaveButtonClick(): void {
    const { onSaveStructureButtonClickHandler, onEditStructureButtonClickHandler,
      settings } = this.props;
    const {
      currentStructureMinDepth,
      currentStructureMaxDepth,
      currentStructureItems,
      isEditMode,
    } = this.state;

    const minimalDepth = settings?.maxDepth && currentStructureMinDepth > settings.maxDepth
      ? settings.maxDepth
      : currentStructureMinDepth;
    const validMinimalDepth = settings?.minDepth && currentStructureMinDepth < settings.minDepth
      ? settings.minDepth
      : minimalDepth;
    const maximalDepth = settings?.minDepth && currentStructureMaxDepth < settings.minDepth
      ? settings.minDepth
      : currentStructureMaxDepth;
    const validMaximalDepth = settings?.maxDepth && currentStructureMaxDepth > settings.maxDepth
      ? settings.maxDepth
      : maximalDepth;

    if (onEditStructureButtonClickHandler && isEditMode) {
      onEditStructureButtonClickHandler(
        validMinimalDepth,
        validMaximalDepth,
        currentStructureItems,
      );
    } else if (onSaveStructureButtonClickHandler) {
      onSaveStructureButtonClickHandler(
        validMinimalDepth,
        validMaximalDepth,
        currentStructureItems,
      );
    }

    this.setState({
      isModalOpen: false,
      isSelectOpen: true,
      isEditMode: false,
      currentStructureMinDepth: (settings && settings.minDepth) ? settings.minDepth : 2500,
      currentStructureMaxDepth: (settings && settings.maxDepth) ? settings.maxDepth : 3100,
      currentStructureItems: [],
    });
  }

  @autobind
  private onModalCancelButtonClick(): void {
    this.setState({ isModalOpen: false, isEditMode: false });
  }

  @autobind
  private onModalOverlayClick(event: any): void {
    if (event.target.className === 'Modal-Overlay') {
      this.setState(prevState => ({ isSelectOpen: !prevState.isSelectOpen }));
    }
  }

  @autobind
  private onDeleteButtonClick(index: number): void {
    const { onDeleteStructureButtonClickHandler } = this.props;
    if (onDeleteStructureButtonClickHandler) {
      onDeleteStructureButtonClickHandler(index);
    }
  }

  private onEditButtonClick(index: number): void {
    const { data } = this.props;
    this.setState({
      isModalOpen: true,
      isSelectOpen: true,
      isEditMode: true,
      currentStructureMinDepth: data[index].minDepth,
      currentStructureMaxDepth: data[index].maxDepth,
      currentStructureItems: data[index].structureItems,
    });
  }

  @autobind
  private onMinHeightInputChange(event: any): void {
    const { value } = event;
    this.setState({ currentStructureMinDepth: value ? value.replace(/[^\d.,]/g, '').replace(/,/g, '.') : '0' });
  }

  @autobind
  private onMaxHeightInputChange(event: any): void {
    const { value } = event;
    this.setState({ currentStructureMaxDepth: value ? value.replace(/[^\d.,]/g, '').replace(/,/g, '.') : '0' });
  }

  @autobind
  private onStructureSelectChange(selectedItems: SelectedItems[]): void {
    this.setState({ currentStructureItems: selectedItems });
  }
}

const findAmountOfCheckedItems = (selectedItems: SelectedItems[]): number =>
  selectedItems.reduce((acc, item) => (item.checked ? acc + 1 : acc), 0);

const findPositionOfFirstCheckedItem = (selectedItems: SelectedItems[]): number =>
  selectedItems.reduce((acc, item, index) => (item.checked && acc === 0 ? index : acc), 0);

export { StructureChart };
