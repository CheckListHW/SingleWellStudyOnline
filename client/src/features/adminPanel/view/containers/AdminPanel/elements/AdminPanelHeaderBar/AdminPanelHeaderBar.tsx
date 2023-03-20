import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { Header, HeaderMenu } from 'consta-uikit-fork/Header';
import { IconExit } from 'consta-uikit-fork/IconExit';
import { IconLineAndBarChart } from 'consta-uikit-fork/IconLineAndBarChart';

import { TranslateFunction, tKeys } from 'services/i18n';
import { RoutesTypes } from 'shared/types/routes';
import { ButtonWithTooltip } from 'shared/view/elements/ButtonWithTooltip/ButtonWithTooltip';

import './AdminPanelHeaderBar.scss';


interface IProps {
  menuItems: Item[];
  adminData: { adminEmail: string; };
  t: TranslateFunction;
  onRedirectHandler(to: RoutesTypes): void;
  onLogoutButtonClickHadler(): void;
}

interface Item {
  label?: string;
  href?: string;
  target?: string;
  active?: boolean;
  onClick?: React.EventHandler<React.MouseEvent>;
  children?: never;
}

const b = block('admin-panel-header-bar');
const { shared: sharedIntl } = tKeys;

class AdminPanelHeaderBar extends React.Component<IProps> {
  public render() {
    const {
      menuItems,
      adminData: { adminEmail },
      t,
      onRedirectHandler,
    } = this.props;

    return (
      <Header
        leftSide={(
          <>
            <div className={b('wrap')}>
              <div className={b('head')}>
                {`${t(sharedIntl.platformName)} Admin Panel`}
              </div>
            </div>
            <div className={b('wrap')}>
              {adminEmail !== '' ? `${adminEmail}` : 'Anonymous admin'}
            </div>
            <HeaderMenu items={menuItems} />
          </>
        )}
        rightSide={(
          <>
            <div className={b('inner-wrapper')}>
              <ButtonWithTooltip
                iconLeft={IconLineAndBarChart}
                onlyIcon
                tooltipProps={{ content: 'Зайти как пользователь' }}
                onClick={() => onRedirectHandler('login')}
              />
            </div>
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
  private onLogoutButtonClick(): void {
    const { onLogoutButtonClickHadler } = this.props;
    onLogoutButtonClickHadler();
  }
}

export { AdminPanelHeaderBar };
