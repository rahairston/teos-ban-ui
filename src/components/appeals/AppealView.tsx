import './form.css';
import './view.css';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Button, Form, Input, Label } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { isUserAdmin } from '../../util/common';
import { load } from './reducer';
import { useParams } from 'react-router-dom';
import { BanType } from './api';

interface IProps {
  load: (appealId: string) => void;
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
  isLoading: boolean;
}

function Appeal(props: IProps) {

  const params = useParams();

  const {appealId, twitchUsername, discordUsername, banType, 
      banReason, banJustified, appealReason, additionalNotes, 
      previousAppealId, additionalData, isLoading} = props;

  if (params.id && !isLoading &&  params.id !== appealId) {
    props.load(params.id);
  }

  const [passwordShown, setPasswordShown] = useState(false);

  return (
    <div className="AppealForm">
      <Form>
        <Form.Field>
          <label>Twitch Username</label>
          <Input className="name-view" icon='eye' value={twitchUsername} disabled type="password"/>
        </Form.Field>
        <Form.Field>
          <label>Ban Type</label>
            <Button className="ban-type view" disabled>
              {banType}
            </Button>
        </Form.Field>
        {banType !== BanType.TWITCH.toString() && <Form.Field>
          <label>Discord Username</label>
          <label>{discordUsername}</label>
        </Form.Field>}
        <Form.Field>
          <label>Why were you banned?</label>
          <Label className='view'>{banReason}</Label>
        </Form.Field>
        <Form.Field>
          <label>Do you think Your ban was justified?</label>
          <Button.Group>
            <Button className="ban-type" active={banJustified}>
              Yes
            </Button>
            <Button.Or />
            <Button className="ban-type" active={!banJustified}>
              No
            </Button>
          </Button.Group>
        </Form.Field>
        <Form.Field>
          <label>Why do you think you should be unbanned?</label>
          <label>{appealReason}</label>
        </Form.Field>
        <Form.Field>
          <label>Anything else you'd like to add?</label>
          <label>{additionalNotes}</label>
        </Form.Field>
        <hr />
        <Button 
          type='submit' 
          disabled={props.isLoading} 
          // onClick={() =>validateSubmit(data, twitchUsername, roles, setErrors, submit)}
          >
            Edit
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
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
    isLoading: false,
    roles: state.auth.roles
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    load: (appealId: string) => load(appealId)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Appeal);
