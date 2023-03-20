import React from 'react';
import block from 'bem-cn';
import { Button } from 'consta-uikit-fork/Button';
import { TextField } from 'consta-uikit-fork/TextField';
import { IconCheck } from 'consta-uikit-fork/IconCheck';

import './ChangePasswordForm.scss';

interface IProps {
  id: string;
  index: number;
  passwordInputValue: string;
  currentUserId: string;
  isLoading: boolean;
  onInputChange(args: { value: string | null }, id: string): void;
  onSubmit(id: string): void;
}


const b = block('change-password-form');

const ChangePasswordForm = (props: IProps): JSX.Element => {
  const { id, index, passwordInputValue, currentUserId, isLoading,
    onInputChange, onSubmit } = props;
  return (
    <div className={b()}>
      <div className={b('input-wrapper')}>
        <TextField
          id={`newPassword${index}`}
          width="full"
          size="xs"
          value={id === currentUserId ? passwordInputValue : ''}
          disabled={isLoading}
          onChange={args => onInputChange(args, id)}
        />
      </div>
      <Button size="xs" iconLeft={IconCheck} onClick={() => onSubmit(id)} loading={isLoading} />
    </div>
  );
};

export { ChangePasswordForm };
