import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { RouteComponentProps } from 'react-router-dom';

import { TraceBuild } from 'features/traceBuild';
import { RoutesTypes } from 'shared/types/routes';

import { routes } from '../../../../routes';
import './BuildTraceLayout.scss';


const b = block('trace-build-layout');

class BuildTraceLayoutComponent extends React.PureComponent<RouteComponentProps> {
  public render() {
    return (
      <div className={b()}>
        <TraceBuild onRedirectHandler={this.onRedirect} />
      </div>
    );
  }

  @autobind
  private onRedirect(to: RoutesTypes) {
    const { history } = this.props;
    history.push(routes[to].getRoutePath());
  }
}

export { BuildTraceLayoutComponent as BuildTraceLayout };
