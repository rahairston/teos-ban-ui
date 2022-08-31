import './evidence.css'
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../../redux/state';
import { Button, Form, Image, Input, Tab, TabPane, TextArea } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import * as _ from 'lodash';
import { EvidenceRequest, EvidenceResponse } from './api';
import { clearEvidence, onDelete, submit, update } from './reducer';

interface IProps {
  submit: (appealId: string, request: EvidenceRequest, file: Blob) => void;
  update: (appealId: string, evidenceId: string, request: EvidenceRequest, file: Blob) => void;
  deleteEvidence: (appealId: string, evidenceId: string) => void;
  clear: () => void;
  open: boolean;
  appealId: string;
  isSubmitting: boolean;
  roles?: string[];
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

const renderPanes = (evidence: EvidenceResponse[],
                      errors: any[], 
                      files: any[], 
                      setFiles: (a: any) => any,
                      notes: string[], 
                      setNotes: (notes: string[]) => any,
                      props: IProps) => {
  const { appealId, isSubmitting, submit, update, deleteEvidence } = props;
  if (!!evidence) {
    return evidence.map((e: EvidenceResponse, index: number) => {
      return {
        menuItem: `Evidence ${index + 1}`,
        render: () => (<TabPane>
          <Form>
            {files[index] !== null && <Image src={URL.createObjectURL(files[index])}/>}
            {e.evidenceId && files[index] === null && <Image src={e.preSignedUrl}/>}
            <Input onChange={(e: any) => changeFiles(e, index, setFiles)} className="evidence-file" type="file" />
            <TextArea onChange={(e: any) => changeNotes(e, index, setNotes)} value={notes[index]} className="admin-notes" placeholder='Add notes here' />
            {!e.evidenceId && <Button 
              type='submit' 
              disabled={isSubmitting || errors.filter(item => item !== -1).length > 0 || files[index] === null} 
              onClick={() => {submit(appealId, {
                fileName: files[index].name,
                notes: notes[index]
              }, files[index])}}
            >
              Submit
            </Button>}
            {!!e.evidenceId && <Button 
              type='submit' 
              disabled={isSubmitting || errors.filter(item => item !== -1).length > 0 || !changesExist(files[index], notes[index], e)} 
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
              onClick={() => deleteEvidence(appealId, !!e.evidenceId ? e.evidenceId : "")}
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

  const { evidence = [], open, clear } = props;

  const [existingEvidence, setExistingEvidence] = useState(evidence);
  const [files, setFiles] = useState(_.times((evidence ? evidence.length : 0), _.constant(null)));
  const [notes, setNotes] = useState(evidence.map((e: EvidenceResponse) => {return e.notes ? e.notes : ""}));
  const [errors, setErrors] = useState(_.times((evidence ? evidence.length : 0), _.constant(-1)));

  // TODO: Errors and maybe custom error/success for this modal

  useEffect(() => {
    return () => clear()
  }, [open, clear]);

  useEffect(() => {
    setExistingEvidence(evidence);
  }, [evidence]);

  return (
    <div className="Evidence">
      <Tab panes={renderPanes(existingEvidence, errors, files, setFiles, notes, setNotes, props)}/>
      <Button primary onClick={() => {
          setErrors(_.concat(errors, -1));
          setFiles(_.concat(files, null));
          setNotes(_.concat(notes, ""));
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
    isSubmitting: state.evidence.isSubmitting
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    submit: (appealId: string, request: EvidenceRequest, file: Blob) => submit(appealId, request, file)(dispatch),
    update: (appealId: string, evidenceId: string, request: EvidenceRequest, file: Blob) => update(appealId,evidenceId,request,file)(dispatch),
    deleteEvidence: (appealId: string, evidenceId: string) => onDelete(appealId, evidenceId)(dispatch),
    clear: () => dispatch(clearEvidence())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Evidence);
