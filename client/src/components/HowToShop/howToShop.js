import React, { Component } from 'react';
import PageTitle from '../Title/title';
import HtDis from './howToShopDis';
import './howToShop.css';

class HowToShop extends Component {
    render() {
        return (
            <div className='Ht-page'>
                <PageTitle title='How to shop' />
                <div className='howtoshop'>
                    <div className='htimage ht'></div>
                    <HtDis title='Create your Account' buton='Create your New Account' />
                    <div className='htimage ht'></div>
                    <HtDis title='Browse Our Shop Items' buton='Most Popular Items' />
                    <div className='htimage ht'></div>
                    <HtDis title='Place your Bid' buton='Place bid' />
                </div>
            </div>
        );
    }
}

export default HowToShop;