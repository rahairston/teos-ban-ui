import './form.css';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Button, Form } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { isUserAdmin, loaderOverride } from '../../util/common';
import { AppealRequest, BanType } from './api';
import { clearAppeal, load, update } from './reducer';
import { PulseLoader } from 'react-spinners';
import { Link, useParams } from 'react-router-dom';

interface IProps {
  displayName?: string;
  twitchUsername?: string;
  roles?: string[];
  isSubmitting: boolean;
  discordUsername?: string;
  banType?: string;
  banReason?: string;
  banJustified?: boolean;
  appealReason?: string;
  additionalNotes?: string;
  previousAppealId?: string;
  additionalData?: string;
  adminNotes? : string;
  isLoading: boolean;
  error?: boolean;
  submit: (appealId: string, request: AppealRequest) => void;
  load: (appealId: string) => void;
  clear: () => void;
}

interface IErrors {
  [key: string]: string | undefined;
  twitchUsername?: string;
  discordUsername?: string;
  banReason?: string;
  appealReason?: string;
}

const validateSubmit = (data: AppealRequest, twitchUsername: string|undefined, roles: string[]|undefined, setErrors: any, 
    submit: (appealId: string, request: AppealRequest) => void, appealId: string|undefined, props: IProps) => {

  const err: IErrors = {};
  if (isUserAdmin(roles) && !!data.twitchUsername && data.twitchUsername !== twitchUsername) {
    err.twitchUsername = "Twitch username does not match input name";
  }

  if ((data.banType !== BanType.TWITCH.toString()) || 
      (!data.banType && props.banType !== BanType.TWITCH.toString())) {
    if (!!props.discordUsername && data.discordUsername !== undefined && data.discordUsername === "") {
      err.discordUsername = "Discord username must be provided if the ban type is Discord or Both";
    } else if (!props.discordUsername && !data.discordUsername) {
      err.discordUsername = "Discord username must be provided if the ban type is Discord or Both";
    }
  }

  if (data.banReason !== undefined && data.banReason.length < 10) { 
    err.banReason = "Ban reason must be 10 characters minimum."
  }

  if (!!data.appealReason && data.appealReason.length < 10) { 
    err.appealReason = "Appeal reason must be 10 characters minimum."
  }

  if (Object.keys(err).length > 0 || !appealId) {
    setErrors(err);
  } else {
    submit(appealId, data);
  }
};

const onFormChange = (key: string, value: any, errors: IErrors, setError: any, change: any) => {
  change(value);
  if (errors[key]) {
    errors[key] = undefined;
    setError(errors);
  }
}

const anyChange = (data: any, props: any) : boolean => {
  if (!data) { 
    return false; 
  }

  const changedValues = Object.keys(data).filter((key: string) => {
    return !!data[key]
  });

  return changedValues.filter((key: string) => {
    return data[key] !== props[key]
  }).length > 0;
}

