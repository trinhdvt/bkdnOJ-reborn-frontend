import React from 'react';
import { Navigate } from 'react-router-dom';
import {Form} from 'react-bootstrap';

import AceEditor from "react-ace";

// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/ext-language_tools";
// import { modesByName } from 'ace-builds/src-noconflict/ext-modelist';
import { CodeEditor } from 'components/CodeEditor';
import problemApi from 'api/problem';

import { DEFAULT_LANG_SHORTNAME } from 'constants/aceEditorMode';
import {
  __ls_get_code_editor, __ls_set_code_editor 
} from 'helpers/localStorageHelpers';

import 'helpers/importAllAceMode';
import './SubmitForm.scss';


export default class SubmitForm extends React.Component {
  constructor(props) {
    super(props);
    let id2LangMap = {};
    let defaultLang = 0;

    props.lang.forEach((lng) => {
      if (lng.short_name === DEFAULT_LANG_SHORTNAME)
        defaultLang = lng
      id2LangMap[lng.id] = lng;
    })

    this.state = {
      code : "",

      defaultLang: defaultLang,
      selectedLang: defaultLang,

      lang : props.lang,
      id2LangMap,
      redirect: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.submitting !== this.props.submitting) {
      const data = {
        language: this.state.selectedLang.id,
        source: this.state.code,
      }
      const prob = this.props.prob
      problemApi.submitToProblem({name: prob, data})
        .then((res) => {
          console.log(res)
          this.setState({ redirect: `/submission/${res.data.id}` })
        })
        .catch((err) => {
          console.log(err)
          // alert('Cannot submit')
        })
    }
  }

  componentDidMount() {
    const data = __ls_get_code_editor()
    this.setState({...data})
  }

  onCodeEditorChange() {
    const data = {
      code: this.state.code,
      selectedLang: this.state.selectedLang,
    }
    __ls_set_code_editor(JSON.stringify(data))
  }

  onLangChange(e) {
    const lang = this.state.id2LangMap[e.target.value]
    const newLang = (lang || this.state.defaultLang) 
    this.setState({ selectedLang: newLang, }, 
      () => this.onCodeEditorChange()
    );
  }

  onCodeChange(newVal) {
    this.setState({ code: newVal, },
      () => this.onCodeEditorChange()
    );
  }

  render() {
    if (!!this.state.redirect) {
      // this.setState({redirect: false})
      return <Navigate to={`${this.state.redirect}`} />
    }
    
    return (
      <Form className="submit-form">
        <Form.Group className="select-div" >
          <Form.Label>Language: </Form.Label>
          <Form.Select onChange={(e) => this.onLangChange(e)}
            value={this.state.selectedLang.id}
          >
            {
              this.state.lang.map((lng) => 
                (<option key={lng.id} value={lng.id}>{lng.name}</option>)
              )
            }
          </Form.Select>
        </Form.Group>

        <Form.Group className="mt-1">
          <Form.Label>Code:</Form.Label>
          {/* <AceEditor
            mode={this.getAceMode()}
            theme="github"
            onChange={(val) => this.onCodeChange(val)}
            value={this.state.code}
            name="submit-form-code-editor"
            editorProps={{ $blockScrolling: true }}
            style={styles.ace}
          /> */}
          <CodeEditor 
            onCodeChange={(val) => this.onCodeChange(val)}
            code={this.state.code}
            ace={this.state.selectedLang.ace}
          />
        </Form.Group>
      </Form>
    )
  }
};