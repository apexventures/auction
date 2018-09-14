import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Alert, Icon, Input } from 'antd';
import socketIOClient from "socket.io-client";
import store from '../../../store';
import Timmer from '../../Product/timmer';
import './bid-model.css';


class BidModel extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      confirmShow: false,
      valueError: false,
      redirect: false,
      connectErr: '',
      currentBid: '',
      bidValue: '',
      currentBidDetails: '',
      bids: ''
    };

    this.socket = socketIOClient('http://localhost:8812');
    // socket.io  **************************************************************
    this.socket.on('changeBid', (updateBid) => {
      if(updateBid.productId === this.props.productId) {
        this.setState({ currentBid: updateBid.bidValue }, ()=>{
          this.updateCurrentBid(updateBid.bidValue);
          this.fetchProductDetails();
          this.getCurrentBidDetails();
        });
      }
    })
  }

  
  /**
   * when the bid model is closed
   */
  handleClose=()=> {
    this.setState({ show: false, confirmShow: false, valueError: false, bidValue: '' });
  }

  /**
   * check if the user is loged-in..
   * validate the bid value..
   */
  onClickHandle=()=> {
    this.getCurrentBidDetails();
    if(store.getState().authentication.user === 'Success') {
      if(this.state.bidValue === '') {
        // if empty
        this.setState({ show: true });
      } else if(isNaN(this.state.bidValue)) {
        // if wrong value
        this.setState({ show: true, valueError: true, bidValue: '' });
      } else {
        // if number
        this.setState({ confirmShow: true });
      }
    } else {
      // Not loged in
      this.setState({ redirect: true });
    }
  }

  /**
   * ok...
   */
  onChangeHandle=(e)=> {
    this.setState({ [e.target.name]: e.target.value });
  }

  /**
   * ok...
   */
  bidModelClickHandle=()=> {
    if(this.state.bidValue === '' || isNaN(this.state.bidValue)) {
      // if value empty (or) not valid
      this.setState({ valueError: true });
    } else {
      // enter correct value
      this.setState({ valueError: false, show: false, confirmShow: true });
    }
  }


  componentDidMount = () => {
    this.fetchProductDetails();
    this.numberOfBids();
  }

  /**
   * ok...
   * Send bid-data into the database
   */
  sendBidData=(bid)=> {
    let formData = {
      productTitle: this.props.productTitle,
      bid_amount: bid,
      product_id: this.props.productId,
      user_id: store.getState().authentication.userId,
      userDetails: store.getState().authentication.userDetails
    }
    fetch('/bid/pdt-biddata', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(res => {
      if(res.status === 200) {
        this.handleClose();
      } else if(res.status === 500) {
        this.setState({ connectErr: 'Something went wrong, please check your connect'});
      }
    }).catch(error => {
      console.log('React error, bidModel.js', error);
    });
  }

  /**
   * ok...    Done
   * fetch product details from an API
   */
  fetchProductDetails =()=>{
    const formData = { productId: this.props.productId }
    fetch('product-detail', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(res => {
      this.setState({ currentBid: res.product[0].currentBid }, ()=>{ this.getCurrentBidDetails() });
    })
  }

  /**
   *  ok...   Done
   * update the current bid into the database..
   */
  updateCurrentBid=(bid)=> {
    let updateData = {
      product_id: this.props.productId,
      currentBid: bid
    }
    if(updateData.currentBid !=='' || updateData.currentBid !== null) {
      fetch('currentBid-update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })
    .then(res => res.json())
    .then(res => {
      this.setState({ currentBid: res.currentBid })
    })
    .catch(error => {
      console.log('React error, bidModel.js Updata data', error);
    });
    }
  }

  /**
   * ok...
   * Getting number of bids related to this product
   */
  numberOfBids = ()=> {
    const formData = {
      productId: this.props.productId
    }
    fetch('/bid/pdt-biddata-getdata', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(res => {
      this.setState({ bids: res.bids.length });
    })
  }

  /**
   * ok...
   * confirm order handle and validate..
   */
  confirmOrderHandle=()=> {
    let currentBid = Number(this.state.currentBid);
    let bidValue = Number(this.state.bidValue);
    let socketData = {
      bidValue: this.state.bidValue,
      productId: this.props.productId,
      bidUser: store.getState().authentication.userDetails
    };

    if(currentBid < bidValue) {
      this.sendBidData(bidValue);
      this.updateCurrentBid(bidValue);
      this.numberOfBids();
      // socket.io  **************************************************************
      this.socket.emit('changeBid', socketData);
    } else {
      this.setState({ 
        confirmShow: false,
        show: true,
        valueError: true
      })
    }
  }

  /**
   * ***** ....
   * get current bid details
   */
  getCurrentBidDetails =()=>{
    let data = {
      productId: this.props.productId,
      currentBid: this.state.currentBid
    };
    fetch('/bid/pdt-get-current-bid-data', {
      method: 'POST',
      headers: {
        'content-type':'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      this.setState({ currentBidDetails: res.bid })
    })
    .catch(error => console.log('React error: getCurrentBidDetails, bidModel.js', error));
  }


  inputClick =()=>{
    this.getCurrentBidDetails();
  }


  render() {
    let userDetails = this.state.currentBidDetails;
    if(this.state.redirect === true) {
      return (
				<Redirect to="/signin"  />
			);
    }
    let inputField;
    if(userDetails !== undefined ) {
      if(store.getState().authentication.userDetails === userDetails.userDetails) {
        inputField = <Input
          type='text' 
          name='bidValue'
          value={this.state.bidValue}
          onChange={this.onChangeHandle}
          disabled
          placeholder="You'r the highest bidder"
          className='disabledinput'
        />
      } else {
        inputField = <Input
          type='text' 
          name='bidValue'
          className='inputdp'
          value={this.state.bidValue}
          onChange={this.onChangeHandle}
          onClick={this.inputClick}
        />
      }
    } else {
      inputField = <Input
        type='text' 
        name='bidValue'
        className='inputdp'
        value={this.state.bidValue}
        onChange={this.onChangeHandle}
        onClick={this.inputClick}
      />
    }
    const errorMsg = 'Enter a valid amount for your bid.';
    const highbidmsg = <p className='topBidder'><Icon type='check-circle' />You're the highest bidder on this item, but you're close to being outbid.</p>;
    
    return (
        <div>
          <div className='currentbid'>
            <span className='currentbidTitle'>Current bid:</span>
            <span className='currentbidPrice'>US ${this.state.currentBid}</span>
            <Link to={`/pdt/view/bidhistory/${this.props.productId}`}>[{this.state.bids} bids]</Link>
          </div>

          <p>{this.state.connectErr}</p>

          {inputField}
          
          <Button type="primary" ghost onClick={this.onClickHandle} disabled={this.props.buttonDisable}>
            Place bid
          </Button>

          {/*********************** Bid Model ***********************/}
          
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                US ${this.state.currentBid}
                <span>+ See item description for shipping</span>
              </Modal.Title>
              <p><Timmer value={this.props.time} /> left	| Bid Count {this.state.bids} Bids</p>
            </Modal.Header>
            { this.state.valueError ? <h3>{errorMsg}</h3> : <p></p> }

            {
              userDetails !== undefined ?
              store.getState().authentication.userDetails === userDetails.userDetails ?
                <Alert
                  message={highbidmsg} 
                  type="success"
                /> : null
              : null
            }
            <Modal.Body>
              <h4>Place your bid</h4>
              <Input type='text' name='bidValue' value={this.state.bidValue} onChange={this.onChangeHandle} />
              {
                userDetails !== undefined ?
                store.getState().authentication.userDetails === userDetails.userDetails ?
                <Button disabled type="primary" ghost onClick={this.bidModelClickHandle} >Bid</Button> : 
                <Button type="primary" ghost onClick={this.bidModelClickHandle} >Bid</Button>
                : <Button type="primary" ghost onClick={this.bidModelClickHandle} >Bid</Button>
              }
              
            </Modal.Body>
            <Modal.Footer>
              <p>By placing a bid, you're committing to buy this item if you win.</p>
            </Modal.Footer>
          </Modal>

          {/*********************** Confirm Order Model ***********************/}
          
          <Modal show={this.state.confirmShow} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                US ${this.state.currentBid}
                <span>+ FREE SHIPPING</span>
              </Modal.Title>
              <p><Timmer value={this.props.time} /> left	| Bid Count {this.state.bids} Bids</p>
            </Modal.Header>
            <Modal.Body>
              <h4>{this.state.bidValue}</h4>
              <Button type="primary" ghost onClick={this.confirmOrderHandle}>Confirm</Button>
            </Modal.Body>
            <Modal.Footer>
              <p>By clicking Confirm, you commit to buy this item from the seller if you are the winning bidder.</p>
            </Modal.Footer>
          </Modal>
        </div>
      );
  }
}


export default BidModel;