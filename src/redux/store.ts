import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../components/auth/reducer';
import alertReducer from '../components/alert/reducer';
import appealReducer from '../components/appeal/reducer';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import thunk from 'redux-thunk';
import SetTransform from './transform';
import appealsReducer from '../components/appeals/reducer';
import bannedByReducer from '../components/mod/bannedBy/reducer';
import evidenceReducer from '../components/mod/evidence/reducer';


const persistConfig = {
  key: 'root',
  storage,
  transforms: [SetTransform]
}

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  appeal: appealReducer,
  appeals: appealsReducer,
  bannedBy: bannedByReducer,
  evidence: evidenceReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
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
