import './Alert.css'
import { Message } from "semantic-ui-react";
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Dispatch } from 'redux';
import { clearError, clearInfo, clearSuccess } from "./reducer";
import { Link } from 'react-router-dom';

interface IProps {
  clearInfo: () => void;
  clearError: () => void;
  clearSuccess: () => void;
  info?: boolean;
  infoHeader?: string;
  infoMessage?: string;
  success?: boolean;
  successHeader?: string;
  successLink?: string;
  successLinkText?: string;
  successMessage?: string;
  error?: boolean;
  errorHeader?: string;
  errorMessage?: string;
}

const genericAlert = (info: boolean, error: boolean, success: boolean, 
  header: string, message: string | undefined, link: string | undefined, linkText: string | undefined ,onClick: () => void) => {
  return (
    <Message className="alert-message" info={info} negative={error} success={success} onClick={() => onClick()} onDismiss={() => onClick()}>
      <Message.Header>{header}</Message.Header>
      <Message.Content>
        {message} {!!link && <Link to={link}>{linkText}</Link>}
      </Message.Content>
    </Message>
  );
}

function Alert(props: IProps) {
  const { clearInfo, clearError, clearSuccess, 
    info, infoHeader, infoMessage, 
    error, errorHeader, errorMessage, 
    success, successHeader, successLink, successLinkText, successMessage } = props;

  return (
    <div className="Alert">
      <div className='Alert-body'>
        {!!info && genericAlert(true, false, false, `Info: ${infoHeader}`, infoMessage, undefined, undefined, clearInfo)}
        {!!error && genericAlert(false, true, false, `Error: ${errorHeader}`, errorMessage, undefined, undefined, clearError)}
        {!!success && genericAlert(false, false, true, `Success: ${successHeader}`, successMessage, successLink, successLinkText, clearSuccess)}
      </div>
    </div>
  );
}

const mapStateToProps = (state: BanState) => {
  const { alert } = state;
  return {
    info: alert.info,
    infoHeader: alert.infoHeader,
    infoMessage: alert.infoMessage,
    error: alert.error,
    errorHeader: alert.errorHeader,
    errorMessage: alert.errorMessage,
    success: alert.success,
    successHeader: alert.successHeader,
    successMessage: alert.successMessage,
    successLink: alert.successLink,
    successLinkText: alert.successLinkText,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    clearInfo: () => dispatch(clearInfo()),
    clearError: () => dispatch(clearError()),
    clearSuccess: () => dispatch(clearSuccess())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Alert);