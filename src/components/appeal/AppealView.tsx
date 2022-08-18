import './form.css';
import './view.css';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Button, ButtonGroup, Form, Icon, Input, Label, SemanticCOLORS } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { isUserAdmin, loaderOverride } from '../../util/common';
import { clearAppeal, load } from './reducer';
import { useParams } from 'react-router-dom';
import { BanType, JudgementResponse } from './api';
import { PulseLoader } from 'react-spinners';
interface IProps {
  load: (appealId: string) => void;
  clear: () => void;
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
  roles?: string[];
}

const getColorByStatus = (judgementStatus: string | undefined): SemanticCOLORS => {
  const status = judgementStatus ? judgementStatus.toUpperCase() : "";
  switch (status) {
    case "PENDING":
    case "REVIEWING":
      return "yellow";
    case "UNBANNED":
      return "green";
    case "BAN UPHELD":
      return "red";
    default:
      return "purple";
  }
}

const isEditable = (judgementStatus: string | undefined): boolean => {
  return !!judgementStatus && judgementStatus === "PENDING";
}

function Appeal(props: IProps) {

  const params = useParams();

  const {appealId, twitchUsername, discordUsername, banType, 
      banReason, banJustified, appealReason, additionalNotes, judgement,
      previousAppealId, additionalData, isLoading, load, clear, roles} = props;
  
  useEffect(() => {    
    if (params.id) {
      load(params.id);
    }    
    // Specify how to clean up after this effect:    
    return function cleanup() {
      clear();    
    };  
  }, [params.id, load, clear]);

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
        <hr />
        <div>
          <div className="bottom-bar">
            <Button 
              type='submit' 
              className="bottom-bar-button"
              disabled={!isUserAdmin(roles) && !isEditable(judgement?.status)} 
              onClick={() => setUsernameVisible(!usernameVisible)}
              >
                <Icon size="large" name="edit" className="bottom-icons" />
            </Button>
            <Button 
              type='submit' 
              className="bottom-bar-button"
              disabled={!isUserAdmin(roles) && !isEditable(judgement?.status)}  
              onClick={() => setUsernameVisible(!usernameVisible)}
              >
                <Icon size="large" name="trash" className="bottom-icons" />
            </Button>
          </div>
          <div className="bottom-bar">
          {isUserAdmin(roles) && <ButtonGroup className="admin-buttons">
            <Button 
              type='submit'
              animated='fade'
              className="bottom-bar-button"
              onClick={() => setUsernameVisible(!usernameVisible)}
            >
              <Button.Content className="hidden-text" hidden>Upload{<br />}Evidence</Button.Content>
              <Button.Content visible>
                <Icon size="large" name="upload" className="bottom-icons" />
              </Button.Content>
            </Button>
            <Button.Or className="admin-or" />
            <Button 
              type='submit'
              animated='fade'
              className="bottom-bar-button"
              onClick={() => setUsernameVisible(!usernameVisible)}
            >
              <Button.Content className="hidden-text" hidden>Review{<br />}Evidence</Button.Content>
              <Button.Content visible>
                <Icon size="large" name="law" className="bottom-icons" />
              </Button.Content>
            </Button>
            <Button.Or className="admin-or" />
            <Button 
              type='submit' 
              animated='fade'
              className="bottom-bar-button"
              onClick={() => setUsernameVisible(!usernameVisible)}
            >
              <Button.Content className="hidden-text" hidden>Submit{<br />}Judgement</Button.Content>
              <Button.Content visible>
                <Icon size="large" name="legal" className="bottom-icons" />
              </Button.Content>
            </Button>
          </ButtonGroup>}
          </div>
          <div className="bottom-bar">
            {judgement && <Label color={getColorByStatus(judgement.status)} size="big" className="status-label">{judgement.status}
              </Label>}
          </div>
        </div>
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
    load: (appealId: string) => load(appealId)(dispatch),
    clear: () => dispatch(clearAppeal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Appeal);