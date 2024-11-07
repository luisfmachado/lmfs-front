import { environment } from '../../environments/environment';

export const SystemConstants = {
  ...environment,
  api: {
    url: `${environment.protocol}${environment.resource}/api`,
    fwt: `${environment.protocol}${environment.resource}`,
  },
};
