import './App.css';
import { connect } from 'react-redux';
import Auth from './auth/Auth';
import { BanState } from '../redux/state';
import Nav from './nav/Nav';

interface IProps {
  displayName?: string;
  profilePicture?: string;
  accessToken?: string;
}

function App(props: IProps) {

  const {accessToken} = props;
  
  return (
    <div className="App">
        <Nav />
        <header className="App-header">
        {!accessToken && <Auth />}
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
