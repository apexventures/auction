import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { Button, Modal, Input } from 'antd';
import PageTitle from '../../Title/title';
import store from '../../../store';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      name: '', 
      phone: '', 
      gender: ''
    };
  }

  componentWillMount = () => {
    this.setState({ name: this.props.user.name, phone: this.props.user.phone, gender: this.props.user.gender })
  }

  showModal = () => {
    this.setState({ visible: true });
  }

  handleOk = () => {
    // send updated data to backend
    let editData = {
      id: store.getState().authentication.userDetails,
      name: this.state.name,
      gender: this.state.gender,
      phone: this.state.phone,
      email: this.props.user.email,
      isActive: true
    };
    fetch('users/edituser', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
        body: JSON.stringify(editData)
    })
    .then(res => {
      if(res.status === 200) {
        this.props.profileLoad();
        this.setState({ visible: false });
      }
    })
    .catch(err => {
      console.log('react error: edit user', err);
    });

  }

  handleCancel = (e) => {
    this.setState({ visible: false });
  }

  onChange=(e)=> {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className='user'>
        <PageTitle title={`Welcome ${this.props.user.name}`} />
        <div className='container userprofile'>
          <div className='uphd24'>
            <h2 className='profile'>Profile</h2>
            <Button className='editbtn' onClick={this.showModal}>Edit Profile</Button>
          </div>
          <div className='user-data'>
            <Table responsive>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{this.props.user.name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{this.props.user.email}</td>
                </tr>
                <tr>
                  <th>Gender</th>
                  <td>{this.props.user.gender}</td>
                </tr>
                <tr>
                  <th>Phone</th>
                  <td>{this.props.user.phone}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        <Modal
          className='profileEditeModel'
          title="Edit Profile"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText='Submit'
        >
          <div className='edp1'>
            <label>Name: </label>
            <Input 
              placeholder='Name'
              value={this.state.name}
              name='name'
              onChange={this.onChange}
            />
          </div>
          <div className='edp1'>
            <label>Gender: </label>
            <select name='gender' onChange={this.onChange}>
              <option default>Gender (Optional)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className='edp1'>
            <label>Phone: </label>
            <Input 
              name='phone'
              placeholder='Phone'
              value={this.state.phone}
              onChange={this.onChange}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

export default Profile;