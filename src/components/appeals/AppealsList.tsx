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

interface IPageData {
  pageCount: number;
  pageSize: number;
}
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

const changePageSize = (newSize: number, setPageData: (obj: IPageData) => void, clear: () => void) => {
  const pageData = {
    pageSize: newSize,
    pageCount: 1
  }
  setPageData(pageData);
}

const renderBottomNav = (pageData: IPageData, totalPages: number, setPageData: (obj: IPageData) => void) => {
  const currentPage = pageData.pageCount;
  const startingNum = currentPage <= 1 ? 1 : ((currentPage === totalPages && totalPages !== 2) ? currentPage - 2 :
    currentPage - 1);
  
  return (
    <Menu floated='right' pagination>
      {totalPages !== 1 && currentPage !== 1 && <Menu.Item as='a' icon onClick={() => setPageData({
          pageCount: currentPage - 1,
          pageSize: pageData.pageSize
        })
      }>
        <Icon name='chevron left' />
      </Menu.Item>}
      <Menu.Item as='a' active={currentPage===startingNum} onClick={() => setPageData({
          pageCount: startingNum,
          pageSize: pageData.pageSize
        })
      }>
        {startingNum}
      </Menu.Item>
      {totalPages >= 2 && <Menu.Item as='a' active={currentPage===startingNum + 1} onClick={() => setPageData({
          pageCount: startingNum + 1,
          pageSize: pageData.pageSize
        })
      }>
        {startingNum + 1}
      </Menu.Item>}
      {totalPages >= 3 && <Menu.Item as='a' active={currentPage===startingNum + 2} onClick={() => setPageData({
          pageCount: startingNum + 2,
          pageSize: pageData.pageSize
        })
      }>
        {startingNum + 2}
      </Menu.Item>}
      {totalPages !== 1 && currentPage !== totalPages && <Menu.Item as='a' icon onClick={() => setPageData({
          pageCount: currentPage + 1,
          pageSize: pageData.pageSize
        })
      }>
        <Icon name='chevron right' />
      </Menu.Item>}
    </Menu>
  );
}

function AppealsList(props: IProps) {

  const { appeals, totalSize, totalPages, load, clear } = props;
  const [pageData, setPageData] = useState({pageCount: 1, pageSize: 10})
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
      pageCount: pageData.pageCount,
      pageSize: pageData.pageSize
    };
    load(filters);

    return () => clear();
  }, [pageData, load, clear]);

  const {pageCount, pageSize} = pageData;

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
              <Dropdown.Item className="display-item" text="1" onClick={() => changePageSize(1, setPageData, clear)}/>
                <Dropdown.Item className="display-item" text="10" onClick={() => changePageSize(10, setPageData, clear)}/>
                <Dropdown.Item className="display-item" text="25" onClick={() => changePageSize(25, setPageData, clear)}/>
                <Dropdown.Item className="display-item" text="50" onClick={() => changePageSize(50, setPageData, clear)}/>
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
            {renderBottomNav(pageData, totalPages, setPageData)}
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
