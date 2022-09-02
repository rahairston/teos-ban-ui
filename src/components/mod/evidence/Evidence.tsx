import './evidence.css'
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../../redux/state';
import { Button, Form, Image, Input, Message, Tab, TabPane, TextArea } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import * as _ from 'lodash';
import { EvidenceRequest, EvidenceResponse } from './api';
import { clearError, clearEvidence, clearSucess, onDelete, submit, update } from './reducer';

interface IProps {
  submit: (appealId: string, request: EvidenceRequest, file: Blob) => void;
  update: (appealId: string, evidenceId: string, request: EvidenceRequest, file: Blob) => void;
  deleteEvidence: (appealId: string, evidenceId: string) => void;
  clearError: () => void;
  clearSuccess: () => void;
  clear: () => void;
  open: boolean;
  appealId: string;
  error: string;
  success: string;
  isSubmitting: boolean;
  evidence?: EvidenceResponse[];
  submittedEvidence?: EvidenceResponse[];
}

const changeFiles = (e: any, index: number, setFiles: (a: any) => any) => {
  setFiles((prevFiles: any[]) => {
    return prevFiles.map((f: any, i: number) => {
      if (i === index) {
        return e.target.files[0];
      } else {
        return f;
      }
    })
  })
}

const changeNotes = (e: any, index: number, setNotes: (a: any) => any) => {
  setNotes((prevNotes: string[]) => {
    return prevNotes.map((f: any, i: number) => {
      if (i === index) {
        return e.target.value;
      } else {
        return f;
      }
    })
  })
}

const changesExist = (file: Blob, note: string, evidence: EvidenceResponse): boolean => {
  return (file !== null || note !== evidence.notes);
}

const isPaneLoading = (evidence: EvidenceResponse, fileLoaded: boolean): boolean => {
  return !(!evidence.evidenceId || fileLoaded);
}

const setIndexLoading = (index: number, loaded: boolean[], setLoaded: (a: any) => any, value: boolean) => {
  if (loaded[index] !== value) {
    setLoaded((prevLoaded: boolean[]) => {
      return prevLoaded.map((l: any, i: number) => {
        if (i === index) {
          return value;
        } else {
          return l;
        }
      })
    })
  }
}

const removeIndexOnDelete = (index: number, setFiles: (a: any) => any, setNotes: (a: any) => any, setLoaded: (a: any) => any) => {
  setLoaded((prevLoaded: boolean[]) => {
    return prevLoaded.map((l: any, i: number) => {
      if (i === index) {
        return undefined;
      } else {
        return l;
      }
    }).filter(item => item !== undefined);
  })
  setNotes((prevNotes: string[]) => {
    return prevNotes.map((f: any, i: number) => {
      if (i === index) {
        return undefined;
      } else {
        return f;
      }
    }).filter(item => item !== undefined);
  })

  setFiles((prevFiles: any[]) => {
    return prevFiles.map((f: any, i: number) => {
      if (i === index) {
        return undefined;
      } else {
        return f;
      }
    }).filter(item => item !== undefined);
  })
}

const onLoadError = (index: number, errors: string[], setErrors: (e: any) => any, value?: string) => {
  if (errors[index] !== value) {
    setErrors((errors: any[]) => {
      return errors.map((f: any, i: number) => {
        if (i === index) {
          return value !== undefined ? value : "Image could not be loaded";
        } else {
          return f;
        }
      });
    })
  }
}

