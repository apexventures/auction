import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import store from '../../../store';
import PageTitle from '../../Title/title';
import { Button } from 'antd';
import { Link } from "react-router-dom";

class Items extends Component {

    constructor(props){
        super(props);

        this.state={
            products: []
        };
    }

    componentDidMount = () => {
      if(store.getState().authentication.role === 'admin') {
          this.fetchingForAdmin();
      } else if(store.getState().authentication.accountType === 'business') {
          this.fetchingForBusinessUser();
      }
    }
    

    fetchingForAdmin =()=>{
        fetch('product/products-for-admin')
        .then(res => res.json())
        .then(res => this.setState({ products: res.products }))
        .catch(error => console.log(error));
    }

    fetchingForBusinessUser =()=>{
        let data = {userId: store.getState().authentication.userDetails};
        fetch('product/product-history', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => this.setState({ products: res.products }))
        .catch(error => console.log('React error: fetchingForBusinessUser, items.js', error));
    }

    render() {
        return (
            <div className='product-history'>
                <PageTitle title='Products' />
                <div className='container'>
                <div className='add-button'>
                    <Link to='/add-item'><Button>Add Product</Button></Link>
                </div>
                    <Table responsive hover condensed>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Starting price</th>
                                <th>Current Bid</th>	
                                <th>Bid End Time</th>
                            </tr>
                            {
                                this.state.products.map(product =>{
                                    return(
                                        <tr key={product._id}>
                                            <td><Link to={`product/${product._id}`}>{product.title}</Link></td>
                                            <td>{product.price}</td>
                                            <td>{product.currentBid}</td>
                                            <td>{product.bidEndTime}</td>
                                        </tr>
                                    );
                                })
                            }
                        </thead>
                    </Table>
                </div>
            </div>
        );
    }
}

export default Items;