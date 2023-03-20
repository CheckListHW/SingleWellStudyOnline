import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { Header, HeaderMenu } from 'consta-uikit-fork/Header';
import { IconExit } from 'consta-uikit-fork/IconExit';
import { IconCalculator } from 'consta-uikit-fork/IconCalculator';
import { IconCheck } from 'consta-uikit-fork/IconCheck';
import { IconAdd } from 'consta-uikit-fork/IconAdd';
import { IconRemove } from 'consta-uikit-fork/IconRemove';
import { IconDownload } from 'consta-uikit-fork/IconDownload';

import { TranslateFunction, tKeys } from 'services/i18n';
import { ButtonWithTooltip } from 'shared/view/elements/ButtonWithTooltip/ButtonWithTooltip';

import './MainHeaderBar.scss';


interface IProps {
  menuItems: Item[];
  personalData: IPersonalData;
  saving?: boolean;
  scale?: string;
  t: TranslateFunction;
  onLogoutButtonClickHadler(): void;
  onSaveButtonClickHadler?(): void;
  onCalcButtonClickHandler?(): void;
  onDownloadButtonClickHandler?(): void;
  onChangeScaleButtonClickHandler?(type: 'increase' | 'decrease'): void;
}

interface Item {
  label?: string;
  href?: string;
  target?: string;
  active?: boolean;
  onClick?: React.EventHandler<React.MouseEvent>;
  children?: never;
}

interface IPersonalData {
  email: string;
  name: string;
  surname: string;
  speciality: string;
  course: string;
  experience: number;
}

const b = block('main-header-bar');
const { shared: sharedIntl } = tKeys;

class MainHeaderBar extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.getSettingsForOnWheelEvent();
  }

  public render() {
    const {
      menuItems,
      personalData: { name, surname, speciality, course, experience },
      saving,
      scale,
      t,
      onSaveButtonClickHadler,
      onCalcButtonClickHandler,
      onDownloadButtonClickHandler,
      onChangeScaleButtonClickHandler,
    } = this.props;

    return (
      <Header
        leftSide={(
          <>
            <div className={b('wrap')}>
              <div className={b('head')}>
                {t(sharedIntl.platformName)}
              </div>
            </div>
            <div className={b('wrap')}>
              {name !== '' ? `${surname} ${name}, ${speciality}, ${course}, ${t(sharedIntl.experience)}: ${experience}` : 'Anonymous'}
            </div>
            <HeaderMenu items={menuItems} />
          </>
        )}
        rightSide={(
          <>
            {onChangeScaleButtonClickHandler && (
              <>
                <div className={b('inner-wrapper')}>
                  <ButtonWithTooltip
                    iconLeft={IconRemove}
                    onlyIcon
                    tooltipProps={{ content: t(sharedIntl.decreaseScale) }}
                    onClick={() => onChangeScaleButtonClickHandler('decrease')}
                  />
                </div>
                {scale && (
                  <div className={b('inner-wrapper')} onWheel={this.onScaleWheel}>
                    <div className={b('scale-wrapper')}>
                      {scale}
                    </div>
                  </div>
                )}
                <div className={b('inner-wrapper')}>
                  <ButtonWithTooltip
                    iconLeft={IconAdd}
                    onlyIcon
                    tooltipProps={{ content: t(sharedIntl.increaseScale) }}
                    onClick={() => onChangeScaleButtonClickHandler('increase')}
                  />
                </div>
              </>
            )}
            {onCalcButtonClickHandler && (
              <div className={b('inner-wrapper')}>
                <ButtonWithTooltip
                  iconLeft={IconCalculator}
                  onlyIcon
                  tooltipProps={{ content: t(sharedIntl.calculator) }}
                  onClick={onCalcButtonClickHandler}
                />
              </div>
            )}
            {onDownloadButtonClickHandler && (
              <div className={b('inner-wrapper')}>
                <ButtonWithTooltip
                  iconLeft={IconDownload}
                  onlyIcon
                  tooltipProps={{ content: t(sharedIntl.download) }}
                  onClick={onDownloadButtonClickHandler}
                />
              </div>
            )}
            {onSaveButtonClickHadler && (
              <div className={b('inner-wrapper')}>
                <ButtonWithTooltip
                  iconLeft={IconCheck}
                  onlyIcon
                  loading={saving}
                  tooltipProps={{ content: t(sharedIntl.save) }}
                  onClick={this.onSaveButtonClick}
                />
              </div>
            )}
            <ButtonWithTooltip
              iconLeft={IconExit}
              onlyIcon
              tooltipProps={{ content: t(sharedIntl.logout) }}
              onClick={this.onLogoutButtonClick}
            />
          </>
        )}
      />
    );
  }

  @autobind
  private onScaleWheel(event: any): void {
    event.preventDefault();
    const { deltaY } = event;
    const { onChangeScaleButtonClickHandler } = this.props;
    if (onChangeScaleButtonClickHandler && deltaY < 0) {
      onChangeScaleButtonClickHandler('increase');
    } else if (onChangeScaleButtonClickHandler && deltaY > 0) {
      onChangeScaleButtonClickHandler('decrease');
    }
  }

  @autobind
  private onLogoutButtonClick(): void {
    const { onLogoutButtonClickHadler } = this.props;
    onLogoutButtonClickHadler();
  }

  @autobind
  private onSaveButtonClick(): void {
    const { onSaveButtonClickHadler } = this.props;
    if (onSaveButtonClickHadler) {
      onSaveButtonClickHadler();
    }
  }

  // TODO эта грязь нужна потому, что обработчик событий колеса мыши пассивный,
  // а в нем нельзя юзать preventDefault,
  // как следствие кастомная обработка скрола на шкале процентов не работала нормально
  // eslint-disable-next-line class-methods-use-this
  private getSettingsForOnWheelEvent() {
    const EVENTS_TO_MODIFY = ['wheel'];

    const originalAddEventListener = document.addEventListener;
    document.addEventListener = (type: any, listener: any, options: any) => {
      let modOptions = options;
      if (EVENTS_TO_MODIFY.includes(type)) {
        if (typeof options === 'boolean') {
          modOptions = {
            capture: options,
            passive: false,
          };
        } else if (typeof options === 'object') {
          modOptions = {
            passive: false,
            ...options,
          };
        }
      }
      return originalAddEventListener(type, listener, modOptions);
    };

    const originalRemoveEventListener = document.removeEventListener;
    document.removeEventListener = (type: any, listener: any, options: any) => {
      let modOptions = options;
      if (EVENTS_TO_MODIFY.includes(type)) {
        if (typeof options === 'boolean') {
          modOptions = {
            capture: options,
            passive: false,
          };
        } else if (typeof options === 'object') {
          modOptions = {
            passive: false,
            ...options,
          };
        }
      }
      return originalRemoveEventListener(type, listener, modOptions);
    };
  }
}

export { MainHeaderBar };
