/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import React from 'react';
import block from 'bem-cn';
import { Checkbox } from 'consta-uikit-fork/Checkbox';

import { SelectedItems } from 'shared/types/models';

import './MultiSelectList.scss';

interface IProps {
  options: SelectedItems[];
  coordinate: [number, number, number, number];
  onItemClick(id: number): void;
}

const b = block('multiselect-list');

class MultiSelectList extends React.Component<IProps> {
  public render() {
    const {
      options,
      coordinate,
    } = this.props;

    return (
      <div className={b()} style={{ top: coordinate[1] + 40, left: coordinate[0] }}>
        {options.map((option, index) => (
          <div
            className={b('item')}
          >
            <div className={b('main-text')}>
              <Checkbox
                label={option.label}
                checked={option.checked}
                size="l"
                onChange={() => this.onSelectItemClick(index)}
              />
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

  private onSelectItemClick(index: number) {
    const { onItemClick } = this.props;
    onItemClick(index);
  }
}

export { MultiSelectList };
