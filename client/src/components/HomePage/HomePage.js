import React, { Component } from 'react';
import './HomePage.css';
import Products from '../Product/products';
import Services from './services';

class HomePage extends Component {
  render() {
    return (
      <div className="Home container-fluid">
        <Services/>
        <Products/>
      </div>
    );
  }
}

export default HomePage;
