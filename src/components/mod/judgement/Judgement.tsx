import './judgement.css'
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../../redux/state';
import { Button, Form, TextArea } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { JudgementStatus, JudgementObject } from './api';
import { submit } from './reducer';
import DatePicker from 'react-date-picker';

interface IProps {
  submit: (appealId: string, request: JudgementObject) => void;
  appealId: string;
  isSubmitting: boolean;
  judgement?: JudgementObject;
  setOpen: (open: boolean) => void;
}

const validateSubmit = (status: JudgementStatus, 
  resubmit: boolean, resubmitDate: Date, notes: string|undefined, appealId: string,
  submit: (appealId: string, request: JudgementObject) => void, setOpen: (open: boolean) => void) => {
    const request = {
      status,
      resubmitAfterDate: resubmit ? resubmitDate : undefined,
      notes
    } as JudgementObject;
    submit(appealId, request);
    setTimeout(() => { //it refreshes too fast lol
      setOpen(false);
    }, 100);
    
}

const changesExist = (status: JudgementStatus, resubmit: boolean,
    resubmitDate: Date, notes: string|undefined, judgement: JudgementObject): boolean => {
  return (status !== judgement.status ||
    (resubmit && !!judgement.resubmitAfterDate &&  resubmitDate.getTime() !== judgement.resubmitAfterDate) ||
    (!resubmit && !!judgement.resubmitAfterDate && status !== judgement.status) || // case: initially had resubmit but we are removing it
    notes !== judgement.notes);
}

function Judgement(props: IProps) {

  const { appealId, isSubmitting, judgement = { status: JudgementStatus.PENDING }, submit, setOpen } = props;

  const [status, setStatus] = useState(judgement.status);
  const [resubmit, setResubmit] = useState(!!judgement.resubmitAfterDate && judgement.status === JudgementStatus.BAN_UPHELD);
  const [resubmitDate, setResubmitDate] = useState(!!judgement.resubmitAfterDate ? new Date(judgement.resubmitAfterDate) : new Date());
  const [notes, setNotes] = useState(judgement.notes);

  return (
    <div className="Judgement">
      <Form>
        <Form.Field>
          <label>Judgement*</label>
          <Button.Group>
            <Button className="judgement-type" active={status===JudgementStatus.PENDING} onClick={() => setStatus(JudgementStatus.PENDING)}>
              Pending
            </Button>
            <Button.Or />
            <Button className="judgement-type" active={status===JudgementStatus.REVIEWING} onClick={() => setStatus(JudgementStatus.REVIEWING)}>
              Reviewing
            </Button>
            <Button.Or />
            <Button className="judgement-type" active={status===JudgementStatus.BAN_UPHELD} onClick={() => setStatus(JudgementStatus.BAN_UPHELD)}>
              Uphold Ban
            </Button>
            <Button.Or />
            <Button className="judgement-type" active={status===JudgementStatus.UNBANNED} onClick={() => setStatus(JudgementStatus.UNBANNED)}>
              Unban
            </Button>
          </Button.Group>
        </Form.Field>
        {status === JudgementStatus.BAN_UPHELD && <Form.Field>
          <label>Can user resubmit?</label>
          <Button.Group>
            <Button className="judgement-type" active={resubmit} onClick={() => setResubmit(true)}>
              Yes
            </Button>
            <Button.Or />
            <Button className="judgement-type" active={!resubmit} onClick={() => setResubmit(false)}>
              No
            </Button>
          </Button.Group>
        </Form.Field>}
        {status === JudgementStatus.BAN_UPHELD && resubmit && <Form.Field>
          <label>Resubmit After: <small className="date-format">(dd-mm-yyyy)</small></label>
            <DatePicker format="dd/MM/y" minDate={new Date()} onChange={setResubmitDate} value={resubmitDate} />
        </Form.Field>}
        <Form.Field>
          <label>Notes: </label>
          <TextArea onChange={(e: any) => setNotes(e.target.value)} value={notes} placeholder='Add notes here...' />
        </Form.Field>
        <small className="required-text">* - required</small>
        <hr />
        <Button 
          type='submit' 
          disabled={isSubmitting || !changesExist(status, resubmit, resubmitDate, notes, judgement)} 
          onClick={() => validateSubmit(status, resubmit, resubmitDate, notes, appealId, submit, setOpen)}
          >
            Submit
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    judgement: state.appeal.judgement,
    isSubmitting: state.bannedBy.isSubmitting
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    submit: (appealId: string, request: JudgementObject) => submit(appealId, request)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Judgement);
