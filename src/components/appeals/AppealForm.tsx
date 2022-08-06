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

enum BanType {
  TWITCH,
  DISCORD,
  BOTH
}

function AppealForm(props: IProps) {

  const [banType, setBanType] = useState(BanType.TWITCH)
  const [banJustified, setBanJustified] = useState(true);
  const { twitchUsername, roles } = props;

  return (
    <div className="AppealForm">
      <Form>
        <Form.Field>
          <label>Twitch Username</label>
          <input placeholder={twitchUsername} disabled={!isUserAdmin(roles)} />
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
          <label>Discord Username</label>
          <input placeholder={twitchUsername} />
        </Form.Field>}
        <Form.Field>
          <label>Why were you banned?</label>
          <textarea placeholder="Enter the reason you were banned here" />
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
          <label>Why do you think you should be unbanned?</label>
          <textarea placeholder="Enter the reason you want to be unbanned" />
        </Form.Field>
        <Form.Field>
          <label>Anything else you'd like to add?</label>
          <textarea placeholder="Enter additional notes here (optional)" />
        </Form.Field>
        <hr />
        <Button type='submit' disabled={props.isSubmitting}>Submit</Button>
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
