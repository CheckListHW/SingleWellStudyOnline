import React from 'react';
import { Route } from 'react-router-dom';

import { routes } from 'modules/routes';
import { IModule } from 'shared/types/app';

import { AdminPanelLayout } from './view/components';

const AdminPanel: IModule = {
  getRoutes() {
    return (
      <Route
        key={routes['admin-panel'].getElementKey()}
        path={routes['admin-panel'].getRoutePath()}
        component={AdminPanelLayout}
      />
    );
  },
};

export { AdminPanel };
