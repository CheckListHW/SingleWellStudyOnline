import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { RouteComponentProps } from 'react-router-dom';

import { PrivateArea } from 'features/privateArea';
import { RoutesTypes } from 'shared/types/routes';

import { routes } from '../../../../routes';
import './ProfileLayout.scss';


const b = block('profile-layout');

class ProfileLayoutComponent extends React.PureComponent<RouteComponentProps> {
  public render() {
    return (
      <div className={b()}>
        <PrivateArea onRedirectHandler={this.onRedirect} />
      </div>
    );
  }

  @autobind
  private onRedirect(to: RoutesTypes) {
    const { history } = this.props;
    history.push(routes[to].getRoutePath());
  }
}

export { ProfileLayoutComponent as ProfileLayout };
