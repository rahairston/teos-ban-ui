import './ban.css'
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../../redux/state';
import { Button, Form, Icon, Input } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import * as _ from 'lodash';
import { BannedByAction, BannedByObject } from './api';
import { submit } from './reducer';

interface IProps {
  submit: (appealId: string, request: BannedByObject[]) => void;
  appealId: string;
  isSubmitting: boolean;
  roles?: string[];
  bannedBy?: BannedByObject[];
  setOpen: (open: boolean) => void;
}

const validateSubmit = (request: BannedByObject[]|undefined, 
  appealId: string, 
  submit: (appealId: string, request: BannedByObject[]) => void,
  setOpen: (open: boolean) => void,
  setErrors: (a: any) => any) => {
  if (!!request) {
    const errors = request.map((item: BannedByObject, index: number) => {
      if (!!item.name && !!item.banDate) {
        return -1;
      } else {
        return index;
      }
    });
    if (errors.filter(item => item !== -1).length === 0) {
      submit(appealId, request);
      setOpen(false);
    } else {
      setErrors(errors);
    }
  }
}

function BannedBy(props: IProps) {

  const { appealId, isSubmitting, bannedBy, submit, setOpen } = props;
  const [bannedByRequest, setBannedByRequest] = useState(bannedBy ? bannedBy: []);
  const [errors, setErrors] = useState(_.times((bannedBy ? bannedBy.length : 0), _.constant(-1)));

  return (
    <div className="BannedBy">
      <Form>
        {bannedByRequest && bannedByRequest.map((request: BannedByObject, index: number) => {
          return (<Form.Field className="existing-ban-data"  key={index}>
            {errors[index] !== -1 && <label className="error">Banning Mod and Ban Date cannot be empty.</label>}
            <Input label="Banning Mod" 
              className='banning-input'
              disabled={request.action === BannedByAction.DELETE}
              size='large'
              error={errors[index] !== -1}
              value={request.name}
              onChange={(e: any) => {
                  if (errors[index] !== -1) {
                    setErrors((prevErrors: number[]) => {
                        return prevErrors.map((item: number, index2: number) => {
                          if (index === index2) {
                            return -1;
                          } else {
                            return item;
                          }
                        })
                    })
                  }
                  setBannedByRequest((prevObject: BannedByObject[]) => {
                    return prevObject.map((item: BannedByObject, ind: number) => {
                      if (ind === index) {
                        return {
                          bannedById: item.bannedById,
                          name: e.target.value,
                          banDate: item.banDate,
                          action: item.action === BannedByAction.CREATE ? item.action : BannedByAction.UPDATE
                        };
                      } else {
                        return item;
                      }
                    })
                  });
                }
              }
            />
            <Input label="Ban Date" 
              size='large'
              className='banning-input'
              disabled={request.action === BannedByAction.DELETE}
              error={errors[index] !== -1}
              value={request.banDate}
              onChange={(e: any) => {
                if (errors[index] !== -1) {
                  setErrors((prevErrors: number[]) => {
                      return prevErrors.map((item: number, index2: number) => {
                        if (index === index2) {
                          return -1;
                        } else {
                          return item;
                        }
                      })
                  })
                }
                setBannedByRequest((prevObject: BannedByObject[]) => {
                  return prevObject.map((item: BannedByObject, ind: number) => {
                    if (ind === index) {
                      return {
                        bannedById: item.bannedById,
                        name: item.name,
                        banDate: e.target.value,
                        action: item.action === BannedByAction.CREATE ? item.action : BannedByAction.UPDATE
                      };
                    } else {
                      return item;
                    }
                  })
                });
              }
            }
            />
            {request.action !== BannedByAction.DELETE && <Button 
              type='submit' 
              color='red'
              className="delete-ban-data"
              onClick={() => {
                setBannedByRequest((prevObject: BannedByObject[]) => {
                  return prevObject.map((item: BannedByObject, ind: number) => {
                    if (ind === index && item.action === BannedByAction.CREATE) {
                      return undefined; //remove any "new" ones since we wouldn't do anything with those
                    } else if (ind === index) {
                      return {
                        bannedById: item.bannedById,
                        name: item.name,
                        banDate: item.banDate,
                        action: BannedByAction.DELETE
                      };
                    } else {
                      return item;
                    }
                  }).filter((item: BannedByObject|undefined) => item !== undefined) as BannedByObject[];
                });
              }}
            >
              <Icon size="large" name="trash" className="bottom-icons" />
            </Button>}
            {request.action === BannedByAction.DELETE && <Button 
              type='submit' 
              className="delete-ban-data"
              onClick={() => {
                setBannedByRequest((prevObject: BannedByObject[]) => {
                  return prevObject.map((item: BannedByObject, ind: number) => {
                     if (ind === index) {
                      item.action = BannedByAction.UPDATE;
                      return item;
                    } else {
                      return item;
                    }
                  });
                });
              }}
            >
              <Icon size="large" name="undo" className="bottom-icons" />
            </Button>}
          </Form.Field>);
        })}
        <Button primary onClick={() => {
          setErrors(_.concat(errors, -1))
          setBannedByRequest(_.concat(bannedByRequest, {
            name: "",
            banDate: "",
            action: BannedByAction.CREATE
          }));
        }}>+ Add Another</Button>
        <hr />
        <Button 
          type='submit' 
          disabled={isSubmitting || errors.filter(item => item !== -1).length > 0} 
          onClick={() => validateSubmit(bannedByRequest, appealId, submit, setOpen, setErrors)}
          >
            Submit
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    bannedBy: state.appeal.bannedBy,
    isSubmitting: state.bannedBy.isSubmitting
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    submit: (appealId: string, request: BannedByObject[]) => submit(appealId, request)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BannedBy);
