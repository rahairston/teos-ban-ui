import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Dropdown, Image, Menu } from 'semantic-ui-react';
import { authReducer } from '../auth/reducer';
import { Dispatch } from 'redux';
import { isUserAdmin } from '../../util/common';

interface IProps {
}

function AppealsList(props: IProps) {

  const [activeItem, setActiveItem] = useState()
  
  return (
    <div className="AppealsList">
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return { 
    displayName: state.auth.displayName,
    profilePicture: state.auth.profilePicture,
    roles: state.auth.roles
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    logout: () => dispatch({ type: authReducer.actions.logout.type })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppealsList);
