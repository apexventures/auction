import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Switch, Icon } from 'antd';


class AdminTableRow extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            name: '',
            email: '',
            gender: '',
            phone: '',
            isEdit: false,
            show: false,
            userId: '',
            isActive: ''
        };
    }

    onEditClick = (id)=> {
        this.setState({ isEdit: true, id: id, name: this.props.name, email: this.props.email, gender: this.props.gender, phone: this.props.phone });
    }

    onDeleteClick = (id)=> {
        let userId = {
            id : this.state.userId
        };
        fetch('users/deleteuser', {
            method: 'POST',
            headers: {
                'content-type':'application/json'
            },
                body: JSON.stringify(userId)
        })
        .then( res => {
            if(res.status === 200) {
                this.props.profileLoad();
            }
        })
        .catch(err => {
            console.log('react error: delete user', err);
        });
    }

    onSaveClick = ()=> {
        this.setState({ isEdit: false });
        // send updated data to backend
        let editData = {
            id: this.state.id,
            name: this.state.name,
            email: this.state.email,
            gender: this.state.gender,
            phone: this.state.phone,
            isActive: this.state.isActive
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
            }
        })
        .catch(err => {
            console.log('react error: edit user', err);
        });
    }

    onChangeHandle = (e)=> {
        this.setState({ [e.target.name]: e.target.value });
    }

    onCancelClick = ()=> {
        this.setState({ isEdit: false, show: false });
    }

    showConfirmModel = (id)=> {
        this.setState({ userId: id, show: true });
    }

    switchChange = (checked)=> {
        this.setState({ isActive: checked });
    }

    render() {
        const { _id, name, email, gender, phone, isActive } = this.props;
        return (
            <tbody>
                {
                    this.state.isEdit ? (
                        <tr>
                            <td><Switch size="small" checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange} /></td>
                            <td><input className='name' defaultValue={name} name='name' onChange={this.onChangeHandle} /></td>
                            <td><input className='email' defaultValue={email} name='email' onChange={this.onChangeHandle} /></td>
                            <td><input className='gender' defaultValue={gender} name='gender' onChange={this.onChangeHandle} /></td>
                            <td><input className='phone' defaultValue={phone} name='phone' onChange={this.onChangeHandle} /></td>
                            <td><button onClick={this.onSaveClick}>Save</button></td>
                            <td><button onClick={this.onCancelClick}>Cancel</button></td>
                        </tr>
                    ) : (
                        <tr>
                            <td><Switch size="small" checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} disabled defaultChecked={isActive} /></td>
                            <td>{name}</td>
                            <td>{email}</td>
                            <td>{gender}</td>
                            <td>{phone}</td>
                            <td><button onClick={() => this.onEditClick(_id)}>Edit</button></td>
                            <td><button onClick={() => this.showConfirmModel(_id)}>Delete</button></td>
                        </tr>
                    )
                }
                
                <Modal show={this.state.show} onHide={this.handleClose} className='confirmBox'>
                    <Modal.Body>
                        <h4>Do you Want to delete this user?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='cancel' onClick={this.onCancelClick}>Cancel</Button>
                        <Button className='delete' onClick={this.onDeleteClick}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            </tbody>
        )
    }
}

export default AdminTableRow;