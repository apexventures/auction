import React, { Component } from 'react';
import {Icon} from 'antd';
import './footer.css';

class Footer extends Component {
  render() {
    return (
      <div className="Footer container-fluid">
        <div className='footer-content-area container'>
            <h4><a href='http://www.erudite.pk/'>erudite</a> <Icon type="heart" /></h4>
        </div>
      </div>
    )
  }
}

export default Footer;