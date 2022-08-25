import './Nav.css';
import { useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Dropdown, Image, Menu } from 'semantic-ui-react';
import { LogoutAction } from '../auth/reducer';
import { Dispatch } from 'redux';
import { isUserAdmin } from '../../util/common';
import { Link } from 'react-router-dom';

interface IProps {
  displayName?: string;
  logout: () => void;
  profilePicture?: string;
  roles?: string[];
}

function renderWelcome() {
  return (
    <Menu.Item className='nav-item' onClick={() => {}}>
      <Link className="nav-link" to="/">
        Teos Ban Appeals
      </Link>
    </Menu.Item>
  );
}

function renderSubmit() {
  return (
    <Menu.Item
      className='nav-item'
      name='submitAppeal'
    >
      <Link className="nav-link" to="/submitAppeal">
        Submit Appeal
      </Link>
    </Menu.Item>
  );
}

function renderView() {
  return (
    <Menu.Item
      className='nav-item'
      name='viewAppeals'
    >
      <Link className="nav-link" to='/appeals?type=All&status=All'>
        View Appeals
      </Link>
    </Menu.Item>
  );
}

function renderRightButton(props: IProps) {
  const { displayName, profilePicture, logout } = props;
  return (
    <Menu.Menu position='right'>
      <Menu.Item className='user-section'>
        <Image src={profilePicture} avatar className='profile-picture' />
        <Dropdown className='nav-item' text={displayName}>
          <Dropdown.Menu>
            <Link className="nav-link" to="/">
              <Dropdown.Item onClick={() => logout()}>
                Logout
              </Dropdown.Item>
            </Link>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
    </Menu.Menu>
  );
}

function Nav(props: IProps) {

  const { displayName, roles } = props;

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
          >
            <Link className="nav-link" to='/appeals?type=All&status=Pending'>
              Submit Evidence
            </Link>
          </Menu.Item>

          <Menu.Item
            className='nav-item'
            name='submitJudgement'
          >
            <Link className="nav-link" to='/appeals?type=All&status=Reviewing'>
              Submit Judgement
            </Link>
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
    logout: () => LogoutAction(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
