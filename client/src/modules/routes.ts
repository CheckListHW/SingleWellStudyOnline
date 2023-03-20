import { routes as profileRoutes } from './Profile/routes';
import { routes as loginRoutes } from './Login/routes';
import { routes as traceRoutes } from './Trace/routes';
import { routes as buildTraceRoutes } from './BuildTrace/routes';
import { routes as adminPanelRoutes } from './AdminPanel/routes';

export const routes = {
  ...profileRoutes,
  ...loginRoutes,
  ...traceRoutes,
  ...buildTraceRoutes,
  ...adminPanelRoutes,
};
