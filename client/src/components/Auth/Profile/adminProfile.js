import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import './profile.css';
import TableRow from './adminTableRow';
import PageTitle from '../../Title/title';

class AdminProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            PerPage: 4
        };
    }

    handleClick = (event)=> {
        this.setState({
          currentPage: Number(event.target.id)
        });
    }

    render() {
        const { users } = this.props;
        const { currentPage, PerPage } = this.state; // items
        // Logic for displaying current todos
        const indexOfLastItem = currentPage * PerPage;
        const indexOfFirstItem = indexOfLastItem - PerPage;
        const currentItems = users.slice(indexOfFirstItem, indexOfLastItem); // items

        // Logic for displaying page numbers
        const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(users.length / PerPage); i++) { // items
                pageNumbers.push(i);
            }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li key={number} id={number} onClick={this.handleClick}>
                    {number}
                </li>
            );
        });


        return(
            <div className='manage-users'>
                <PageTitle title='Manage users' />
                <div className='container'>
                    <Table responsive hover className='adminProfileTable'>
                        <thead>
                            <tr>
                                <th>Active</th>
                                <th>Name</th>
                                <th>Email</th>		
                                <th>Gender</th>
                                <th>Phone</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        {
                            currentItems.map(user => {
                                return(
                                    <TableRow
                                        profileLoad={this.props.profileLoad}
                                        key={user._id}
                                        {...user}
                                    />
                                );
                            })
                        }
                    </Table>
                    <hr/>
                    <div className='paginate'>
                        <ul>
                            {renderPageNumbers}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminProfile;