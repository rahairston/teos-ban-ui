import './mod.css'
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { load } from '../appeal/reducer';
import Judgement from './judgement/Judgement';
interface IProps {
  appealId: string;
  setOpen: (open: boolean) => void;
  load: (appealId: string) => void;
  open: boolean;
}

function JudgementModal(props: IProps) {

  const { setOpen, open, appealId, load } = props;

  useEffect(() => {
    return () => {
      if (open) {
        load(appealId);
      }
    }
  }, [open, load, appealId])

  return (
    <div className="JudgementModal">
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
            <Button.Content className="hidden-text" hidden>Submit{<br />}Judgement</Button.Content>
            <Button.Content visible>
              <Icon size="large" name="legal" className="bottom-icons" />
            </Button.Content>
          </Button>
        }
      >
        <Header icon>
          Submit Judgement
        </Header>
        <Modal.Content>
            <Judgement appealId={appealId} setOpen={setOpen}/>
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
    error: state.alert.error
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    load: (appealId: string) => load(appealId)(dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(JudgementModal);
