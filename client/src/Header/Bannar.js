import React, { Component } from 'react';

class Bannar extends Component {
  render() {
    return (
      <div className='bannar'>
        <div className='banner-text'>
          <div className='text-wrapper'>
            <div className='txt'>
            <h4>Welcome to</h4>
            <h1>The biggest <span>marketplace</span></h1>
            <p> Today’s investors need more control, deeper data, added property information, additional interaction and increased services. So we go beyond the courthouse. Combining our passion for real estate with technology and data science, we created an unrivaled transaction platform that has resulted in $34 billion in sales, 3.5 million registered buyers on Auction.com</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Bannar;