import './App.css';
import { connect } from 'react-redux';
import Auth from './auth/Auth';
import { Dispatch } from 'redux';
import { BanState } from '../redux/state';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Nav from './nav/Nav';
import Alert from './alert/Alert';
import AppealForm from './appeals/AppealForm';
import AppealView from './appeals/AppealView';
import Redirect from './redirect/redirect';
import { useEffect } from 'react';
import { TokenResponse } from './auth/api';
import { TokenShared } from './auth/reducer';

interface IProps {
  displayName?: string;
  profilePicture?: string;
  accessToken?: string;
  expiresAt?: number;
  refreshToken?: string;
  roles?: string[];
  email?: string;
  setupRefresh: (data: TokenResponse) => void;
}

function App(props: IProps) {

  const {accessToken, displayName, refreshToken,
    profilePicture, expiresAt, roles, email, setupRefresh} = props;

  useEffect(() => {
    return () => {
      if (accessToken && expiresAt) {
        const data = {
          displayName,
          profileImageUrl: profilePicture,
          accessToken,
          refreshToken,
          email,
          roles,
          expiresIn: (expiresAt - Math.floor(Date.now() / 1000))
        } as TokenResponse;

        setupRefresh(data);
      }
    };
  });
  
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Alert />
          <header className="App-header">
          {!accessToken && <Auth />}
        </header>
        <Routes>
          <Route path="/" element={<div></div>} />
          <Route path="/submitAppeal" element={<AppealForm />} />
          <Route path="/appeals/:id" element={<AppealView />} />
          <Route path="/redirect" element={<Redirect />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return { 
    displayName: state.auth.displayName,
    profilePicture: state.auth.profilePicture,
    accessToken: state.auth.accessToken,
    refreshToken: state.auth.refreshToken,
    expiresAt: state.auth.expiresAt,
    roles: state.auth.roles,
    email: state.auth.email
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setupRefresh: (data: TokenResponse) => TokenShared(data)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
