import React from 'react';
import { Route } from 'react-router-dom';

import { routes } from 'modules/routes';
import { IModule } from 'shared/types/app';

import { BuildTraceLayout } from './view/components';

const BuildTrace: IModule = {
  getRoutes() {
    return (
      <Route
        key={routes['build-trace'].getElementKey()}
        path={routes['build-trace'].getRoutePath()}
        component={BuildTraceLayout}
      />
    );
  },
};

export { BuildTrace };
