/* eslint-disable react/no-did-update-set-state */

import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { Button } from 'consta-uikit-fork/Button';
import { TextField } from 'consta-uikit-fork/TextField';
import { Badge } from 'consta-uikit-fork/Badge';

import { TranslateFunction, tKeys } from 'services/i18n';
import { IPersonalData } from 'shared/types/models';
import { INotification } from 'shared/types/common';

import './PersonalDataForm.scss';


interface IProps {
  initData: IPersonalData;
  t: TranslateFunction;
  onSavePersonalDataButtonClickHandler(personalData: IPersonalData): void;
  onWarningEventHandler?(notification: INotification): void;
}

interface IState {
  data: IPersonalData;
}

const b = block('personal-data-form');
const { privateArea: intl } = tKeys.features;
const { shared: sharedIntl, warningMessages: warnIntl } = tKeys;

class PersonalDataForm extends React.Component<IProps, IState> {
  public state = {
    data: this.props.initData,
  };

  componentDidUpdate(prevProps: IProps) {
    const { initData } = this.props;
    const isPropsDataEquil = Object.keys(prevProps.initData)
      .reduce((acc, item: keyof IPersonalData) => {
        if (prevProps.initData[item] !== initData[item]) {
          return false;
        }
        return acc;
      }, true);
    if (!isPropsDataEquil) {
      this.setState({ data: initData });
    }
  }

  public render() {
    const { data: {
      name,
      surname,
      speciality,
      course,
      experience,
      expectations,
    } } = this.state;
    const { t } = this.props;

    return (
      <div className={b()}>
        <div className={b('header')}>
          <Badge label={t(intl.userData)} size="l" />
        </div>
        <div className={b('field-name-wrapper')}>
          {t(intl.name)}
        </div>
        <TextField
          id="1"
          value={name}
          width="full"
          onChange={this.onNameInputChange}
        />
        <div className={b('field-name-wrapper')}>
          {t(intl.surname)}
        </div>
        <TextField
          id="2"
          value={surname}
          width="full"
          onChange={this.onSurnameInputChange}
        />
        <div className={b('field-name-wrapper')}>
          {t(intl.specialty)}
        </div>
        <TextField
          id="3"
          value={speciality}
          width="full"
          onChange={this.onSpecialtyInputChange}
        />
        <div className={b('field-name-wrapper')}>
          {t(intl.course)}
        </div>
        <TextField
          id="4"
          value={course}
          width="full"
          onChange={this.onCourseInputChange}
        />
        <div className={b('field-name-wrapper')}>
          {t(intl.experience)}
        </div>
        <TextField
          id="5"
          type="number"
          value={String(experience)}
          onChange={this.onExperienceInputChange}
          width="full"
        />
        <div className={b('field-name-wrapper')}>
          {t(intl.expectations)}
        </div>
        <TextField
          id="6"
          value={expectations}
          type="textarea"
          minRows={7}
          width="full"
          onChange={this.onExpectationsInputChange}
        />
        <div className={b('button-wrapper')}>
          <Button
            label={t(sharedIntl.save) as string}
            onClick={this.onSaveButtonClick}
          />
        </div>
      </div>
    );
  }

  @autobind
  private onSaveButtonClick() {
    const { onSavePersonalDataButtonClickHandler, onWarningEventHandler, t } = this.props;
    const { data, data: {
      name,
      surname,
      speciality,
      course,
      experience,
      expectations,
    } } = this.state;
    const areFieldsNotEmpty = name && surname
      && speciality && course && expectations
      && experience >= 0 && experience <= 100;
    if (areFieldsNotEmpty) {
      onSavePersonalDataButtonClickHandler(data);
    } else if (onWarningEventHandler) {
      onWarningEventHandler({
        text: t(warnIntl.fieldsAreRequired),
        kind: 'warning',
      });
    }
  }

  @autobind
  private onNameInputChange(args: any) {
    const { data } = this.state;
    this.setState({ data: { ...data, name: args.value } });
  }

  @autobind
  private onSurnameInputChange(args: any) {
    const { data } = this.state;
    this.setState({ data: { ...data, surname: args.value } });
  }

  @autobind
  private onSpecialtyInputChange(args: any) {
    const { data } = this.state;
    this.setState({ data: { ...data, speciality: args.value } });
  }

  @autobind
  private onCourseInputChange(args: any) {
    const { data } = this.state;
    this.setState({ data: { ...data, course: args.value } });
  }

  @autobind
  private onExperienceInputChange(args: any) {
    const value = Number(args.value);
    const { data } = this.state;
    const correctedMaxExperienceLevel = (level: number) => (level > 100 ? 100 : value);
    this.setState({ data: {
      ...data,
      experience: value < 0
        ? 0
        : correctedMaxExperienceLevel(value),
    } });
  }

  @autobind
  private onExpectationsInputChange(args: any) {
    const { data } = this.state;
    this.setState({ data: { ...data, expectations: args.value } });
  }
}

export { PersonalDataForm };
