import './mod.css'
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Button, ButtonGroup, Header, Icon, Modal } from 'semantic-ui-react';
import BannedBy from './bannedBy/BannedBy';
import { BannedByObject } from './bannedBy/api';

interface IProps {
  setOpen: (open: boolean) => void;
  appealId: string;
  bannedBy?: BannedByObject[];
  open: boolean;
}

function ModModal(props: IProps) {

  const { setOpen, open, appealId, bannedBy } = props;
  const [selectedView, setSelectedView] = useState("None");

  useEffect(() => {
    return () => setSelectedView("None");
  }, [open])

  const addOrEditBanned = (bannedBy && bannedBy.length > 0) ? "Edit" : "Add";

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
            <Button.Content className="hidden-text" hidden>Add{<br />}Mod Data</Button.Content>
            <Button.Content visible>
              <Icon size="large" name="upload" className="bottom-icons" />
            </Button.Content>
          </Button>
        }
      >
        <Header icon>
          {selectedView === "None" ? `What Would you Like to Do?` : (selectedView === "BannedBy" ? `Add 'Banned By'` : `Add Evidence`)}
        </Header>
        <Modal.Content>
            {selectedView === "None" && <ButtonGroup className="mod-buttons">
              <Button className="mod-button" onClick={() => setSelectedView("BannedBy")}>{addOrEditBanned} Banned By</Button>
              <Button className="mod-button" onClick={() => setSelectedView("AddEvidence")}>Add Evidence</Button>
            </ButtonGroup>}
            {selectedView === "BannedBy" && <BannedBy appealId={appealId} setOpen={setOpen}/>}
            {selectedView === "AddEvidence" && <p></p>}
        </Modal.Content>
        {selectedView === "BannedBy" && <Modal.Actions>
          <Button onClick={() => setSelectedView("None")}>
            Go back
          </Button>
        </Modal.Actions>}
        {selectedView === "AddEvidence" && <Modal.Actions>
          <Button onClick={() => setSelectedView("None")}>
            Go back
          </Button>
        </Modal.Actions>}
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    bannedBy: state.appeal.bannedBy,
    roles: state.auth.roles,
    error: state.alert.error
  }
}

export default connect(mapStateToProps, null)(ModModal);
