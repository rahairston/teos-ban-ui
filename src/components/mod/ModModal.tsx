import './mod.css'
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Button, ButtonGroup, Header, Icon, Modal } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { deleteApp } from '../appeal/reducer';
import { Link } from 'react-router-dom';

interface IProps {
  setOpen: (open: boolean) => void;
  appealId: string;
  open: boolean
}

function ModModal(props: IProps) {

  const { setOpen, open, appealId } = props;
  const [selectedView, setSelectedView] = useState("None");

  useEffect(() => {
    return () => setSelectedView("None");
  }, [open])

  return (
    <div className="ModModal">
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size={selectedView === "None" ? 'tiny' : 'large'}
        trigger={
          <Button 
            type='submit'
            animated='fade'
            className="bottom-bar-button"
          >
            <Button.Content className="hidden-text" hidden>Upload{<br />}Evidence</Button.Content>
            <Button.Content visible>
              <Icon size="large" name="upload" className="bottom-icons" />
            </Button.Content>
          </Button>
        }
      >
        <Header icon>
          {selectedView === "None" ? `What Would you Like to Do?` : (selectedView === "BannedBy" ? `Add 'Banned By'` : `Add Evidence`)}
        </Header>
        <Modal.Content className="mod-actions">
            {selectedView === "None" && <ButtonGroup>
              <Button className="mod-button" onClick={() => setSelectedView("BannedBy")}>Add Banned By</Button>
              <Button className="mod-button" onClick={() => setSelectedView("AddEvidence")}>Add Evidence</Button>
            </ButtonGroup>}
            {selectedView === "BannedBy" && <p></p>}
            {selectedView === "AddEvidence" && <p></p>}
        </Modal.Content>
        {selectedView === "BannedBy" && <Modal.Actions>
          <Button basic inverted onClick={() => setOpen(false)}>
            <Icon name='remove' /> No
          </Button>
          <Link to="/">
            <Button color='red' inverted onClick={() => {
                setOpen(false);
              }
            }>
              <Icon name='checkmark' /> Yes
            </Button>
          </Link>
        </Modal.Actions>}
        {selectedView === "AddEvidence" && <Modal.Actions>
          <Button basic inverted onClick={() => setOpen(false)}>
            <Icon name='remove' /> No
          </Button>
          <Link to="/">
            <Button color='red' inverted onClick={() => {
                setOpen(false);
              }
            }>
              <Icon name='checkmark' /> Yes
            </Button>
          </Link>
        </Modal.Actions>}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModModal);
