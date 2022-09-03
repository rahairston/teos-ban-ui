import './judgement.css'
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../../redux/state';
import { Button, Form, Icon, Input } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import * as _ from 'lodash';
import { JudgementStatus, JudgementObject } from './api';
import { submit } from './reducer';

interface IProps {
  submit: (appealId: string, request: JudgementObject) => void;
  appealId: string;
  isSubmitting: boolean;
  roles?: string[];
  judgement?: JudgementObject;
  setOpen: (open: boolean) => void;
}

const validateSubmit = (request: JudgementObject|undefined, 
  appealId: string, 
  submit: (appealId: string, request: JudgementObject) => void,
  setOpen: (open: boolean) => void) => {
  if (!!request) {
    submit(appealId, request);
    setOpen(false);
  }
}

function Judgement(props: IProps) {

  const { appealId, isSubmitting, judgement, submit, setOpen } = props;

  return (
    <div className="BannedBy">
      <Form>
        <hr />
        <Button 
          type='submit' 
          disabled={isSubmitting} 
          onClick={() => validateSubmit(judgement, appealId, submit, setOpen)}
          >
            Submit
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    bannedBy: state.appeal.bannedBy,
    isSubmitting: state.bannedBy.isSubmitting
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    submit: (appealId: string, request: JudgementObject) => submit(appealId, request)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Judgement);
