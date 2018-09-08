import React, { Component } from 'react';
import './title.css';

class Title extends Component {
  render() {
    return (
      <div className='Pages_title cpt'>
        <div className='container'>
          <h2>{this.props.title}</h2>
        </div>
      </div>
    );
  }
}

export default Title;