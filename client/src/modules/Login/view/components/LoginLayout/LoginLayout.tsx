import React from 'react';
import block from 'bem-cn';
import { RouteComponentProps } from 'react-router-dom';

import { LanguageSelector } from 'services/i18n';
import { Authorization } from 'features/authorization';

import './LoginLayout.scss';


const b = block('login-layout');

class LoginLayoutComponent extends React.PureComponent<RouteComponentProps> {
  public render() {
    return (
      <div className={b()}>
        <div className={b('language-selector')}>
          <div className={b('language-selector-text-wrapper')}>
            Язык / Language
          </div>
          <div className={b('language-selector-wrapper')}>
            <LanguageSelector />
          </div>
        </div>
        <Authorization />
      </div>
    );
  }
}

export { LoginLayoutComponent as LoginLayout };
