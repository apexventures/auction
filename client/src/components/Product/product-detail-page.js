import React, { Component } from 'react';
import './products.css';
import BidComponent from './Bid/bidComponent';
import ListButton from './Chat/listOfSenderButton';
import Timmer from './timmer';
import PageTitle from '../Title/title';

class DetailPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {},
      isDisable: false
    };
  }

  componentDidMount = () => {
    this.fetchProductDetails();
  }

  /**
   * fetch product details from an API
   */
  fetchProductDetails =()=>{
    const productId = this.props.match.params.productId;
    const formData = { productId: productId }
    fetch('product-detail', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(res => {
      this.setState({ product: res.product[0] });
    })
  }

  forDisableButton =(v)=>{
    this.setState({ isDisable: v })
  }

  render() {
    const productId = this.props.match.params.productId;
    return (
      <div>
        <PageTitle title={this.state.product.title} />
        <div className='container detail-page'>
          <div className='col-sm-5 image'>
            <img src={`http://localhost:8812/${this.state.product.productImg}`} alt={this.state.product.title} />
          </div>
          <div className='col-sm-4'>
            <h3>{this.state.product.title}</h3>
            <p className='discription'>{this.state.product.discription}</p>
            <p className='product-time'>
              Time left:
              <Timmer forDisableButton={this.forDisableButton} value={this.state.product.bidEndTime} />
            </p>

            {
              this.state.product ?
              <BidComponent
                time={this.state.product.bidEndTime}
                productId={this.props.match.params.productId} 
                productTitle={this.state.product.title}
                buttonDisable={this.state.isDisable} 
              />
              : null
            }
            
          </div>
          
          <ListButton productId={productId} productOwnerId={this.state.product.userId} />
          
        </div>
      </div>
    );
  }
}


export default DetailPage;