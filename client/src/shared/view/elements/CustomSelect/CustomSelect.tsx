/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import React, { RefObject } from 'react';
import ReactDOM from 'react-dom';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { Popover } from 'consta-uikit-fork/Popover';
import { IconArrowDown } from 'consta-uikit-fork/IconArrowDown';
import { IconArrowUp } from 'consta-uikit-fork/IconArrowUp';

import { ICustomMultiSelectOption } from 'shared/types/models';

import { SelectList } from './elements/SelectList/SelectList';
import './CustomSelect.scss';


interface IProps {
  placeholder: string;
  options: ICustomMultiSelectOption[];
  isSelectWithPopup?: boolean;
  onChange(v: ICustomMultiSelectOption): void;
}

interface IState {
  selectedItem: ICustomMultiSelectOption;
  isSelectListVisible: boolean;
  coordinate: [number, number];
  currentEnteredItemNumber: number;
}

const b = block('custom-select');

class CustomSelect extends React.Component<IProps, IState> {
  private selectRef: RefObject<HTMLDivElement> = React.createRef();
  public state = {
    selectedItem: { value: '', label: '', imageUrl: '' },
    isSelectListVisible: false,
    coordinate: [0, 0] as [number, number],
    currentEnteredItemNumber: -1,
  };

  public render() {
    const { placeholder, options, isSelectWithPopup } = this.props;
    const { selectedItem, isSelectListVisible, coordinate, currentEnteredItemNumber } = this.state;

    return (
      <div className={b()} ref={this.selectRef}>
        <div className={b('select')} onClick={this.onSelectClick}>
          {selectedItem.value && (
            <div className={b('main-text')}>
              {selectedItem.label}
            </div>
          )}
          {!selectedItem.value && (
            <div className={b('placeholder')}>
              {placeholder}
            </div>
          )}
          {!isSelectListVisible && !selectedItem.imageUrl && (
            <div className={b('icon')}>
              <IconArrowDown />
            </div>
          )}
          {isSelectListVisible && !selectedItem.imageUrl && (
            <div className={b('icon')}>
              <IconArrowUp />
            </div>
          )}
          {selectedItem.imageUrl && (
            <div className={b('icon')}>
              <img
                className={b('image')}
                src={`${require(`shared/${selectedItem.imageUrl}`)}`}
                alt="icon"
              />
            </div>
          )}
        </div>
        {isSelectListVisible
          && ReactDOM.createPortal(
            <SelectList
              options={options}
              coordinate={coordinate as [number, number]}
              onItemClick={this.onSelectItemClick}
              onItemMouseEnterHandler={this.onMouseIntoItemEnter}
            />,
            document.body,
          )}
        {isSelectWithPopup && isSelectListVisible && currentEnteredItemNumber >= 0 && (
          <Popover
            position={{ x: coordinate[0] - 20, y: coordinate[1] }}
            direction="leftCenter"
            possibleDirections={['leftUp', 'leftDown']}
          >
            <img
              className={b('popup-image')}
              src={`${require(`shared/${options[currentEnteredItemNumber].imageUrl}`)}`}
              alt="popup-icon"
            />
          </Popover>
        )}
      </div>
    );
  }

  @autobind
  private onSelectClick() {
    const x = this.selectRef.current?.getBoundingClientRect().x;
    const y = this.selectRef.current?.getBoundingClientRect().y;
    if (x && y) {
      this.setState(prevState => ({
        isSelectListVisible: !prevState.isSelectListVisible,
        coordinate: [x, y],
      }));
    }
  }

  @autobind
  private onSelectItemClick(option: ICustomMultiSelectOption) {
    const { onChange } = this.props;
    onChange(option);
    this.setState({ selectedItem: option, isSelectListVisible: false });
  }

  @autobind
  private onMouseIntoItemEnter(index: number) {
    this.setState({ currentEnteredItemNumber: index });
  }
}

export { CustomSelect };
