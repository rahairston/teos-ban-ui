import './mod.css'
import React from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { load } from '../appeal/reducer';
import EvidenceView from './evidence/EvidenceView';
interface IProps {
  setOpen: (open: boolean) => void;
  open: boolean;
}

function EvidenceModal(props: IProps) {

  const { setOpen, open } = props;

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
        <Modal.Content>
            <EvidenceView />
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
    bannedBy: state.appeal.bannedBy,
    evidence: state.appeal.evidence,
    roles: state.auth.roles,
    error: state.alert.error
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    load: (appealId: string) => load(appealId)(dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EvidenceModal);
