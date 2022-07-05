import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {Modal,Button} from 'react-bootstrap';

import { updateSelectedOrg } from 'redux/MyOrg/actions';

// import DropdownTreeSelect from 'react-dropdown-tree-select';
import DropdownTreeSelect from 'components/DropdownTreeNoRerender';
import 'react-dropdown-tree-select/dist/styles.css'

const getDropdownTreeSelectData = (orgs, selectedOrgSlug=null) => {
    let list = []
    orgs.forEach((org) => {
        let mutable = {...org}
        mutable.label = org.short_name
        mutable.tagLabel = org.slug
        if (mutable.slug === selectedOrgSlug) mutable.checked=true;

        let childData = getDropdownTreeSelectData(org.sub_orgs, selectedOrgSlug);
        mutable.children = childData

        list.push(mutable)
    })
    return list;
}

class SwitchOrgModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrg: {},
      data: [],
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedOrg !== this.state.selectedOrg) {
      this.props.updateSelectedOrg(this.state.selectedOrg)
    }

    if (prevProps.myOrg !== this.props.myOrg || prevProps.selectedOrg !== this.props.selectedOrg) {
      let selectedOrgSlug = this.props.selectedOrg.slug;
      this.setState({ data: [
        ...getDropdownTreeSelectData(this.props.myOrg.memberOf, selectedOrgSlug),
      ]})
    }
  }

  onChangeHandler(currNode, selNodes) {
    console.log(selNodes)
    if (selNodes.length > 0) {
      const org = {
        short_name: selNodes[0].short_name,
        name: selNodes[0].name,
        slug: selNodes[0].slug,
      }
      this.setState({ selectedOrg: org })
    } else {
      this.setState({ selectedOrg: {} })
    }
  }

  render() {
    const {show, setShow} = this.props;

    return (
      <Modal
        show={show}
        onHide={() => setShow(false)}
        // dialogClassName="modal-90w
        // size="lg"
        aria-labelledby="switch-org-modal"
        // centered
      >
        <Modal.Header>
          <Modal.Title id="switch-org-modal">
            Change Organization
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex-center-col">
          <p>
            {/* Bạn đang xem với tư cách là thành viên của: */}
            You are viewing as a member of organization:
          </p>

          {/* <DropdownTreeSelect data={data} mode="radioSelect"
            onChange={(a,b)=>this.onChangeHandler(a,b)}
          /> */}
          <DropdownTreeSelect data={this.state.data} mode="radioSelect"
            onChange={(a,b)=>this.onChangeHandler(a,b)}
          />

          <em>
            {/* Đổi thiết lập bên trên để có thể xem các tài nguyên mà chỉ
            chia sẻ riêng tư cho một số tổ chức nhất định. */}
            Change the above settings will allow you to view other resources
            those are shared only to other organizations.
          </em>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={()=>setShow(false)}>Change</Button>
          <Button variant="secondary" onClick={()=>setShow(false)}>Cancle</Button>
        </Modal.Footer>
      </Modal>
  )}
}

SwitchOrgModal.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func,
}


const mapStateToProps = state => {
  return {
    myOrg: state.myOrg,
    selectedOrg: state.myOrg.selectedOrg,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateSelectedOrg: (org) => dispatch(updateSelectedOrg({ selectedOrg: org })),
  }
}

let wrapped = SwitchOrgModal;
wrapped = connect(mapStateToProps, mapDispatchToProps)(wrapped);
export default wrapped;
