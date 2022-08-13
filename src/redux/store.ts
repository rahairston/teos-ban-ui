import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../components/auth/reducer';
import alertReducer from '../components/alert/reducer';
import appealReducer from '../components/appeals/reducer';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  appeal: appealReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
