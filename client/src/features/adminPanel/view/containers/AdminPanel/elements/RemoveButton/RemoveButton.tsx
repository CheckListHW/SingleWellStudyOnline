import React from 'react';
import { Button } from 'consta-uikit-fork/Button';
import { IconClose } from 'consta-uikit-fork/IconClose';

import './RemoveButton.scss';

interface IProps {
  id: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick(id: string): void;
}


const RemoveButton = (props: IProps): JSX.Element => {
  const { id, isLoading, disabled, onClick } = props;
  return (
    <Button
      size="xs"
      iconLeft={IconClose}
      className="remove-button remove-button_color_red"
      label="Удалить (необратимо)"
      loading={isLoading}
      disabled={disabled}
      onClick={() => onClick(id)}
    />
  );
};

export { RemoveButton };
