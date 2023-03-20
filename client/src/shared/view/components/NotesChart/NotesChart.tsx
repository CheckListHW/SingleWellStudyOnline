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
import { IconEdit } from 'consta-uikit-fork/IconEdit';

import { INote, ISameChartSettings } from 'shared/types/models';
import { TranslateFunction, tKeys } from 'services/i18n';

import './NotesChart.scss';


interface IState {
  isModalOpen: boolean;
  isEditMode: boolean;
  currentNoteMinDepth: number;
  currentNoteMaxDepth: number;
  currentNoteText: string;
}

interface IProps {
  data: INote[];
  isWithoutMainControls?: boolean;
  settings?: ISameChartSettings;
  t: TranslateFunction;
  onSaveNoteButtonClickHandler?(minDepth: number, maxDepth: number, noteText: string): void;
  onEditNoteButtonClickHandler?(minDepth: number, maxDepth: number, noteText: string): void;
  onDeleteNoteButtonClickHandler?(index: number): void;
  onDeleteAllNotesButtonClickHandler?(): void;
}

const b = block('notes-chart');
const { shared: sharedIntl, noteChart: intl } = tKeys;

class NotesChart extends React.Component<IProps, IState> {
  public state = this.getInitialState(this.props);

  private getInitialState(props: IProps): IState {
    const { settings } = props;
    return {
      isModalOpen: false,
      isEditMode: false,
      currentNoteMinDepth: (settings && settings.minDepth) ? settings.minDepth : 2500,
      currentNoteMaxDepth: (settings && settings.maxDepth) ? settings.maxDepth : 3100,
      currentNoteText: '',
    };
  }

  public render() {
    const { data, settings = {}, isWithoutMainControls,
      onDeleteAllNotesButtonClickHandler, onEditNoteButtonClickHandler, t } = this.props;
    const { isModalOpen, currentNoteMinDepth, currentNoteMaxDepth,
      currentNoteText, isEditMode } = this.state;
    const {
      fieldSize = [160, 700],
      header = t(intl.comments),
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
              {onDeleteAllNotesButtonClickHandler && (
                <Button size="xs" iconLeft={IconCancel} onlyIcon onClick={onDeleteAllNotesButtonClickHandler} />
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
          {data.length !== 0 && data.map((note, index) => {
            const top = ((note.minDepth - minDepth) * fieldSize[1]) / interval;
            const height = (((note.maxDepth - minDepth) * fieldSize[1]) / interval) - top;
            return (
              <div
                className={b('note')}
                style={{
                  top,
                  height,
                }}
                key={index}
              >
                {note.controls !== null && note.controls !== undefined && (
                  <div className={b('note-header')}>
                    {onEditNoteButtonClickHandler && note.controls.edit && (
                      <div className={b('note-header-inner')}>
                        <Button size="xs" iconLeft={IconEdit} onlyIcon onClick={() => this.onEditButtonClick(index)} />
                      </div>
                    )}
                    {note.controls.delete && (
                      <Button size="xs" iconLeft={IconClose} onlyIcon onClick={() => this.onDeleteButtonClick(index)} />
                    )}
                  </div>
                )}
                {note.controls === undefined && (
                  <div className={b('note-header')}>
                    {onEditNoteButtonClickHandler && (
                      <div className={b('note-header-inner')}>
                        <Button size="xs" iconLeft={IconEdit} onlyIcon onClick={() => this.onEditButtonClick(index)} />
                      </div>
                    )}
                    <Button size="xs" iconLeft={IconClose} onlyIcon onClick={() => this.onDeleteButtonClick(index)} />
                  </div>
                )}
                {note.noteText}
              </div>
            );
          })}
        </div>
        <Modal isOpen={isModalOpen} className={b('modal')}>
          <div className={b('modal-content')}>
            <div className={b('min-height-input')}>
              <TextField
                placeholder={t(sharedIntl.minDepth)}
                value={String(currentNoteMinDepth)}
                disabled={isEditMode}
                width="full"
                onChange={this.onMinHeightInputChange}
              />
            </div>
            <div className={b('max-height-input')}>
              <TextField
                placeholder={t(sharedIntl.maxDepth)}
                value={String(currentNoteMaxDepth)}
                disabled={isEditMode}
                width="full"
                onChange={this.onMaxHeightInputChange}
              />
            </div>
            <div className={b('note-text-input')}>
              <TextField
                type="textarea"
                placeholder={t(intl.placeholder)}
                value={currentNoteText}
                width="full"
                minRows={3}
                onChange={this.onNoteTextInputChange}
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
    const { settings, onSaveNoteButtonClickHandler, onEditNoteButtonClickHandler } = this.props;
    const { currentNoteMinDepth, currentNoteMaxDepth, currentNoteText, isEditMode } = this.state;

    const minimalDepth = settings?.minDepth && currentNoteMinDepth < settings.minDepth
      ? settings.minDepth
      : currentNoteMinDepth;
    const maximalDepth = settings?.maxDepth && currentNoteMaxDepth > settings.maxDepth
      ? settings.maxDepth
      : currentNoteMaxDepth;

    if (onEditNoteButtonClickHandler && isEditMode) {
      onEditNoteButtonClickHandler(
        minimalDepth,
        maximalDepth,
        currentNoteText,
      );
    } else if (onSaveNoteButtonClickHandler) {
      onSaveNoteButtonClickHandler(
        minimalDepth,
        maximalDepth,
        currentNoteText,
      );
    }
    this.setState({
      isModalOpen: false,
      isEditMode: false,
      currentNoteMinDepth: (settings && settings.minDepth) ? settings.minDepth : 2500,
      currentNoteMaxDepth: (settings && settings.maxDepth) ? settings.maxDepth : 3100,
      currentNoteText: '',
    });
  }

  @autobind
  private onModalCancelButtonClick(): void {
    const { settings } = this.props;
    this.setState({
      isModalOpen: false,
      isEditMode: false,
      currentNoteMinDepth: (settings && settings.minDepth) ? settings.minDepth : 2500,
      currentNoteMaxDepth: (settings && settings.maxDepth) ? settings.maxDepth : 3100,
      currentNoteText: '',
    });
  }

  private onDeleteButtonClick(index: number): void {
    const { onDeleteNoteButtonClickHandler } = this.props;
    if (onDeleteNoteButtonClickHandler) {
      onDeleteNoteButtonClickHandler(index);
    }
  }

  private onEditButtonClick(index: number): void {
    const { data } = this.props;
    this.setState({
      isModalOpen: true,
      isEditMode: true,
      currentNoteMinDepth: data[index].minDepth,
      currentNoteMaxDepth: data[index].maxDepth,
      currentNoteText: data[index].noteText,
    });
  }

  @autobind
  private onMinHeightInputChange(event: any): void {
    const { value } = event;
    this.setState({ currentNoteMinDepth: value ? value.replace(/[^\d.,]/g, '').replace(/,/g, '.') : '0' });
  }

  @autobind
  private onMaxHeightInputChange(event: any): void {
    const { value } = event;
    this.setState({ currentNoteMaxDepth: value ? value.replace(/[^\d.,]/g, '').replace(/,/g, '.') : '0' });
  }

  @autobind
  private onNoteTextInputChange(event: any): void {
    const noteText = event.value;
    this.setState({ currentNoteText: noteText });
  }
}

export { NotesChart };
