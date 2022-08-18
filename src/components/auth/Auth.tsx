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
import { PulseLoader } from 'react-spinners';
import { loaderOverride } from '../../util/common';

interface IProps {
    login: (authCode: string) => void;
    loggingIn?: boolean;
    errorMessage?: string;
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
  const {accessToken, loggingIn} = props;

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
        {!loggingIn && <div>
          <header className="Auth-header">
            Welcome to Teo's Ban Appeals
          </header>
          Log in <a className="twitch-logo" href={twitchUrl}><FontAwesomeIcon color="#6441A5" icon={faTwitch} /></a>
        </div>}
        <PulseLoader loading={!!loggingIn} color='#ffff00' cssOverride={loaderOverride} size={20}/>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return { 
    loggingIn: state.auth.loggingIn,
    errorMessage: state.alert.errorMessage,
    accessToken: state.auth.accessToken
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (authCode: string) => LoginAction(authCode)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
