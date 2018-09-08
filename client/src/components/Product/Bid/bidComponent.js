import React, { Component } from 'react';
import BidModel from './bidModel';

class BidComponent extends Component {
  render() {
    return (
      <div className='bidingContainer'>
        <BidModel
          time={this.props.time}
          productId={this.props.productId}
          productTitle={this.props.productTitle}
          buttonDisable={this.props.buttonDisable}
        />
      </div>
    )
  }
}

export default BidComponent;