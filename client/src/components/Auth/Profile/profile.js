import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import PageTitle from '../../Title/title';

class Profile extends Component {
  render() {
    return (
      <div className='user'>
        <PageTitle title={`Welcome ${this.props.user.name}`} />
        <div className='container'>
        <h2>Profile</h2>
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
    )
  }
}

export default Profile;