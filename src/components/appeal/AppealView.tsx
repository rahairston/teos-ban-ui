import './form.css';
import './view.css';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../redux/state';
import { Button, ButtonGroup, Form, Grid, Icon, Input, Label } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { isUserAdmin, loaderOverride } from '../../util/common';
import { clearAppeal, load } from './reducer';
import { Link, useParams } from 'react-router-dom';
import { BanType } from './api';
import { PulseLoader } from 'react-spinners';
import Delete from '../deleteModal/delete';
import ModModal from '../mod/ModModal';
import EvidenceModal from '../mod/EvidenceModal';
import { JudgementObject } from '../mod/judgement/api';
import JudgementModal from '../mod/JudgementModal';
import JudgementView from '../mod/judgement/JudgementView';
interface IProps {
  load: (appealId: string) => void;
  clear: () => void;
  appealId?: string;
  twitchUsername?: string;
  discordUsername?: string;
  banType?: string;
  banReason?: string;
  banJustified?: boolean;
  appealReason?: string;
  additionalNotes?: string;
  previousAppealId?: string;
  additionalData?: string;
  adminNotes?: string;
  judgement?: JudgementObject;
  prevPageId?: string;
  nextPageId?: string;
  isLoading: boolean;
  error?: boolean;
  roles?: string[];
}

const isEditable = (judgementStatus: any | undefined): boolean => {
  return !!judgementStatus && judgementStatus.status === "PENDING";
}

function Appeal(props: IProps) {

  const params = useParams();
  const [openDelete, setDeleteOpen] = useState(false);
  const [openMod, setModOpen] = useState(false);
  const [openEvidence, setEvidenceOpen] = useState(false);
  const [openJudgement, setJudgementOpen] = useState(false);
  const [userJudgementOpen, setUserJudgementOpen] = useState(false);

  const {appealId, twitchUsername, discordUsername, banType, 
      banReason, banJustified, appealReason, additionalNotes, adminNotes, judgement,
      previousAppealId, additionalData, prevPageId, nextPageId, isLoading, load, clear, roles} = props;
  
  useEffect(() => {    
    if (params.id) {
      load(params.id);
    }    
    // Specify how to clean up after this effect:    
    return function cleanup() {
      clear();    
    };  
  }, [params.id, load, clear]);

  const [usernameVisible, setUsernameVisible] = useState(false);

  return (
    <div className="Appeal">
      <PulseLoader loading={!!isLoading} color='#ffff00' cssOverride={loaderOverride} size={20}/>
      {appealId && !isLoading && 
      <Grid verticalAlign='middle' centered>
        <Grid.Column width={1} floated='left' textAlign='center'>
          {!!prevPageId && <Link 
            to={`/appeals/${prevPageId}`}
          >
            <Icon className="grid-form-arrow-right" size="huge" name="chevron left"/>
          </Link>}
        </Grid.Column>
        <Grid.Column className="form-column" width={14}>
          <Form className="view-form">
            <Form.Field>
              <label>Twitch Username</label>
              <Input className="name-view" icon={
                <Button className="unhide-button" onClick={() => setUsernameVisible(!usernameVisible)}>
                  <Icon className="unhide-icon" name={usernameVisible ? "eye": "eye slash"} /></Button>
                } 
                onClick={() => setUsernameVisible(!usernameVisible)}
                value={twitchUsername} disabled type={usernameVisible ? "text" : "password"}
              />
            </Form.Field>
            {!!previousAppealId && <Form.Field>
              <Link to={`/appeals/${previousAppealId}`}><Button color="red" inverted>Resubmitted</Button></Link>
            </Form.Field>}
            {!!previousAppealId && !!additionalData && <Form.Field>
              <label>Additional Resubmission Data</label>
              <Label className='view'>{additionalData}</Label>
            </Form.Field>}
            {banType && <Form.Field>
              <label>Where were you banned?</label>
                <Button className="ban-type view">
                  {banType.substring(0,1)}{banType.substring(1,).toLowerCase()}
                </Button>
            </Form.Field>}
            {banType !== BanType.TWITCH.toString() && <Form.Field>
              <label>Discord Username</label>
              <Label className='view'>{discordUsername}</Label>
            </Form.Field>}
            <Form.Field>
              <label>Why were you banned?</label>
              <Label className='view'>{banReason}</Label>
            </Form.Field>
            <Form.Field>
              <label>Do you think Your ban was justified?</label>
              <Button className="ban-just view">
                {banJustified ? "Yes" : "No"}
              </Button>
            </Form.Field>
            <Form.Field>
              <label>Why do you think you should be unbanned?</label>
              <Label className='view'>{appealReason}</Label>
            </Form.Field>
            {!!additionalNotes && <Form.Field>
              <label>Anything else you'd like to add?</label>
              <Label className='view'>{additionalNotes}</Label>
            </Form.Field>}
            {!!adminNotes && <Form.Field>
              <label>Admin Notes</label>
              <Label className='view'>{adminNotes}</Label>
            </Form.Field>}
            <hr />
            <div>
              <div className="bottom-bar">
                <Link 
                  to={`/appeals/${appealId}/edit`}
                  className={!isUserAdmin(roles) && !isEditable(judgement) ? "disabled-link" : ""}
                >
                  <Button 
                    type='submit' 
                    className="bottom-bar-button"
                    disabled={!isUserAdmin(roles) && !isEditable(judgement)} 
                  >
                    <Icon size="large" name="edit" className="bottom-icons" />
                  </Button>
                </Link>
                <Delete 
                  open={openDelete}
                  appealId={appealId}
                  setOpen={setDeleteOpen}
                  disabled={!isUserAdmin(roles) && !isEditable(judgement)}
                />
              </div>
              <div className="bottom-bar">
              {isUserAdmin(roles) && <ButtonGroup className="admin-buttons">
                <ModModal 
                  appealId={appealId}
                  open={openMod}
                  setOpen={setModOpen}
                />
                <Button.Or className="admin-or" />
                <EvidenceModal 
                  open={openEvidence}
                  setOpen={setEvidenceOpen}
                />
                <Button.Or className="admin-or" />
                <JudgementModal 
                  appealId={appealId}
                  open={openJudgement}
                  setOpen={setJudgementOpen}
                />
              </ButtonGroup>}
              </div>
              <div className="bottom-bar">
                {judgement && <JudgementView open={userJudgementOpen} setOpen={setUserJudgementOpen} />}
              </div>
            </div>
          </Form>
        </Grid.Column>
        <Grid.Column width={1} floated='right' textAlign='center'>
          {!!nextPageId && <Link 
            to={`/appeals/${nextPageId}`}
          >
            <Icon className="grid-form-arrow-right" size="huge" name="chevron right"/>
          </Link>}
        </Grid.Column>
      </Grid>
      }
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    appealId: state.appeal.appealId,
    twitchUsername: state.appeal.twitchUsername,
    discordUsername: state.appeal.discordUsername,
    banType: state.appeal.banType,
    banReason: state.appeal.banReason,
    banJustified: state.appeal.banJustified,
    appealReason: state.appeal.appealReason,
    additionalNotes: state.appeal.additionalNotes,
    previousAppealId: state.appeal.previousAppealId,
    additionalData: state.appeal.additionalData,
    adminNotes: state.appeal.adminNotes,
    judgement: state.appeal.judgement,
    prevPageId: state.appeal.prevPageId,
    nextPageId: state.appeal.nextPageId,
    isLoading: state.appeal.isLoading,
    roles: state.auth.roles,
    error: state.alert.error
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    load: (appealId: string) => load(appealId)(dispatch),
    clear: () => dispatch(clearAppeal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Appeal);
