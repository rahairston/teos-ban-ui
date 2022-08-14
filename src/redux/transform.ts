import { createTransform } from 'redux-persist';
import { axiosInstance } from '../util/axios';

const SetTransform = createTransform(
  // set accessToken interceptor on a refresh
  (inboundState: any, key) => {
    if (key === 'auth') {
      const {accessToken, expiresAt} = inboundState;
      if (Math.floor(Date.now() / 1000) >= expiresAt) { // Don't rehydrate expired auth
        return {};
      } else {
        if (!!accessToken) {
          axiosInstance.interceptors.request.use(config => {
            if (config && config.headers) {
              config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
          });
        }
        return inboundState;
      }
    } else if (key === 'alert') {
      return {};
    } else {
      return inboundState;
    }
  },
  // transform state being rehydrated
  (outboundState: any, key) => {
    return outboundState;
  },
  // define which reducers this transform gets called for.
  { whitelist: ['auth', 'alert'] }
);

export default SetTransform;