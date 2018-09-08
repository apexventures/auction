import React, { Component } from 'react';

export default class HowToShopDis extends Component {
  render() {
    return (
      <div className='httext ht'>
        <div className='text'>
          <h2>{this.props.title}</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor unt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in der henderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          <button>{this.props.buton}</button>
        </div>
      </div>
    )
  }
}