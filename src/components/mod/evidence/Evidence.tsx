import './mod.css'
import React from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../../redux/state';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { deleteApp } from '../../appeal/reducer';
import { Link } from 'react-router-dom';

interface IProps {
  deleteAppeal: (appealId: string) => void;
  setOpen: (open: boolean) => void;
  appealId: string;
  disabled: boolean;
  open: boolean
}

function EvidenceModal(props: IProps) {

  const { setOpen, open, disabled, appealId, deleteAppeal } = props;

  return (
    <div className="DeleteModal">
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

export default connect(mapStateToProps, mapDispatchToProps)(EvidenceModal);
