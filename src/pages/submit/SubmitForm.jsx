import React from 'react';
import {Form} from 'react-bootstrap';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { modes, modesByName } from 'ace-builds/src-noconflict/ext-modelist';

import {
  __ls_get_code_editor, __ls_set_code_editor 
} from 'helpers/localStorageHelpers';

import 'helpers/importAllAceMode';
import './SubmitForm.scss';

const FALLBACK_ACE_MODE = 'plain_text';
const DEFAULT_ACE_MODE = 'c_cpp';
const DEFAULT_LANG_SHORTNAME = 'C++17';

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
    }
  }

  componentDidMount() {
    const data = __ls_get_code_editor()
    this.setState({...data})
    // console.log('Mounting:', data)
  }

  getAceMode() {
    return (
      !!modesByName[this.state.selectedLang.ace] 
      ? this.state.selectedLang.ace 
      : FALLBACK_ACE_MODE)
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
          <AceEditor
            mode={this.getAceMode()}
            theme="github"
            onChange={(val) => this.onCodeChange(val)}
            value={this.state.code}
            name="submit-form-code-editor"
            editorProps={{ $blockScrolling: true }}
            style={styles.ace}
          />
        </Form.Group>
      </Form>
    )
  }
}

const styles = {
  ace: {
    width: "100%",
    maxHeight: "300px",
    overflow: "auto",
  }
}