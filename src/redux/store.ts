import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../components/auth/reducer';
import alertReducer from '../components/alert/reducer';
import appealReducer from '../components/appeals/reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
    appeal: appealReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
