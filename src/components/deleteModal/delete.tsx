import './delete.css'
import React from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { deleteApp } from '../appeal/reducer';
import { Link } from 'react-router-dom';

interface IProps {
  deleteAppeal: (appealId: string) => void;
  setOpen: (open: boolean) => void;
  appealId: string;
  disabled: boolean;
  open: boolean
}

function DeleteModal(props: IProps) {

  const { setOpen, open, disabled, appealId, deleteAppeal } = props;

  return (
    <div className="DeleteModal">
      <Modal
        className="DeleteModal"
        basic
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size='mini'
        trigger={
          <Button 
            type='submit' 
            className="bottom-bar-button"
            disabled={disabled}  
          >

            <Icon size="large" name="trash" className="bottom-icons" />
          </Button>
        }
      >
        <Header icon>
          DELETE APPEAL
        </Header>
        <Modal.Content className="are-you-sure">
            Are you sure you want to delete this appeal?
        </Modal.Content>
        <Modal.Actions>
          <Button basic inverted onClick={() => setOpen(false)}>
            <Icon name='remove' /> No
          </Button>
          <Link to="/">
            <Button color='red' inverted onClick={() => {
                setOpen(false);
                deleteAppeal(appealId);
              }
            }>
              <Icon name='checkmark' /> Yes
            </Button>
          </Link>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    roles: state.auth.roles,
    error: state.alert.error
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    deleteAppeal: (appealId: string) => deleteApp(appealId)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModal);
