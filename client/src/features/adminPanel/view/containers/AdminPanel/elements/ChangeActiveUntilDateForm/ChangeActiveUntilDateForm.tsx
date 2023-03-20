import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { Button } from 'consta-uikit-fork/Button';
import { TextField } from 'consta-uikit-fork/TextField';

import './ChangeActiveUntilDateForm.scss';


interface IProps {
  id: string;
  index: number;
  date: number;
  isActive: boolean;
  isLoading: boolean;
  onSubmit(userId: string, date: string): void;
}

interface IState {
  inputValue: string;
}

const b = block('change-active-until-date-form');

class ChangeActiveUntilDateForm extends React.Component<IProps, IState> {
  public state = this.getInitialState(this.props.date);

  private getInitialState(date: number): IState {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const dateString = `${year}-${String(month).length === 1 ? `0${month}` : month}-${String(day).length === 1 ? `0${day}` : day}`;

    return { inputValue: dateString };
  }

  public componentDidUpdate(prevProps: IProps) {
    const { date } = this.props;
    if (prevProps.date !== date) {
      const currentDate = new Date(date);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const dateString = `${year}-${String(month).length === 1 ? `0${month}` : month}-${String(day).length === 1 ? `0${day}` : day}`;

      this.setState({ inputValue: dateString });
    }
  }

  public render() {
    const { index, isActive, isLoading } = this.props;
    const { inputValue } = this.state;
    return (
      <div className={b()}>
        <div className={b('input-wrapper')}>
          <TextField
            id={`activeUntilDate${index}`}
            size="xs"
            type="date"
            disabled={!isActive || isLoading}
            value={inputValue}
            onChange={this.onDateInputChange}
          />
        </div>
        <Button size="xs" label="OK" onClick={this.onSubmitButtonClick} disabled={!isActive} loading={isLoading} />
      </div>
    );
  }

  @autobind
  private onSubmitButtonClick(): void {
    const { id, onSubmit } = this.props;
    const { inputValue } = this.state;
    onSubmit(id, inputValue);
  }

  @autobind
  private onDateInputChange(args: { value: string | null }): void {
    if (args.value) {
      this.setState({ inputValue: args.value });
    }
  }
}

export { ChangeActiveUntilDateForm };
