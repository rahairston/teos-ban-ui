import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './components/App';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { persistor, store } from "./redux/store";
import Nav from './components/nav/Nav';
import Alert from './components/alert/Alert';
import AppealForm from './components/appeals/AppealForm';
import { PersistGate } from 'redux-persist/integration/react';
import AppealView from './components/appeals/AppealView';

const container = document.getElementById('root') as HTMLElement;

// Create a root.
const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <Nav />
          <Alert />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/submitAppeal" element={<AppealForm />} />
            <Route path="/appeals/:id" element={<AppealView />} />
            <Route path="/redirect" element={<App />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
