import React from 'react';
import block from 'bem-cn';
import { Button } from 'consta-uikit-fork/Button';
import { Text } from 'consta-uikit-fork/Text';
import { TextField } from 'consta-uikit-fork/TextField';
import { IconCheck } from 'consta-uikit-fork/IconCheck';
import { IconCancel } from 'consta-uikit-fork/IconCancel';
import { Modal } from 'consta-uikit-fork/Modal';

import './ModalWindow.scss';


interface IProps {
  isModalOpen: boolean;
  currentAction: 'deleteUser' | 'changePassword' | 'registrateAll' | 'activateUser' | null;
  currentActivityDate: string;
  question: string;
  activateQuestion: string;
  onModalDateInputChangeHandler(args: { value: string | null }): void;
  onModalSubmitButtonClickHandler(): void;
  onModalCancelButtonClickHandler(): void;
}

const b = block('modal-window');

function ModalWindow(props: IProps) {
  const { isModalOpen, currentAction, currentActivityDate, question, activateQuestion,
    onModalDateInputChangeHandler, onModalSubmitButtonClickHandler,
    onModalCancelButtonClickHandler } = props;

  return (
    <Modal isOpen={isModalOpen} className={b()} onOverlayClick={onModalCancelButtonClickHandler}>
      <div className={b('modal-content')}>
        {currentAction !== 'activateUser' && (
          <Text>{question}</Text>
        )}
        {currentAction === 'activateUser' && (
          <>
            <Text>{activateQuestion}</Text>
            <TextField
              id="currentDate"
              value={currentActivityDate}
              type="date"
              onChange={onModalDateInputChangeHandler}
            />
          </>
        )}
        <div className={b('modal-buttons')}>
          <Button
            iconLeft={IconCheck}
            label="Да"
            onClick={onModalSubmitButtonClickHandler}
          />
          <Button
            iconLeft={IconCancel}
            label="Отмена"
            onClick={onModalCancelButtonClickHandler}
          />
        </div>
      </div>
    </Modal>
  );
}

export { ModalWindow };
