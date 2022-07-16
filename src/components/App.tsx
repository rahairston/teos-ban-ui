import './App.css';
import { connect } from 'react-redux';
import Auth from './auth/Auth';
import { BanState } from '../redux/state';
import { Button } from 'semantic-ui-react';
import { axiosInstance } from '../util/axios';
import Nav from './nav/Nav';

interface IProps {
  displayName?: string;
  profilePicture?: string;
  accessToken?: string;
}

const go = (token: string|undefined) => {
  axiosInstance.get("http://localhost:8080/v1/teosban/appeal/").then(data => console.log(data));
}

function App(props: IProps) {

  const {accessToken} = props;
  
  return (
    <div className="App">
        <Nav />
        <header className="App-header">
        {!accessToken && <Auth />}
        {/* <Button onClick={()=>go(accessToken)}>Hi</Button> */}
        </header>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return { 
    displayName: state.auth.displayName,
    profilePicture: state.auth.profilePicture,
    accessToken: state.auth.accessToken
  }
}

export default connect(mapStateToProps, null)(App);
