import { createTransform } from 'redux-persist';
import { axiosInstance } from '../util/axios';

const SetTransform = createTransform(
  (inboundState: any, key) => {
    if (key === 'auth') {
      const {expiresAt} = inboundState;
      if (Math.floor(Date.now() / 1000) >= expiresAt - 10) { // Don't rehydrate expired auth
        return {};
      } else {
        return inboundState;
      }
    } else {
      return inboundState;
    }
  },
  // transform state being rehydrated
  (outboundState: any, key) => {
    if (key === 'auth') {
      const {accessToken, expiresAt} = outboundState;
      if (Math.floor(Date.now() / 1000) >= expiresAt - 10) { // Don't rehydrate expired auth
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
        return outboundState;
      }
    } else if (key === 'alert' || key === 'appeal') {
      return {};
    } else {
      return outboundState;
    }
  },
  // define which reducers this transform gets called for.
  {}
);

export default SetTransform;