function AppealEdit(props: IProps) {

  const params = useParams();

  const { displayName, isLoading, submit, load, clear, roles} = props;

  const [errors, setErrors] = useState({} as IErrors)
  const [twitchUsername, setUsername] = useState(props.twitchUsername);
  const [banType, setBanType] = useState(props.banType);
  const [discordName, setDiscordName] = useState(props.discordUsername);
  const [banReason, setBanReason] = useState(props.banReason);
  const [banJustified, setBanJustified] = useState(props.banJustified);
  const [appealReason, setAppealReason] = useState(props.appealReason);
  const [additionalNotes, setAdditionalNotes] = useState(props.additionalNotes);
  const [adminNotes, setAdminNotes] = useState(props.adminNotes)

  useEffect(() => {    
    if (params.id) {
      load(params.id);
    }    
    // Specify how to clean up after this effect:    
    return function cleanup() {
      clear();    
    };  
  }, [params.id, load, clear]);

  const data = {
    twitchUsername,
    discordUsername: ((!!banType && banType === BanType.TWITCH) || (!banType && props.banType === BanType.TWITCH)) ? undefined : discordName,
    banType,
    banReason,
    banJustified,
    appealReason,
    additionalNotes,
    previousAppealId: "",
    additionalData: undefined,
    adminNotes
  } as AppealRequest;

  return (
    <div className="AppealForm">
      <PulseLoader loading={!!isLoading} color='#ffff00' cssOverride={loaderOverride} size={20}/>
      {!isLoading && <Form>
        <Form.Field>
          <label className={!!errors.twitchUsername ? 'error' : ''}>Twitch Username</label>
          {!!errors.twitchUsername && <small className='error'>{errors.twitchUsername}</small>}
          <input 
            value={twitchUsername !== undefined ? twitchUsername : props.twitchUsername}
            disabled={!isUserAdmin(roles)} 
            onChange={(e: any) => onFormChange("twitchUsername", e.target.value, errors, setErrors, setUsername)}
          />
        </Form.Field>
        <Form.Field>
          <label>Where were you banned?</label>
          <Button.Group>
            <Button className="ban-type" 
              active={!!banType ? banType===BanType.TWITCH : props.banType===BanType.TWITCH} 
              onClick={() => setBanType(BanType.TWITCH)}
            >
              Twitch
            </Button>
            <Button.Or />
            <Button className="ban-type" 
              active={!!banType ? banType===BanType.DISCORD : props.banType===BanType.DISCORD}
              onClick={() => setBanType(BanType.DISCORD)}
            >
              Discord
            </Button>
            <Button.Or />
            <Button className="ban-type" 
              active={!!banType ? banType===BanType.BOTH : props.banType===BanType.BOTH}
              onClick={() => setBanType(BanType.BOTH)}
            >
              Both
            </Button>
          </Button.Group>
        </Form.Field>
        {((!!banType && banType !== BanType.TWITCH) || (!banType && props.banType !== BanType.TWITCH)) && <Form.Field>
          <label className={!!errors.discordUsername ? 'error' : ''}>Discord Username</label>
          {!!errors.discordUsername && <small className='error'>{errors.discordUsername}</small>}
          <input 
            value={discordName !== undefined ? discordName : props.discordUsername} 
            onChange={(e: any) => onFormChange("discordUsername", e.target.value, errors, setErrors, setDiscordName)}
          />
        </Form.Field>}
        <Form.Field>
          <label className={!!errors.banReason ? 'error' : ''}>Why were you banned?</label>
          {!!errors.banReason && <small className='error'>{errors.banReason}</small>}
          <textarea 
            placeholder="Enter the reason you were banned here" 
            value={!banReason !== undefined ? banReason : props.banReason}
            onChange={(e: any) => onFormChange("banReason", e.target.value, errors, setErrors, setBanReason)}
          />
        </Form.Field>
        <Form.Field>
          <label>Do you think Your ban was justified?</label>
          <Button.Group>
            <Button className="ban-type" active={banJustified !== undefined ? banJustified : props.banJustified} onClick={() => setBanJustified(true)}>
              Yes
            </Button>
            <Button.Or />
            <Button className="ban-type" active={banJustified !== undefined ? !banJustified : !props.banJustified} onClick={() => setBanJustified(false)}>
              No
            </Button>
          </Button.Group>
        </Form.Field>
        <Form.Field>
          <label className={!!errors.appealReason ? 'error' : ''}>Why do you think you should be unbanned?</label>
          {!!errors.appealReason && <small className='error'>{errors.appealReason}</small>}
          <textarea 
            placeholder="Enter the reason you want to be unbanned" 
            value={appealReason !== undefined ? appealReason : props.appealReason}
            onChange={(e: any) => onFormChange("appealReason", e.target.value, errors, setErrors, setAppealReason)}
          />
        </Form.Field>
        <Form.Field>
          <label>Anything else you'd like to add?</label>
          <textarea 
            placeholder="Enter additional notes here (optional)"
            value={additionalNotes !== undefined ? additionalNotes : props.additionalNotes}
            onChange={(e: any) => setAdditionalNotes(e.target.value)}/>
        </Form.Field>
        {isUserAdmin(roles) && <Form.Field>
          <label>Notes from Admin</label>
          <textarea 
            placeholder="Notes from admin to user if anything needs to change"
            value={adminNotes !== undefined ? adminNotes : props.adminNotes}
            onChange={(e: any) => setAdminNotes(e.target.value)}/>
        </Form.Field>}
        <hr />
        <Button 
          type='submit' 
          disabled={props.isSubmitting || !params.id || !anyChange(data, props)} 
          onClick={() => validateSubmit(data, displayName, roles, setErrors, submit, params.id, props)}
          >
            Submit
        </Button>
        <Link to={`/appeals/${params.id}`}>
          <Button floated='right'>
            Go Back
          </Button>
        </Link>
      </Form>}
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    isSubmitting: state.appeal.isSubmitting,
    displayName: state.auth.displayName,
    twitchUsername: state.appeal.twitchUsername,
    discordUsername: state.appeal.discordUsername,
    banType: state.appeal.banType,
    banReason: state.appeal.banReason,
    banJustified: state.appeal.banJustified,
    appealReason: state.appeal.appealReason,
    additionalNotes: state.appeal.additionalNotes,
    previousAppealId: state.appeal.previousAppealId,
    additionalData: state.appeal.additionalData,
    adminNotes: state.appeal.adminNotes,
    judgement: state.appeal.judgement,
    prevPageId: state.appeal.prevPageId,
    nextPageId: state.appeal.nextPageId,
    isLoading: state.appeal.isLoading,
    roles: state.auth.roles,
    error: state.alert.error
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    submit: (appealId: string, request: AppealRequest) => update(appealId, request)(dispatch),
    load: (appealId: string) => load(appealId)(dispatch),
    clear: () => dispatch(clearAppeal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppealEdit);
