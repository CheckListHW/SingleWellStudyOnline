import React from 'react';
import { Route } from 'react-router-dom';

import { routes } from 'modules/routes';
import { IModule } from 'shared/types/app';

import { TraceLayout } from './view/components';

const Trace: IModule = {
  getRoutes() {
    return (
      <Route
        key={routes.trace.getElementKey()}
        path={routes.trace.getRoutePath()}
        component={TraceLayout}
      />
    );
  },
};

export { Trace };
