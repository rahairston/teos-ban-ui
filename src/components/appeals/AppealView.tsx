import './form.css';
import './view.css';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Button, ButtonGroup, Form, Icon, Input, Label } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { isUserAdmin, loaderOverride } from '../../util/common';
import { load } from './reducer';
import { useParams } from 'react-router-dom';
import { BanType, JudgementResponse } from './api';
import { PulseLoader } from 'react-spinners';
interface IProps {
  load: (appealId: string) => void;
  accessToken?: string;
  appealId?: string;
  twitchUsername?: string;
  discordUsername?: string;
  banType?: string;
  banReason?: string;
  banJustified?: boolean;
  appealReason?: string;
  additionalNotes?: string;
  previousAppealId?: string;
  additionalData?: string;
  judgement?: JudgementResponse;
  isLoading: boolean;
  error?: boolean;
}

function Appeal(props: IProps) {

  const params = useParams();

  const {accessToken, appealId, twitchUsername, discordUsername, banType, 
      banReason, banJustified, appealReason, additionalNotes, judgement,
      previousAppealId, additionalData, isLoading, error} = props;


  if (!error && params.id && !isLoading &&  params.id !== appealId && accessToken) {
    props.load(params.id);
  }

  const [usernameVisible, setUsernameVisible] = useState(false);

  return (
    <div className="Appeal">
      <PulseLoader loading={!!isLoading} color='#ffff00' cssOverride={loaderOverride} size={20}/>
      {appealId && !isLoading && <Form className="view-form">
        <Form.Field>
          <label>Twitch Username</label>
          <Input className="name-view" icon={
            <Button className="unhide-button" onClick={() => setUsernameVisible(!usernameVisible)}>
              <Icon className="unhide-icon" name={usernameVisible ? "eye": "eye slash"} /></Button>
            } 
            onClick={() => setUsernameVisible(!usernameVisible)}
            value={twitchUsername} disabled type={usernameVisible ? "text" : "password"}
          />
        </Form.Field>
        {banType && <Form.Field>
          <label>Where were you banned?</label>
            <Button className="ban-type view">
              {banType.substring(0,1)}{banType.substring(1,).toLowerCase()}
            </Button>
        </Form.Field>}
        {banType !== BanType.TWITCH.toString() && <Form.Field>
          <label>Discord Username</label>
          <Label className='view'>{discordUsername}</Label>
        </Form.Field>}
        <Form.Field>
          <label>Why were you banned?</label>
          <Label className='view'>{banReason}</Label>
        </Form.Field>
        <Form.Field>
          <label>Do you think Your ban was justified?</label>
          <Button className="ban-just view">
            {banJustified ? "Yes" : "No"}
          </Button>
        </Form.Field>
        <Form.Field>
          <label>Why do you think you should be unbanned?</label>
          <Label className='view'>{appealReason}</Label>
        </Form.Field>
        {!!additionalNotes && <Form.Field>
          <label>Anything else you'd like to add?</label>
          <Label className='view'>{additionalNotes}</Label>
        </Form.Field>}
        {judgement && <Form.Field>
          <label>Status</label>
          <Button className="ban-just view">
            {judgement.status}
          </Button>
        </Form.Field>}
        <hr />
        <ButtonGroup>
          <Button 
            type='submit' 
            className="bottom-bar"
            disabled={props.isLoading} 
            onClick={() => setUsernameVisible(!usernameVisible)}
            >
              Edit
          </Button>
          {judgement && <Button>Status: {judgement.status}
            </Button>}
        </ButtonGroup>
      </Form>}
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    accessToken: state.auth.accessToken,
    appealId: state.appeal.appealId,
    twitchUsername: state.appeal.twitchUsername,
    discordUsername: state.appeal.discordUsername,
    banType: state.appeal.banType,
    banReason: state.appeal.banReason,
    banJustified: state.appeal.banJustified,
    appealReason: state.appeal.appealReason,
    additionalNotes: state.appeal.additionalNotes,
    previousAppealId: state.appeal.previousAppealId,
    additionalData: state.appeal.additionalData,
    judgement: state.appeal.judgement,
    isLoading: state.appeal.isLoading,
    roles: state.auth.roles,
    error: state.alert.error
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    load: (appealId: string) => load(appealId)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Appeal);
