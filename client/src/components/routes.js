import React, { Component } from 'react';
import { Route } from "react-router-dom";

import HomePage from './HomePage/HomePage';
import SignUp from './Auth/SignUp';
import SignIn from './Auth/SignIn';
import UserProfile from './Auth/Profile/UserProfile';
import AddItems from './Auth/Items/addItems';
import Items from './Auth/Items/items';
import HowToShop from './HowToShop/howToShop';
import UserBids from './Auth/UserBids/UserBids';
// Products routes
import Products from './Product/products';
import ProductDetailPage from './Product/product-detail-page';
import BidHistory from './Product/Bid/bidHistory';

class Routes extends Component {
  render() {
    return (
      <div className='PageContent'>
        <Route exact path="/" component={HomePage} />
        <Route path="/products" component={Products} />
        <Route path="/signup" component={SignUp} />
        <Route path='/add-item' component={AddItems} />
        <Route path='/product-history' component={Items} />
        <Route path="/signin" component={SignIn}/>
        <Route path="/profile" component={UserProfile}/>
        <Route path="/product/:productId" component={ProductDetailPage}/>
        <Route path="/pdt/view/bidhistory/:productId" component={BidHistory} />
        <Route path="/how-to-shop" component={HowToShop} />
        <Route path="/user-bids" component={UserBids} />
      </div>
    )
  }
}

export default Routes;