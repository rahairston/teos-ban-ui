import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './components/App';

import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { persistor, store } from "./redux/store";
import { PersistGate } from 'redux-persist/integration/react';

const container = document.getElementById('root') as HTMLElement;

// Create a root.
const root = ReactDOMClient.createRoot(container);

root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  // {/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
