import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../components/auth/reducer';
import alertReducer from '../components/alert/reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer
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
