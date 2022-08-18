import './appealslist.css'
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Dropdown, Icon, Label, Menu, Table } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { isUserAdmin } from '../../util/common';
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
  

  useEffect(() => {
    const filters: AppealFilters = {
      pageCount,
      pageSize
    };
    load(filters);
  }, [pageCount, pageSize, load, clear]);

  return (
    <div className="AppealsList">
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="table-header">Appeal Number</Table.HeaderCell>
            <Table.HeaderCell className="table-header">Status
              <Dropdown text={`${pageSize}`} className="display-count">
                <Dropdown.Menu>
                  <Dropdown.Item className="display-item" text="10" onClick={() => setPageSize(10)}/>
                  <Dropdown.Item className="display-item" text="25" onClick={() => setPageSize(25)}/>
                  <Dropdown.Item className="display-item" text="50" onClick={() => setPageSize(50)}/>
                </Dropdown.Menu>
              </Dropdown>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {appeals.map((appeal: AppealResponse, index: number) => {
             return (<Table.Row className="table-row">
              <Table.Cell>
                <Link to={`/appeals/${appeal.appealId}`}>
                  Appeal {(pageCount - 1) + index + 1}
                </Link>
              </Table.Cell>
              {appeal.judgement && <Table.Cell>{appeal.judgement.status}</Table.Cell>}
            </Table.Row>);
          })}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='3'>
              {renderBottomNav(pageCount, totalPages, setPageCount)}
              <Label>Total Count: {totalSize}</Label>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
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
