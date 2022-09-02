import './evidence.css'
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BanState } from '../../../redux/state';
import { Form, Image, Tab, TabPane } from 'semantic-ui-react';
import * as _ from 'lodash';
import { EvidenceResponse } from './api';
import ReactMarkdown from 'react-markdown';

interface IProps {
  evidence?: EvidenceResponse[];
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

const renderNotes = (notes?: string): string => {
  return notes ? `# Admin Notes:
${notes}` : `## No notes`;
}

const renderPanes = (evidence: EvidenceResponse[],
                      errors: any[], 
                      setErrors: (e: any) => any,
                      loaded: boolean[],
                      setLoaded: (l: boolean[]) => any) => {
  if (!!evidence) {
    return evidence.map((e: EvidenceResponse, index: number) => {
      return {
        menuItem: `Evidence ${index + 1}`,
        render: () => (<TabPane loading={isPaneLoading(e, loaded[index])}>
          <Form>
            {e.evidenceId &&
              <Image onLoad={() => {
                setIndexLoading(index, loaded, setLoaded, true)
                onLoadError(index, errors, setErrors, "")
              }} onError={() => onLoadError(index, errors, setErrors)} src={e.preSignedUrl}/>
            }
            {errors[index] !== "" && <small className='error'>{errors[index]}</small>}
            <hr />
            <ReactMarkdown className="notes-view">{renderNotes(e.notes)}</ReactMarkdown>
          </Form>
        </TabPane>)
      }
      
    })
  } else {
    return undefined;
  }
}

function EvidenceView(props: IProps) {

  const { evidence = [] } = props;
  const [errors, setErrors] = useState(_.times((evidence ? evidence.length : 0), _.constant(-1)));
  const [loaded, setLoaded] = useState(_.times((evidence ? evidence.length : 0), _.constant(false)));

  // TODO: Errors and maybe custom error/success for this modal

  return (
    <div className="Evidence">
      <Tab 
        panes={renderPanes(evidence, errors, setErrors, loaded, setLoaded)}
      />
    </div>
  );
};

const mapStateToProps = (state: BanState) => {
  return {
    evidence: state.appeal.evidence,
    error: state.evidence.error,
    success: state.evidence.success
  }
}

export default connect(mapStateToProps, null)(EvidenceView);
