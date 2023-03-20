import React from 'react';
import block from 'bem-cn';
import { Button } from 'consta-uikit-fork/Button';
import { TextField } from 'consta-uikit-fork/TextField';
import { IconSearch } from 'consta-uikit-fork/IconSearch';

import './FindUserForm.scss';


interface IProps {
  searchingUserEmail: string;
  onSearchingUserEmailInputChangeHandler(args: { value: string | null }): void;
  onSearchButtonClickHandler(): void;
}

const b = block('find-user-form');

function FindUserForm(props: IProps): JSX.Element {
  const { searchingUserEmail, onSearchingUserEmailInputChangeHandler,
    onSearchButtonClickHandler } = props;
  const onSearchingUserEmailInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSearchButtonClickHandler();
    }
  };

  return (
    <div className={b()}>
      Email пользователя:
      <div className={b('distance-wrapper')}>
        <TextField
          id="currentUserEmail"
          size="xs"
          value={searchingUserEmail}
          onChange={onSearchingUserEmailInputChangeHandler}
          onKeyDown={onSearchingUserEmailInputKeyDown}
          placeholder="test001@hwtpu.ru"
        />
      </div>
      <Button
        iconLeft={IconSearch}
        size="xs"
        label="Найти"
        onClick={onSearchButtonClickHandler}
      />
    </div>
  );
}

export { FindUserForm };
