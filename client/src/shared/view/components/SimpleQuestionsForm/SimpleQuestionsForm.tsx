import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { TextField } from 'consta-uikit-fork/TextField';
import { Button } from 'consta-uikit-fork/Button';
import { IconCheck } from 'consta-uikit-fork/IconCheck';

import { INotification } from 'shared/types/common';
import { TranslateFunction, tKeys } from 'services/i18n';

import './SimpleQuestionsForm.scss';


interface IProps {
  questions: string[];
  initialAnswers?: string[];
  t: TranslateFunction;
  onSubmitButtonClickHandler(answers: string[]): void;
  onSetNotificationHandler?(notification: INotification): void;
}

interface IState {
  answers: string[];
}

const b = block('simple-questions-form');
const { shared: intl, warningMessages: warningsIntl } = tKeys;

class SimpleQuestionsForm extends React.Component<IProps, IState> {
  public state = this.getInitialState(this.props);

  private getInitialState(props: IProps): IState {
    const { questions, initialAnswers } = props;
    if (initialAnswers) {
      return { answers: questions.map((_question, index: number) => initialAnswers[index]) };
    }
    return { answers: questions.map(() => '') };
  }

  public render() {
    const { questions, t } = this.props;
    const { answers } = this.state;

    return (
      <div className={b()}>
        {questions.map((question: string, index: number) => (
          <div className={b('field-wrapper')} key={index}>
            <div className={b('field-name-wrapper')}>
              {question}
            </div>
            <TextField
              id={index}
              value={answers[index]}
              type="textarea"
              minRows={2}
              width="full"
              onChange={(args: any) => this.onAnswerInputChange(args, index)}
            />
          </div>
        ))}
        <div className={b('button-wrapper')}>
          <Button
            label={t(intl.save) as string}
            onClick={this.onSaveButtonClick}
            iconLeft={IconCheck}
          />
        </div>
      </div>
    );
  }

  @autobind
  private onSaveButtonClick(): void {
    const { onSubmitButtonClickHandler, onSetNotificationHandler, t } = this.props;
    const { answers } = this.state;
    const isSomeFormFieldsEmpty = answers.some(answer => answer === null);
    if (isSomeFormFieldsEmpty && onSetNotificationHandler) {
      onSetNotificationHandler({
        text: t(warningsIntl.fieldsAreRequired),
        kind: 'warning',
      });
    } else {
      onSubmitButtonClickHandler(answers);
    }
  }

  @autobind
  private onAnswerInputChange(args: any, index: number) {
    this.setState((prevState: IState) =>
      ({ answers: prevState.answers.map((_answer, id: number) =>
        (id === index ? args.value : prevState.answers[id])) }));
  }
}

export { SimpleQuestionsForm };
