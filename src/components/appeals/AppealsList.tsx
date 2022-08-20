import './appealslist.css'
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Card, Dropdown, Grid, Icon, Menu, SemanticWIDTHS } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { getWindowDimensions, isUserAdmin } from '../../util/common';
import { clearAppeals, load } from './reducer';
import { AppealResponse } from '../appeal/api';
import { AppealFilters } from './api';
import { Link } from 'react-router-dom';

interface IProps {
  appeals: AppealResponse[];
  totalPages: number;
  totalSize: number;
  isLoading: boolean;
  load: (filters: AppealFilters) => void;
  clear: () => void;
}

const getColumnCount = (innerWidth: number): SemanticWIDTHS => {
  if (innerWidth > 1680)
    return 5;
  else if (innerWidth > 1346) {
    return 4;
  } else {
    return 3;
  }
}

const renderBottomNav = (currentPage: number, totalPages: number, setPageCount: (pageNum: number) => void) => {
  const startingNum = currentPage === 1 ? currentPage : (currentPage === totalPages ? currentPage - 2 :
    currentPage - 1);
  return (
    <Menu floated='right' pagination>
      <Menu.Item as='a' icon>
        <Icon name='chevron left' />
      </Menu.Item>
      <Menu.Item as='a' active={currentPage===startingNum} onClick={() => setPageCount(startingNum)}>
        {startingNum}
      </Menu.Item>
      {totalPages >= 2 && <Menu.Item as='a' active={currentPage===startingNum + 1} onClick={() => setPageCount(startingNum + 1)}>
        {startingNum + 1}
      </Menu.Item>}
      {totalPages >= 3 && <Menu.Item as='a' active={currentPage===startingNum + 2} onClick={() => setPageCount(startingNum + 2)}>
        {startingNum + 2}
      </Menu.Item>}
      <Menu.Item as='a' icon>
        <Icon name='chevron right' />
      </Menu.Item>
    </Menu>
  );
}

function AppealsList(props: IProps) {

  const { appeals, totalSize, totalPages, load, clear } = props;
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const filters: AppealFilters = {
      pageCount,
      pageSize
    };
    load(filters);

    // return () => clear();
  }, [pageCount, pageSize, load, clear]);

  const gridWidth = getColumnCount(windowDimensions.width);

  return (
    <div className="AppealsList">
      <Grid doubling>
        <Grid.Row columns={3}>
          <Grid.Column className="grid-header">
              Ban Appeals
          </Grid.Column>
          <Grid.Column>
            
          </Grid.Column>
          <Grid.Column>
            <Dropdown text={`${pageSize}`} className="display-count">
              <Dropdown.Menu>
                <Dropdown.Item className="display-item" text="10" onClick={() => setPageSize(10)}/>
                <Dropdown.Item className="display-item" text="25" onClick={() => setPageSize(25)}/>
                <Dropdown.Item className="display-item" text="50" onClick={() => setPageSize(50)}/>
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={gridWidth} stretched>
          {appeals.map((appeal: AppealResponse, index: number) => {
            return (
              <Grid.Column className="appeal-column" key={appeal.appealId}>
                <Link 
                  className="grid-item" 
                  key={appeal.appealId} 
                  to={`/appeals/${appeal.appealId}`}
                  state={{index: index}}
                >
                  <Card className="grid-item" key={appeal.appealId}>
                    <Card.Content>
                      Appeal {(pageCount - 1) + index + 1}
                      <Card.Meta>
                        {appeal.judgement && <span>{appeal.judgement.status}</span>}
                      </Card.Meta>
                    </Card.Content>
                  </Card>
                </Link>
              </Grid.Column>
            );
          })}
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Column className="grid-footer">
            Total Count: {totalSize}
          </Grid.Column>
          <Grid.Column />
          <Grid.Column>
            {renderBottomNav(pageCount, totalPages, setPageCount)}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    appeals: state.appeals.appeals,
    isLoading: state.appeals.isLoading,
    totalPages: state.appeals.totalPages,
    totalSize: state.appeals.totalSize,
    roles: state.auth.roles,
    error: state.alert.error
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    load: (filters: AppealFilters) => load(filters)(dispatch),
    clear: () => dispatch(clearAppeals())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppealsList);
