import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { TextField } from 'consta-uikit-fork/TextField';
import { Checkbox } from 'consta-uikit-fork/Checkbox';
import { Button } from 'consta-uikit-fork/Button';
import { IconCheck } from 'consta-uikit-fork/IconCheck';

import { TranslateFunction, tKeys } from 'services/i18n';

import './Menu.scss';


interface IArgs {
  e: React.ChangeEvent;
  id?: string | number;
  name?: string;
  value: string | null;
}

interface IProps {
  minDataValue: number;
  maxDataValue: number;
  isLogarithmic?: boolean;
  constraintLeft?: number;
  constraintRight?: number;
  isConstraintSet?: boolean;
  color?: string;
  t: TranslateFunction;
  onCheckboxChangeHandler?(leftConstraintValue: number, rightConstraintValue: number): void;
  onIsLogarithmicCheckboxChangeHandler?(): void;
  onChangeColorButtonClickHandler?(color: string): void;
  onSaveButtonClickHandler?(chartSettings: {
    leftConstraintValue: number;
    rightConstraintValue: number;
  }): void;
}

interface IState {
  leftConstraintValue: string;
  rightConstraintValue: string;
  currentColor: string;
}

const b = block('chart-menu');
const { chart: intl } = tKeys;

class Menu extends React.Component<IProps, IState> {
  public state = {
    leftConstraintValue: this.props.isConstraintSet
      ? String(this.props.constraintLeft)
      : String(this.props.minDataValue),
    rightConstraintValue: this.props.isConstraintSet
      ? String(this.props.constraintRight)
      : String(this.props.maxDataValue),
    currentColor: this.props.color ? this.props.color : '#0f0',
  };

  public render() {
    const {
      isConstraintSet,
      isLogarithmic,
      onIsLogarithmicCheckboxChangeHandler,
      t,
    } = this.props;
    const { leftConstraintValue, rightConstraintValue, currentColor } = this.state;

    return (
      <div className={b()}>
        {onIsLogarithmicCheckboxChangeHandler && (
          <div className={b('distance-wrapper')}>
            <Checkbox
              label={t(intl.logarithmic)}
              checked={isLogarithmic}
              size="m"
              onChange={this.onIsLogarithmicCheckboxChange}
            />
          </div>
        )}
        {t(intl.minLimit)}
        <div className={b('distance-wrapper')}>
          <TextField
            id="right-constraint"
            value={String(leftConstraintValue)}
            width="full"
            size="xs"
            disabled={isConstraintSet}
            onChange={this.onFirstTextFieldInputChange}
          />
        </div>
        {t(intl.maxLimit)}
        <div className={b('distance-wrapper')}>
          <TextField
            id="left-constraint"
            value={String(rightConstraintValue)}
            width="full"
            size="xs"
            disabled={isConstraintSet}
            onChange={this.onSecondTextFieldInputChange}
          />
        </div>
        <div className={b('distance-wrapper')}>
          <Checkbox
            label={t(intl.limit)}
            checked={isConstraintSet}
            size="m"
            onChange={this.onCheckboxChange}
          />
        </div>
        {t(intl.changeColor)}
        <div className={b('flex-wrapper')}>
          <TextField
            id="color"
            value={currentColor}
            size="xs"
            type="color"
            width="full"
            onChange={this.onColorFieldInputChange}
          />
          <div className={b('button-distance-wrapper')}>
            <Button
              onlyIcon
              iconLeft={IconCheck}
              size="xs"
              onClick={this.onChangeColorButtonClick}
            />
          </div>
        </div>
      </div>
    );
  }

  @autobind
  private onColorFieldInputChange(args: { value: string | null; }): void {
    if (args.value) {
      this.setState({ currentColor: args.value });
    }
  }

  @autobind
  private onChangeColorButtonClick(): void {
    const { onChangeColorButtonClickHandler } = this.props;
    const { currentColor } = this.state;

    if (onChangeColorButtonClickHandler) {
      onChangeColorButtonClickHandler(currentColor);
    }
  }

  @autobind
  private onCheckboxChange(): void {
    const { onCheckboxChangeHandler } = this.props;

    if (onCheckboxChangeHandler) {
      const { leftConstraintValue, rightConstraintValue } = this.state;
      onCheckboxChangeHandler(Number(leftConstraintValue), Number(rightConstraintValue));
    }
  }

  @autobind
  private onIsLogarithmicCheckboxChange(): void {
    const { onIsLogarithmicCheckboxChangeHandler } = this.props;

    if (onIsLogarithmicCheckboxChangeHandler) {
      onIsLogarithmicCheckboxChangeHandler();
    }
  }

  @autobind
  private onFirstTextFieldInputChange(args: IArgs): void {
    const { value } = args;
    this.setState({ leftConstraintValue: value ? value.replace(/[^\d.,-]/g, '').replace(/,/g, '.') : '0' });
  }

  @autobind
  private onSecondTextFieldInputChange(args: IArgs): void {
    const { value } = args;
    this.setState({ rightConstraintValue: value ? value.replace(/[^\d.,-]/g, '').replace(/,/g, '.') : '0' });
  }
}

export { Menu };
