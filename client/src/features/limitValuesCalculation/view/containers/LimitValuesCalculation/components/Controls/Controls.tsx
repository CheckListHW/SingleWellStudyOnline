import React, { Fragment } from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { TextField } from 'consta-uikit-fork/TextField';
import { Button } from 'consta-uikit-fork/Button';
import { Badge } from 'consta-uikit-fork/Badge';
import { IconCheck } from 'consta-uikit-fork/IconCheck';

import { TranslateFunction, tKeys } from 'services/i18n';

import { THICKNESSES_NAMES, THICKNESSES_NAMES_TRANSLATION_KEYS } from '../../constants';
import './Controls.scss';


interface IProps {
  boundaryNames: string[];
  boundaryValues: number[];
  thicknesses: number[];
  t: TranslateFunction;
  onSubmitButtonClickHandler(values: string[]): void;
}

interface IState {
  values: string[];
}

const b = block('controls');
const { cutOffs: intl } = tKeys.features;

type Key = 'grossSand' |
'netThickness' |
'grossOilPay' |
'grossPay' |
'netPay' |
'grossInterval';

class Controls extends React.Component<IProps, IState> {
  private thicknessesNames = THICKNESSES_NAMES.map((_item, index) => {
    const key = THICKNESSES_NAMES_TRANSLATION_KEYS[index];
    return this.props.t(intl[key as Key]);
  });

  public state = this.getInitialState(this.props);

  private getInitialState(props: IProps): IState {
    const { boundaryNames, boundaryValues } = props;

    return boundaryValues.length === 0
      ? { values: boundaryNames.map(() => '') }
      : { values: boundaryValues.map(value => (value !== 0 ? String(value) : '')) };
  }

  public render() {
    const { boundaryNames, thicknesses, t } = this.props;
    const { values } = this.state;

    return (
      <div className={b()}>
        <Badge label={t(intl.inputValues)} />
        {boundaryNames.map((question: string, index: number) => (
          <Fragment key={index}>
            <div className={b('field-name-wrapper')}>
              {question}
            </div>
            <TextField
              id={index}
              value={values[index]}
              size="xs"
              width="full"
              onChange={(args: any) => this.onAnswerInputChange(args, index)}
            />
          </Fragment>
        ))}
        <div className={b('field-name-wrapper')}>
          <Badge label={t(intl.calculatedValues)} />
        </div>
        {thicknesses.map((thickness: number, index: number) => (
          <Fragment key={index}>
            <div className={b('field-name-wrapper', { marked: true })}>
              {this.thicknessesNames[index]}
            </div>
            <TextField
              id={index + 100}
              value={String(thickness)}
              width="full"
              size="xs"
            />
          </Fragment>
        ))}
        <div className={b('button-wrapper')}>
          <Button
            label={t(intl.apply) as string}
            onClick={this.onSaveButtonClick}
            iconLeft={IconCheck}
          />
        </div>
      </div>
    );
  }

  @autobind
  private onSaveButtonClick(): void {
    const { onSubmitButtonClickHandler } = this.props;
    const { values } = this.state;
    onSubmitButtonClickHandler(values);
  }

  @autobind
  private onAnswerInputChange(args: any, index: number) {
    const { value } = args;
    const validValue = value ? value.replace(/[^\d.,]/g, '').replace(/,/g, '.') : '';
    this.setState((prevState: IState) =>
      ({ values: prevState.values.map((_value, id: number) =>
        (id === index ? validValue : prevState.values[id])) }));
  }
}

export { Controls };
