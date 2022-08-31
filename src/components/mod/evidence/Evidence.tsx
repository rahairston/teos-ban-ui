import './evidence.css'
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../../redux/state';
import { Button, Form, Image, Input, Tab, TabPane, TextArea } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import * as _ from 'lodash';
import { EvidenceRequest, EvidenceResponse } from './api';
import { submit } from './reducer';

interface IProps {
  submit: (appealId: string, request: EvidenceRequest) => void;
  setOpen: (open: boolean) => void;
  appealId: string;
  isSubmitting: boolean;
  roles?: string[];
  evidence?: EvidenceResponse[];
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

const renderPanes = (evidence: EvidenceResponse[], 
    isSubmitting: boolean, 
    errors: any[], 
    files: any[], 
    setFiles: (a: any) => any,
    notes: string[], 
    setNotes: (notes: string[]) => any,
    appealId: string,
    submit: (appealId: string, request: EvidenceRequest) => void) => {
  if (!!evidence) {
    return evidence.map((e: EvidenceResponse, index: number) => {
      return {
        menuItem: `Evidence ${index + 1}`,
        render: () => (<TabPane>
          <Form>
            {files[index] !== null && <Image src={URL.createObjectURL(files[index])}/>}
            <Input onChange={(e: any) => changeFiles(e, index, setFiles)} className="evidence-file" type="file" />
            <TextArea onChange={(e: any) => changeNotes(e, index, setNotes)} value={notes[index]} className="admin-notes" placeholder='Add notes here' />
            <Button 
              type='submit' 
              disabled={isSubmitting || errors.filter(item => item !== -1).length > 0 || files[index] === null} 
              onClick={() => {submit(appealId, {
                fileName: files[index].name,
                notes: notes[index]
              })}}
            >
              Submit
            </Button>
          </Form>
        </TabPane>)
      }
      
    })
  } else {
    return undefined;
  }
}

function EvidenceModal(props: IProps) {

  const { setOpen, appealId, isSubmitting, evidence, submit } = props;
  const [evidenceRequest, setEvidenceRequest] = useState(evidence ? evidence: []);
  const [files, setFiles] = useState(_.times((evidence ? evidence.length : 0), _.constant(null)));
  const [notes, setNotes] = useState(_.times((evidence ? evidence.length : 0), _.constant("")));
  const [errors, setErrors] = useState(_.times((evidence ? evidence.length : 0), _.constant(-1)));

  return (
    <div className="Evidence">
      <Tab panes={renderPanes(evidenceRequest, isSubmitting, errors, files, setFiles, notes, setNotes, appealId, submit)}/>
      <Button primary onClick={() => {
          setErrors(_.concat(errors, -1));
          setFiles(_.concat(files, null));
          setNotes(_.concat(notes, ""));
          setEvidenceRequest(_.concat(evidenceRequest, {
            notes: ""
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
    submit: (appealId: string, request: EvidenceRequest) => submit(appealId, request)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EvidenceModal);
