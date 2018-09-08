import React, { Component } from 'react';
import {Icon} from 'antd';

export default class Services extends Component {
  render() {
    return (
      <div className='services container'>
        <div className='service col-lg-3 col-md-4 col-sm-6 col-xs-6'>
            <div className='service_icon'>
                <Icon type="gift" />
            </div>
            <div className='title'>
                <h3>Buy & Sell Easily</h3>
            </div>
            <div className='discription'>
                <p>Lorem ipsum dolor sit amet, consectetur sicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
        </div>

        <div className='service col-lg-3 col-md-4 col-sm-6 col-xs-6'>
            <div className='service_icon'>
                <Icon type="lock" />
            </div>
            <div className='title'>
                <h3>Secure Transaction</h3>
            </div>
            <div className='discription'>
                <p>Lorem ipsum dolor sit amet, consectetur sicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
        </div>

        <div className='service col-lg-3 col-md-4 col-sm-6 col-xs-6'>
            <div className='service_icon'>
                <Icon type="like" />
            </div>
            <div className='title'>
                <h3>Products Control</h3>
            </div>
            <div className='discription'>
                <p>Lorem ipsum dolor sit amet, consectetur sicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
        </div>

        <div className='service col-lg-3 col-md-4 col-sm-6 col-xs-6'>
            <div className='service_icon'>
                <Icon type="rocket" />
            </div>
            <div className='title'>
                <h3>Quality Platform</h3>
            </div>
            <div className='discription'>
                <p>Lorem ipsum dolor sit amet, consectetur sicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
        </div>
      </div>
    )
  }
}
