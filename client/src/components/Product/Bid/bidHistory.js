import React, { Component } from 'react';
import PageTitle from '../../Title/title';
import { Icon } from 'antd';
import './bid-model.css';


class BidHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bids: [],
      productData: {},
      bidsCount: null
    };
  }

  componentDidMount = ()=> {
    // Calling bid data handler
    this.bidDataHandler();
    // calling product data handler
    this.productDataHandler();
  }

  /**
   * Getting the product details
   */
  productDataHandler = ()=> {
    const pId = {
      productId: this.props.match.params.productId
    }
    fetch('http://localhost:8812/product/product-detail', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(pId)
    })
    .then(res => res.json())
    .then(res => this.setState({ productData: res.product[0] }))
  }

  /**
   * Getting the bid data related to that product..
   */
  bidDataHandler = ()=> {
    const formData = {
      productId: this.props.match.params.productId
    }
    fetch('http://localhost:8812/bid/pdt-biddata-getdata', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(res => res.json())
    .then(res => {
      this.setState({ bids: res.bids });
    }).catch();
  }

  /**
   * Go back to product detail page..
   */
  goBack = ()=> {
    this.props.history.goBack();
  }

  render() {
    return (
      <div className='bid-history'>
        <PageTitle title='Bid history' />
        <div className='container back-button'>
          <button onClick={this.goBack}><Icon type="rollback" /> Back to product</button>
        </div>
        <div className='container'>
          <div className='bidHistoryContainer'>
            <p>Only actual bids (not automatic bids generated up to a bidder's maximum) are shown. Automatic bids may be placed days or hours before a listing ends. Learn more about bidding.</p>
            <table className='bidTable'>
              <tbody>
                <tr>
                  <th>Bidder</th>
                  <th>Bid Amount</th>
                  <th>Bid Time</th>
                </tr>
                {
                  this.state.bids.map(bid => {
                    return(
                      <tr key={bid._id}>
                        <td>{bid.user_id}</td>
                        <td>${bid.bid_amount}</td>
                        <td>{bid.bid_time}</td>
                      </tr>
                    );
                  })
                }
                {/* starting bid data */}
                {
                  this.state.bids.length !== 0 ? (
                    <tr className='startingBid'>
                      <td>Starting Price</td>
                      <td>{this.state.productData.price}</td>
                      <td>{this.state.productData.creationData}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td>No bid yet...</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
            <p>If two people bid the same amount, the first bid has priority. Also, you can only retract your bid under certain circumstances. Learn more.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default BidHistory;