const renderPanes = (evidence: EvidenceResponse[],
                      errors: any[], 
                      setErrors: (e: any) => any,
                      files: any[], 
                      setFiles: (a: any) => any,
                      notes: string[], 
                      setNotes: (notes: string[]) => any,
                      loaded: boolean[],
                      setLoaded: (l: boolean[]) => any,
                      props: IProps,
                      setTabIndex: (a: any) => any) => {
  const { appealId, isSubmitting, submit, update, deleteEvidence } = props;
  if (!!evidence) {
    return evidence.map((e: EvidenceResponse, index: number) => {
      return {
        menuItem: `Evidence ${index + 1}`,
        render: () => (<TabPane loading={isPaneLoading(e, loaded[index])}>
          <Form>
            {files[index] !== null && 
              <Image onLoad={() => {
                setIndexLoading(index, loaded, setLoaded, true)
                onLoadError(index, errors, setErrors, "")
              }} onError={() => onLoadError(index, errors, setErrors)} src={URL.createObjectURL(files[index])}/>
            }
            {e.evidenceId && files[index] === null && 
              <Image onLoad={() => {
                setIndexLoading(index, loaded, setLoaded, true)
                onLoadError(index, errors, setErrors, "")
              }} onError={() => onLoadError(index, errors, setErrors)} src={e.preSignedUrl}/>
            }
            {errors[index] !== "" && <small className='error'>{errors[index]}</small>}
            <Input onChange={(e: any) => changeFiles(e, index, setFiles)} className="evidence-file" type="file" />
            <br />
            <label>The below text box supports markdown</label>
            <TextArea onChange={(e: any) => changeNotes(e, index, setNotes)} value={notes[index]} className="admin-notes" placeholder='Add notes here' />
            {!e.evidenceId && <Button 
              type='submit' 
              disabled={isSubmitting || files[index] === null} 
              onClick={() => {submit(appealId, {
                fileName: files[index].name,
                notes: notes[index]
              }, files[index])}}
            >
              Submit
            </Button>}
            {!!e.evidenceId && <Button 
              type='submit' 
              disabled={isSubmitting || !changesExist(files[index], notes[index], e)} 
              onClick={() => {update(appealId, e.evidenceId ? e.evidenceId : "", {
                fileName: files[index] !== null ? files[index].name : undefined,
                notes: notes[index]
              }, files[index])}}
            >
              Update
            </Button>}
            {!!e.evidenceId && <Button 
              type='submit' 
              color='red'
              floated='right'
              onClick={() => {
                  deleteEvidence(appealId, !!e.evidenceId ? e.evidenceId : "")
                  if (index !== 0) {
                    setTabIndex(index - 1)
                  } else {
                    setTabIndex(0)
                  }
                  removeIndexOnDelete(index, setFiles, setNotes, setLoaded);
                }
              }
            >
              Delete
            </Button>}
          </Form>
        </TabPane>)
      }
      
    })
  } else {
    return undefined;
  }
}

function Evidence(props: IProps) {

  const { evidence = [], open, clear, error, success, clearError, clearSuccess } = props;

  const [existingEvidence, setExistingEvidence] = useState(evidence);
  const [tabIndex, setTabIndex] = useState(0);
  const [files, setFiles] = useState(_.times((evidence ? evidence.length : 0), _.constant(null)));
  const [notes, setNotes] = useState(evidence.map((e: EvidenceResponse) => {return e.notes ? e.notes : ""}));
  const [errors, setErrors] = useState(_.times((evidence ? evidence.length : 0), _.constant("")));
  const [loaded, setLoaded] = useState(_.times((evidence ? evidence.length : 0), _.constant(false)));

  useEffect(() => {
    return () => clear()
  }, [open, clear]);

  useEffect(() => {
    setExistingEvidence(evidence);
  }, [evidence]);

  return (
    <div className="Evidence">
      {!!error && <Message className="alert-message" negative  onClick={() => clearError()}>
        <Message.Content>
          Error: {error}
        </Message.Content>
      </Message>}
      {!!success && <Message className="alert-message" success  onClick={() => clearSuccess()}>
        <Message.Content>
          Success: {success}
        </Message.Content>
      </Message>}
      {files.length !== 0 && <Tab 
        panes={renderPanes(existingEvidence, errors, setErrors, files, setFiles, notes, setNotes, loaded, setLoaded, props, setTabIndex)}
        activeIndex={tabIndex}
        onTabChange={(e: any, obj: any) => setTabIndex(obj.activeIndex)}
      />}
      <Button primary onClick={() => {
          setErrors(_.concat(errors, ""));
          setFiles(_.concat(files, null));
          setNotes(_.concat(notes, ""));
          setLoaded(_.concat(loaded, false));
          setExistingEvidence(_.concat(existingEvidence, {
            notes: "",
            preSignedUrl: ""
          }));
        }}>+ Add Another</Button>
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    evidence: state.appeal.evidence,
    error: state.evidence.error,
    success: state.evidence.success,
    isSubmitting: state.evidence.isSubmitting
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    submit: (appealId: string, request: EvidenceRequest, file: Blob) => submit(appealId, request, file)(dispatch),
    update: (appealId: string, evidenceId: string, request: EvidenceRequest, file: Blob) => update(appealId,evidenceId,request,file)(dispatch),
    deleteEvidence: (appealId: string, evidenceId: string) => onDelete(appealId, evidenceId)(dispatch),
    clearError: () => dispatch(clearError()),
    clearSuccess: () => dispatch(clearSucess()),
    clear: () => dispatch(clearEvidence())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Evidence);
