import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PageTitle from '../../Title/title';
import { Table } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './userBids.css';

class BidHistory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userbids: []
        }
    }

    componentDidMount = () => {
        let data = {userId: this.props.userIdRedux}
        fetch('bid/user-bids', {
            method: 'POST',
            headers: {
                'content-type':'application/json'
            },
            body:JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => this.setState({userbids:res.bids}))
        
    }
    

    render() {
        if (this.props.userRedux !== 'Success') {
            return <Redirect to="/"  />
        }
        return (
            <div className='user-bids'>
                <PageTitle title='Bid History' />
                
                <div className='container'>
                    <Table striped condensed hover className='userBids'>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.userbids.map((bid, index) =>{
                                    return(
                                        <tr key={index}>
                                            <td><Link to={`product/${bid.product_id}`}>{bid.product_title}</Link></td>
                                            <td>{bid.bid_amount}</td>
                                            <td>{bid.bid_time}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userRedux: state.authentication.user,
    userIdRedux: state.authentication.userDetails
});

export default connect(mapStateToProps)(BidHistory);