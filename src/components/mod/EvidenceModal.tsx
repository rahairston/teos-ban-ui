import './mod.css'
import React from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { EvidenceResponse } from './evidence/api';
import EvidenceView from './evidence/EvidenceView';
interface IProps {
  setOpen: (open: boolean) => void;
  evidence?: EvidenceResponse[];
  open: boolean;
}

function EvidenceModal(props: IProps) {

  const { setOpen, open, evidence } = props;

  return (
    <div className="EvidenceModal">
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size={'large'}
        trigger={
          <Button 
            type='submit'
            animated='fade'
            className="bottom-bar-button"
          >
            <Button.Content className="hidden-text" hidden>Review{<br />}Evidence</Button.Content>
            <Button.Content visible>
              <Icon size="large" name="law" className="bottom-icons" />
            </Button.Content>
          </Button>
        }
      >
        <Header icon>
          Review Evidence
        </Header>
        <Modal.Content scrolling>
            {!!evidence && evidence.length > 0 && <EvidenceView />}
            {(!evidence || evidence.length === 0) && <div>No Evidence Submitted</div>}
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
    evidence: state.appeal.evidence
  }
}

export default connect(mapStateToProps, null)(EvidenceModal);
