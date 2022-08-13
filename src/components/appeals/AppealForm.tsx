import './form.css';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Button, Form } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { isUserAdmin } from '../../util/common';
import { AppealRequest } from './api';
import { submit } from './reducer';

interface IProps {
  submit: (request: AppealRequest) => void;
  twitchUsername?: string;
  roles?: string[];
  isSubmitting: boolean;
}

interface IErrors {
  [key: string]: string | undefined;
  twitchUsername?: string;
  discordUsername?: string;
  banReason?: string;
  appealReason?: string;
}

enum BanType {
  TWITCH,
  DISCORD,
  BOTH
}

const validateSubmit = (data: AppealRequest, twitchUsername: string, roles: string[], setErrors: any, submit: (request: AppealRequest) => void) => {
  const err: IErrors = {};
  if (isUserAdmin(roles) && data.twitchUsername !== twitchUsername) {
    err.twitchUsername = "Twitch username does not match input name";
  }

  if (data.banType !== BanType.TWITCH.toString() && !!data.discordUsername) {
    err.discordUsername = "Discord username must be provided if the ban type is Discord or Both";
  }

  if (!data.banReason) {
    err.banReason = "Ban reason must not be empty."
  } else if (data.banReason.length < 10) { 
    err.banReason = "Ban reason must be 10 characters minimum."
  }

  if (!data.appealReason) {
    err.appealReason = "Appeal reason must not be empty."
  } else if (data.appealReason.length < 10) { 
    err.banReason = "Appeal reason must be 10 characters minimum."
  }

  if (Object.keys(err).length > 0) {
    setErrors(err);
  } else {
    submit(data);
  }
};

const onFormChange = (key: string, value: any, errors: IErrors, setError: any, change: any) => {
  change(value);
  if (errors[key]) {
    errors[key] = undefined;
    setError(errors);
  }
}

function AppealForm(props: IProps) {

  const [errors, setErrors] = useState({} as IErrors)
  const [username, setUsername] = useState("");
  const [banType, setBanType] = useState(BanType.TWITCH)
  const [discordName, setDiscordName] = useState("");
  const [banReason, setBanReason] = useState("");
  const [banJustified, setBanJustified] = useState(true);
  const [appealReason, setAppealReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const { twitchUsername = '', roles = [], submit } = props;

  const data = {
    twitchUsername: (isUserAdmin(roles) && !!username) ? username : twitchUsername,
    discordUsername: banType === BanType.TWITCH ? undefined: discordName,
    banType: banType.toString(),
    banReason,
    banJustified,
    appealReason,
    additionalNotes,
    previousAppealId: "",
    additionalData: undefined
  } as AppealRequest;

  return (
    <div className="AppealForm">
      <Form>
        <Form.Field>
          <label className={!!errors.twitchUsername ? 'error' : ''}>Twitch Username</label>
          {!!errors.twitchUsername && <small className='error'>{errors.twitchUsername}</small>}
          <input 
            placeholder={twitchUsername} 
            disabled={!isUserAdmin(roles)} 
            onChange={(e: any) => onFormChange("twitchUsername", e.target.value, errors, setErrors, setUsername)}
          />
        </Form.Field>
        <Form.Field>
          <label>Ban Type</label>
          <Button.Group>
            <Button className="ban-type" active={banType===BanType.TWITCH} onClick={() => setBanType(BanType.TWITCH)}>
              Twitch
            </Button>
            <Button.Or />
            <Button className="ban-type" active={banType===BanType.DISCORD} onClick={() => setBanType(BanType.DISCORD)}>
              Discord
            </Button>
            <Button.Or />
            <Button className="ban-type" active={banType===BanType.BOTH} onClick={() => setBanType(BanType.BOTH)}>
              Both
            </Button>
          </Button.Group>
        </Form.Field>
        {banType !== BanType.TWITCH && <Form.Field>
          <label className={!!errors.discordUsername ? 'error' : ''}>Discord Username</label>
          {!!errors.discordUsername && <small className='error'>{errors.discordUsername}</small>}
          <input 
            placeholder={twitchUsername} 
            onChange={(e: any) => onFormChange("discordUsername", e.target.value, errors, setErrors, setDiscordName)}
          />
        </Form.Field>}
        <Form.Field>
          <label className={!!errors.banReason ? 'error' : ''}>Why were you banned?</label>
          {!!errors.banReason && <small className='error'>{errors.banReason}</small>}
          <textarea 
            placeholder="Enter the reason you were banned here" 
            onChange={(e: any) => onFormChange("banReason", e.target.value, errors, setErrors, setBanReason)}
          />
        </Form.Field>
        <Form.Field>
          <label>Do you think Your ban was justified?</label>
          <Button.Group>
            <Button className="ban-type" active={banJustified} onClick={() => setBanJustified(true)}>
              Yes
            </Button>
            <Button.Or />
            <Button className="ban-type" active={!banJustified} onClick={() => setBanJustified(false)}>
              No
            </Button>
          </Button.Group>
        </Form.Field>
        <Form.Field>
          <label className={!!errors.appealReason ? 'error' : ''}>Why do you think you should be unbanned?</label>
          {!!errors.appealReason && <small className='error'>{errors.appealReason}</small>}
          <textarea 
            placeholder="Enter the reason you want to be unbanned" 
            onChange={(e: any) => onFormChange("appealReason", e.target.value, errors, setErrors, setAppealReason)}
          />
        </Form.Field>
        <Form.Field>
          <label>Anything else you'd like to add?</label>
          <textarea placeholder="Enter additional notes here (optional)" onChange={(e: any) => setAdditionalNotes(e.target.value)}/>
        </Form.Field>
        <hr />
        <Button 
          type='submit' 
          disabled={props.isSubmitting} 
          onClick={() =>validateSubmit(data, twitchUsername, roles, setErrors, submit)}
          >
            Submit
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    isSubmitting: state.appeal.isSubmitting,
    twitchUsername: state.auth.displayName,
    roles: state.auth.roles
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    submit: (request: AppealRequest) => submit(request)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppealForm);
