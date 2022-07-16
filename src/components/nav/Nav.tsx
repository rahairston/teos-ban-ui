import './Nav.css';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Menu } from 'semantic-ui-react';

interface IProps {
  displayName?: string;
  profilePicture?: string;
  accessToken?: string;
}


function Nav(props: IProps) {

  const {displayName, accessToken} = props;

  const [activeItem, setActiveItem] = useState()
  
  return (
    <div className="Nav">
        <Menu>
            <Menu.Item
                name='editorials'
                active={activeItem === 'editorials'}
                onClick={() => setActiveItem}
                >
                Editorials
            </Menu.Item>

            <Menu.Item
                name='reviews'
                active={activeItem === 'reviews'}
                onClick={() => setActiveItem}
                >
                Reviews
            </Menu.Item>

            <Menu.Item
                name='upcomingEvents'
                active={activeItem === 'upcomingEvents'}
                onClick={() => setActiveItem}
                >
                Upcoming Events
            </Menu.Item>
        </Menu>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return { 
    displayName: state.auth.displayName,
    profilePicture: state.auth.profilePicture,
    accessToken: state.auth.accessToken
  }
}

export default connect(mapStateToProps, null)(Nav);
