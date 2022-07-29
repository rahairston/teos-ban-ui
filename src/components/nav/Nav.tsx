import './Nav.css';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Dropdown, Image, Menu } from 'semantic-ui-react';
import { authReducer } from '../auth/reducer';
import { Dispatch } from 'redux';
import { isUserAdmin } from '../../util/common';

interface IProps {
  displayName?: string;
  logout: () => void;
  profilePicture?: string;
  roles?: string[];
}

function renderWelcome() {
  return (
    <Menu.Item className='nav-item'>
      Teos Ban Appeals
    </Menu.Item>
  );
}

function renderSubmit() {
  return (
    <Menu.Item
        className='nav-item'
        name='submitAppeal'
        // onClick={() => }
        >
        Submit Appeal
    </Menu.Item>
  );
}

function renderView() {
  return (
    <Menu.Item
        className='nav-item'
        name='viewAppeals'
        // onClick={() => setActiveItem}
        >
        View Appeals
    </Menu.Item>
  );
}

function renderRightButton(props: IProps) {
  const {displayName, profilePicture, logout} = props;
  return (
    <Menu.Menu position='right'>
      <Menu.Item className='user-section'>
        <Image src={profilePicture} avatar className='profile-picture'/>
        <Dropdown className='nav-item' text={displayName}>
          <Dropdown.Menu>
            <Dropdown.Item text='Logout' onClick={() => logout()}/>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
    </Menu.Menu>
  );
}

function Nav(props: IProps) {

  const {displayName, roles} = props;

  const [activeItem, setActiveItem] = useState()
  
  return (
    <div className="Nav">
        {!displayName && <Menu>{renderWelcome()}</Menu>}
        {displayName && !isUserAdmin(roles) && <div>
          <Menu>
            {renderSubmit()}
            {renderView()}
            {renderRightButton(props)}
          </Menu>
          </div>}
          {displayName && isUserAdmin(roles) && <div>
          <Menu>
            {renderSubmit()}
            {renderView()}

            <Menu.Item
                className='nav-item'
                name='submitEvidence'
                onClick={() => setActiveItem}
                >
                Submit Evidence
            </Menu.Item>

            <Menu.Item
                className='nav-item'
                name='submitJudgement'
                active={activeItem === 'reviews'}
                onClick={() => setActiveItem}
                >
                Submit Judgement
            </Menu.Item>

            {renderRightButton(props)}
          </Menu>
          </div>}
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

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
