import './Auth.css'
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Dispatch } from 'redux';
import { useSearchParams } from "react-router-dom";
import { LoginAction } from './reducer';
import BuildUrl from 'build-url';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';

import { clientId, redirectUri, OAUTH_STATE_KEY } from "../../constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
    login: (authCode: string) => void;
    displayName?: string;
    profilePicture?: string;
    accessToken?: string;
}

const generateState = () => {
	const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let array = new Uint8Array(40);
	window.crypto.getRandomValues(array);
	const numbers = Array.from(array).map((x) => {
    let y = validChars.codePointAt(x % validChars.length)
    return y ? y : 0;
  });
	const randomState = String.fromCharCode.apply(null, numbers);
  sessionStorage.setItem(OAUTH_STATE_KEY, randomState);
	return randomState;
};

function Auth(props: IProps) {
  let [searchParams, setSearchParams] = useSearchParams();
  const {accessToken} = props;

  let code = searchParams.get("code");
  let authState = searchParams.get("state");

  if (code && !accessToken && authState === sessionStorage.getItem(OAUTH_STATE_KEY)) {
    props.login(code);
  } else if (code && (accessToken || authState !== sessionStorage.getItem(OAUTH_STATE_KEY))) {
    searchParams.delete("code");
    searchParams.delete("scope");
    searchParams.delete("state");
    setSearchParams({});
  }

  const urlState = generateState();

  const id_claims = `{"picture":null, "email":null, "email_verified":null, "preferred_username": null}`;
  const user_claims = `{"email":null, "preferred_username": null}`;

  const twitchUrl = BuildUrl("https://id.twitch.tv/oauth2/authorize", {
    queryParams: {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid user:read:email",
      claims: `{"id_token": ${id_claims}, "userinfo": ${user_claims}}`,
      state: urlState,
      nonce: urlState
    }
  });
  
  return (
    <div className="Auth">
        <header className="Auth-header">
          Welcome to Teo's Ban Appeals
        </header>
        Log in <a className="twitch-logo" href={twitchUrl}><FontAwesomeIcon color="#6441A5" icon={faTwitch} /></a>
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

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (authCode: string) => LoginAction(authCode)(dispatch),
    logout: () => dispatch({ type: 'logout' })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
