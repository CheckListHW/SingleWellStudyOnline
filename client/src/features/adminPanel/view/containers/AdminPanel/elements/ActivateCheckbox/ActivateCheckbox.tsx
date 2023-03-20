import React from 'react';
import { Checkbox } from 'consta-uikit-fork/Checkbox';
import { Loader } from 'consta-uikit-fork/Loader';


interface IProps {
  id: string;
  isActive: boolean;
  isLoading: boolean;
  onChange(id: string): void;
}

const ActivateCheckbox = (props: IProps): JSX.Element => {
  const { id, isActive, isLoading, onChange } = props;
  return (
    <>
      <Checkbox
        checked={isActive}
        size="l"
        onChange={() => onChange(id)}
      />
      {isLoading && (
        <Loader size="s" />
      )}
    </>
  );
};

export { ActivateCheckbox };
