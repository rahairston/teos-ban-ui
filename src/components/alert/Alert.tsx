import './Alert.css'
import { Message } from "semantic-ui-react";
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Dispatch } from 'redux';
import { clearError, clearInfo, clearSuccess } from "./reducer";

interface IProps {
  clearInfo: () => void;
  clearError: () => void;
  clearSuccess: () => void;
  info?: boolean;
  infoHeader?: string;
  infoMessage?: string;
  success?: boolean;
  successHeader?: string;
  successMessage?: string;
  error?: boolean;
  errorHeader?: string;
  errorMessage?: string;
}

const genericAlert = (info: boolean, error: boolean, success: boolean, header: string, message: string | undefined, onClick: () => void) => {
  return (
    <Message className="alert-message" info={info} negative={error} success={success} onClick={() => onClick()}>
      <Message.Header>{header}</Message.Header>
      <Message.Content>{message}</Message.Content>
    </Message>
  );
}

function Alert(props: IProps) {
  const { clearInfo, clearError, clearSuccess, 
    info, infoHeader, infoMessage, 
    error, errorHeader, errorMessage, 
    success, successHeader, successMessage } = props;

  return (
    <div className="Alert">
      {info && genericAlert(true, false, false, `Info: ${infoHeader}`, infoMessage, clearInfo)}
      {error && genericAlert(false, true, false, `Error: ${errorHeader}`, errorMessage, clearError)}
      {success && genericAlert(false, false, true, `Success: ${successHeader}`, successMessage, clearSuccess)}
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
    successMessage: alert.successMessage
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