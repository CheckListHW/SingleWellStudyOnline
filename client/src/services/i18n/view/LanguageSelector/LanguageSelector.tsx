/* eslint-disable no-restricted-imports */

import React from 'react';
import { autobind } from 'core-decorators';
import { BasicSelect } from 'consta-uikit-fork/BasicSelect';
import { WithTranslation, withTranslation } from 'react-i18next';

import { Lang } from 'shared/types/app';

import './LanguageSelector.scss';

interface IOption {
  value: Lang;
  label: string;
}

const options: IOption[] = [
  { value: 'en-US', label: 'English' },
  { value: 'ru-RU', label: 'Русский' },
];

class LanguageSelectorComponent extends React.PureComponent<WithTranslation> {
  public render() {
    const { i18n: { language } } = this.props;

    return (
      <BasicSelect
        value={{ value: language, label: language === 'en-US' ? 'English' : 'Русский' }}
        options={options}
        id="language-selector"
        getOptionLabel={(option: IOption): string => option.label}
        onChange={this.changeLanguage}
      />
    );
  }

  @autobind
  private changeLanguage(option: IOption) {
    const { i18n } = this.props;
    i18n.changeLanguage(option.value);
  }
}

const LanguageSelector = withTranslation()(LanguageSelectorComponent);

export { LanguageSelector, LanguageSelectorComponent };
