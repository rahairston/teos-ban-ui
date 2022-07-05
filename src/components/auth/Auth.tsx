import { connect, useSelector } from 'react-redux';
import { BanState } from '../../redux/state';
import { Dispatch } from 'redux';
import { useSearchParams } from "react-router-dom";
import { LoginAction } from './reducer';

import { clientId, redirectUri } from "../../constants";

interface IProps {
    login: (authCode: string) => void;
}

interface IBanState {
  auth: IState;
}

interface IState {
  displayName?: string;
  profilePicture?: string;
  accessToken?: string;
}

function Auth(props: IProps) {
  let [searchParams, setSearchParams] = useSearchParams();
  const displayName = useSelector((state: IBanState) => state.auth.displayName);
  const accessToken = useSelector((state: IBanState) => state.auth.accessToken);

  let code = searchParams.get("code");

  if (code && !accessToken) {
    console.log(code);
    props.login(code);
  } else if (accessToken && code) {
    searchParams.delete("code");
    searchParams.delete("scope");
    setSearchParams({});
  }

  const twitchUrl = "https://id.twitch.tv/oauth2/authorize";
  const link = `${twitchUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=user%3Aread%3Aemail`
  
  return (
    <div className="Auth">
        <header className="App-header">
          {!accessToken && <a href={link}>Connect with Twitch</a>}
          <p>Welcome {displayName}</p>
        </header>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return { 
    displayName: state.displayName,
    profilePicture: state.profilePicture,
    accessToken: state.accessToken
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (authCode: string) => LoginAction(authCode)(dispatch),
    logout: () => dispatch({ type: 'logout' })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
