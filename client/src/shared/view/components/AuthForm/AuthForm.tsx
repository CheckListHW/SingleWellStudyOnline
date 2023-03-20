import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { Button } from 'consta-uikit-fork/Button';
import { TextField } from 'consta-uikit-fork/TextField';

import { TranslateFunction, tKeys } from 'services/i18n';

import './AuthForm.scss';


interface IHandlerData {
  email: string;
  password: string;
}

interface IProps {
  t: TranslateFunction;
  onSubmitButtonClickHadler(data: IHandlerData): void;
}

interface IState {
  email: string;
  password: string;
  isLoading: boolean;
}

const b = block('auth-form');
const { authorization: intl } = tKeys.features;

class AuthForm extends React.Component<IProps, IState> {
  public state = { email: '', password: '', isLoading: false };

  public render() {
    const { t } = this.props;
    const { email, password, isLoading } = this.state;

    return (
      <div className={b()}>
        <div className={b('header')}>
          {t(intl.login)}
        </div>
        <label htmlFor="userName">{t(intl.email)}</label>
        <div className={b('email-wrapper')}>
          <TextField
            id="userName"
            width="full"
            value={email}
            onChange={this.onTextInputChange}
          />
        </div>
        <label htmlFor="pass">{t(intl.password)}</label>
        <div className={b('password-wrapper')}>
          <TextField
            type="password"
            id="pass"
            width="full"
            value={password}
            onChange={this.onTextInputChange}
            onKeyDown={event => this.onPasswordInputKeyDown(event)}
          />
        </div>
        <Button
          label={t(intl.signIn) as string}
          width="full"
          loading={isLoading}
          onClick={this.onSubmitButtonClick}
        />
      </div>
    );
  }

  @autobind
  private onSubmitButtonClick() {
    const { onSubmitButtonClickHadler } = this.props;
    const { email, password } = this.state;
    this.setState({ isLoading: true });
    onSubmitButtonClickHadler({ email, password });
  }

  private onPasswordInputKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.keyCode === 13) {
      const { onSubmitButtonClickHadler } = this.props;
      const { email, password } = this.state;
      this.setState({ isLoading: true });
      onSubmitButtonClickHadler({ email, password });
    }
  }

  @autobind
  private onTextInputChange(args: any) {
    if (args.e.target.type === 'password') {
      this.setState({ password: args.value });
    } else {
      this.setState({ email: args.value });
    }
  }
}

export { AuthForm };
