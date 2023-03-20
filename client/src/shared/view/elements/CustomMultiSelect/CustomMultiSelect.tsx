/* eslint-disable react/no-did-update-set-state */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import React, { RefObject } from 'react';
import ReactDOM from 'react-dom';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { IconArrowDown } from 'consta-uikit-fork/IconArrowDown';
import { IconArrowUp } from 'consta-uikit-fork/IconArrowUp';

import { ICustomMultiSelectOption, SelectedItems } from 'shared/types/models';

import { MultiSelectList } from './elements/MultiSelectList/MultiSelectList';
import './CustomMultiSelect.scss';

interface IProps {
  placeholder: string;
  options: ICustomMultiSelectOption[];
  isSelectOpen: boolean;
  isSingleSelect?: boolean;
  onChange(selectedItems: SelectedItems[]): void;
}

interface IState {
  selectedItems: SelectedItems[];
  isSelectListVisible: boolean;
  coordinate: [number, number, number, number];
  amountOfCheckedItems: number;
}

const b = block('custom-multiselect');

class CustomMultiSelect extends React.Component<IProps, IState> {
  private selectRef: RefObject<HTMLDivElement> = React.createRef();
  public state = {
    selectedItems: addSelectedItems(this.props.options),
    isSelectListVisible: false,
    coordinate: [0, 0, -1000, -1000] as [number, number, number, number],
    amountOfCheckedItems: 0,
  };

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { isSelectOpen } = this.props;
    if (prevState.isSelectListVisible === true
      && prevProps.isSelectOpen !== isSelectOpen) {
      this.setState({ isSelectListVisible: false });
    }
  }

  public render() {
    const { placeholder } = this.props;
    const { selectedItems, isSelectListVisible, coordinate,
      amountOfCheckedItems } = this.state;

    return (
      <div className={b()} ref={this.selectRef}>
        <div className={b('select')} onClick={this.onSelectClick}>
          {amountOfCheckedItems === 0 && (
            <div className={b('placeholder')}>
              {placeholder}
            </div>
          )}
          {amountOfCheckedItems === 1 && (
            <div className={b('main-text')}>
              {selectedItems[findPositionOfFirstCheckedItem(selectedItems)].label}
            </div>
          )}
          {amountOfCheckedItems > 1 && (
            <div className={b('main-text')}>
              {`Выбрано позиций: ${amountOfCheckedItems}`}
            </div>
          )}
          {(amountOfCheckedItems === 0 || amountOfCheckedItems > 1) && !isSelectListVisible && (
            <div className={b('icon')}>
              <IconArrowDown />
            </div>
          )}
          {amountOfCheckedItems === 1 && !isSelectListVisible && (
            <div className={b('icon')}>
              <img
                className={b('image')}
                src={`${require(`shared/${selectedItems[findPositionOfFirstCheckedItem(selectedItems)].imageUrl}`)}`}
                alt="icon"
              />
            </div>
          )}
          {isSelectListVisible && (
            <div className={b('icon')}>
              <IconArrowUp />
            </div>
          )}
        </div>
        {isSelectListVisible
          && ReactDOM.createPortal(
            <MultiSelectList
              options={selectedItems}
              coordinate={coordinate as [number, number, number, number]}
              onItemClick={this.onSelectItemClick}
            />,
            document.getElementsByClassName('trace-layout')[0],
          )}
      </div>
    );
  }

  @autobind
  private onSelectClick() {
    if (this.selectRef.current) {
      const { x, y, width, height } = this.selectRef.current.getBoundingClientRect();
      this.setState(prevState => ({
        isSelectListVisible: !prevState.isSelectListVisible,
        coordinate: [x, y, width, height],
      }));
    }
  }

  @autobind
  private onSelectItemClick(index: number) {
    const { onChange, isSingleSelect } = this.props;
    this.setState(prevState => {
      const selectedItems = isSingleSelect
        ? prevState.selectedItems.map((item, id) =>
          (id === index
            ? { ...item, checked: !prevState.selectedItems[id].checked }
            : { ...item, checked: false }))
        : prevState.selectedItems.map((item, id) =>
          (id === index ? { ...item, checked: !prevState.selectedItems[id].checked } : item));
      onChange(selectedItems);
      const amountOfCheckedItems = selectedItems.reduce((acc, item) =>
        (item.checked ? acc + 1 : acc), 0);
      return { selectedItems, amountOfCheckedItems };
    });
  }
}

const findPositionOfFirstCheckedItem = (selectedItems: SelectedItems[]): number =>
  selectedItems.reduce((acc, item, index) => (item.checked && acc === 0 ? index : acc), 0);

const addSelectedItems = (options: ICustomMultiSelectOption[]): SelectedItems[] =>
  options.map(option => ({ ...option, checked: false }));

export { CustomMultiSelect };
