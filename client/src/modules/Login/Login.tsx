import React from 'react';
import { Route } from 'react-router-dom';

import { routes } from 'modules/routes';
import { IModule } from 'shared/types/app';

import { LoginLayout } from './view/components';

const Login: IModule = {
  getRoutes() {
    return (
      <Route
        key={routes.login.getElementKey()}
        path={routes.login.getRoutePath()}
        component={LoginLayout}
      />
    );
  },
};

export { Login };
