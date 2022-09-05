import './judgement.css'
import React from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../../redux/state';
import { Button, Form, Header, Label, Modal, SemanticCOLORS } from 'semantic-ui-react';
import { JudgementStatus, JudgementObject } from './api';
import ReactMarkdown from 'react-markdown';

interface IProps {
  judgement?: JudgementObject;
  setOpen: (open: boolean) => void;
  open: boolean;
}

const renderDate = (date: Date): string => {
  return `Can Resubmit After: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const renderHeader = (status: JudgementStatus): string => {
  switch (status) {
    case JudgementStatus.PENDING:
      return `Waiting for Evidence`;
    case JudgementStatus.REVIEWING:
      return `Reviewing Submitted Evidence`
    case JudgementStatus.BAN_UPHELD:
    case JudgementStatus.UNBANNED:
      return status.toString()
  }
}

const renderContent = (status: JudgementStatus, resubmitAfterDate: number|undefined, notes: string|undefined) => {
  
  return (
    <Form className="judgement-view">
      {status === JudgementStatus.BAN_UPHELD && <Form.Field>
        <label>{`Resubmittable: ${!!resubmitAfterDate ? 'Yes' : 'No'}`}</label>
      </Form.Field>}
      {status === JudgementStatus.BAN_UPHELD && !!resubmitAfterDate && <Form.Field>
        <label>{renderDate(new Date(resubmitAfterDate))}</label>
      </Form.Field>}
      <Form.Field>
        <label>Judgement Notes: </label>
        <ReactMarkdown className="notes-view">{!!notes ? notes : "None"}</ReactMarkdown>
      </Form.Field>
    </Form>
  );
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

function JudgementView(props: IProps) {

  const { judgement = { status: JudgementStatus.PENDING }, setOpen, open } = props;

  const { status, resubmitAfterDate, notes } = judgement;

  return (
    <div className="JudgementView">
      <Modal
        className="JudgementView"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size={'large'}
        trigger={
          <Label color={getColorByStatus(judgement.status)} size="big" className="status-label">{judgement.status}</Label>
        }
      >
        <Header icon>
          Status: {renderHeader(status)}
        </Header>
        <Modal.Content>
            {renderContent(status, resubmitAfterDate, notes)}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>
            Exit
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    judgement: state.appeal.judgement
  }
}

export default connect(mapStateToProps, null)(JudgementView);
