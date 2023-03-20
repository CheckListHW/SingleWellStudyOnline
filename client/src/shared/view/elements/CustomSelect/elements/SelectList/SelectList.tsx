/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import block from 'bem-cn';

import { ICustomMultiSelectOption } from 'shared/types/models';

import './SelectList.scss';

interface IProps {
  options: ICustomMultiSelectOption[];
  coordinate: [number, number];
  onItemClick(v: ICustomMultiSelectOption): void;
  onItemMouseEnterHandler?(index: number): void;
}

const b = block('select-list');

function SelectList(props: IProps) {
  const { options, coordinate, onItemClick, onItemMouseEnterHandler } = props;

  return (
    <div className={b()} style={{ top: coordinate[1] + 40, left: coordinate[0] }}>
      {options.map((option, index) => (
        <div
          className={b('item')}
          onClick={() => onItemClick(option)}
          onMouseEnter={onItemMouseEnterHandler ? () => onItemMouseEnterHandler(index) : undefined}
          key={index}
        >
          <div className={b('main-text')}>
            {option.label}
          </div>
          <div className={b('icon')}>
            <img
              className={b('image')}
              src={`${require(`shared/${option.imageUrl}`)}`}
              alt="icon"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export { SelectList };
