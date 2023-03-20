import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { Button } from 'consta-uikit-fork/Button';
import { Checkbox } from 'consta-uikit-fork/Checkbox';
import { TextField } from 'consta-uikit-fork/TextField';

import './MassChangeActivityForm.scss';


interface IProps {
  isLoading: boolean;
  onSubmit(date: string, isActive: boolean): void;
}

interface IState {
  inputValue: string;
  isActive: boolean;
}

const b = block('mass-change-activity-form');

class MassChangeActivityForm extends React.Component<IProps, IState> {
  public state = this.getInitialState();

  private getInitialState(): IState {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const dateString = `${year}-${String(month).length === 1 ? `0${month}` : month}-${String(day).length === 1 ? `0${day}` : day}`;

    return { inputValue: dateString, isActive: true };
  }

  public render() {
    const { isLoading } = this.props;
    const { inputValue, isActive } = this.state;
    return (
      <div className={b()}>
        <div className={b('input-wrapper')}>
          <TextField
            id={`activeUntilDateforList`}
            size="xs"
            type="date"
            disabled={isLoading}
            value={inputValue}
            onChange={this.onDateInputChange}
          />
        </div>
        <div className={b('input-wrapper')}>
          <Checkbox
            checked={isActive}
            size="l"
            disabled={isLoading}
            onChange={this.onCheckboxChange}
          />
        </div>
        <Button size="xs" label="Изменить даты и активность найденных" onClick={this.onSubmitButtonClick} loading={isLoading} />
      </div>
    );
  }

  @autobind
  private onSubmitButtonClick(): void {
    const { onSubmit } = this.props;
    const { inputValue, isActive } = this.state;
    onSubmit(inputValue, isActive);
  }

  @autobind
  private onDateInputChange(args: { value: string | null }): void {
    if (args.value) {
      this.setState({ inputValue: args.value });
    }
  }

  @autobind
  private onCheckboxChange(): void {
    this.setState((prevState: IState) => ({ isActive: !prevState.isActive }));
  }
}

export { MassChangeActivityForm };
