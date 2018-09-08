import React, { Component } from 'react';
import { DatePicker } from 'antd';
import { Redirect } from 'react-router-dom';
import store from '../../../store';
import './addItems.css';
import PageTitle from '../../Title/title';


class AddItems extends Component {

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      discription: '',
      price: '',
      bidEndTime: '',
      productImg: ''
    };
  }

  /**
	 * set values to the state with on change event
	 */
  onChangeEvent = (e)=> {
    this.setState({ [e.target.name]: e.target.value });
  }

  /**
   * DatePicker event for onChange
   */
  dateChangeHandle = (x, y)=> {
    this.setState({ bidEndTime: y });
  }

  /**
   * Send date to the database onSubmit handler..
   */
  onSubmittion = (e)=> {
    e.preventDefault();

    const data = new FormData()
    data.append('file', this.productImg.files[0]);
    data.append('fileName', this.productImg.files[0].name);
    data.append('title', this.state.title);
    data.append('discription', this.state.discription);
    data.append('price', this.state.price);
    data.append('bidEndTime', this.state.bidEndTime);
    data.append('userId', store.getState().authentication.userDetails);

    fetch('product/add', {
      method: 'POST',
      body: data
    })
    .then(res => {
      if(res.status === 200) {
        this.setState({ title: '', discription: '', price: '', productImg: '', bidEndTime: '' });
      }
    })
    .catch(err => console.log(err));
  }

    
  render() {
    // check if user not sigin-in, redirect to the 'Home page'..
    const auth = store.getState().authentication.user;
    const accountType = store.getState().authentication.accountType;
    if (auth !== 'Success' || accountType !== 'business') {
      return (
				<Redirect to="/" />
			);
    }
    
    return (
      <div className='add-product'>
        <PageTitle title='Add Product' />
        <div className='container'>
          <form className='add-item-component'>
              <div>
                  <label>Product Title</label>
                  <input
                    name='title'
                    type='text'
                    value={this.state.title}
                    onChange={this.onChangeEvent}
                  />
              </div>
              <div>
                  <label>Product Description</label>
                  <textarea
                    className='textareaField'
                    name='discription'
                    value={this.state.discription}
                    onChange={this.onChangeEvent}
                  />
              </div>
              <div>
                  <label>Starting Price</label>
                  <input
                    name='price'
                    value={this.state.price}
                    onChange={this.onChangeEvent}
                  />
              </div>
              <div className='bidtime'>
                <label>Bid end time</label>
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Select Time"
                  onChange={this.dateChangeHandle}
                />
              </div>
              <div className='imageInput'>
                <label>Product Image</label>
                <input
                  type='file'
                  name='productImg'
                  value={this.state.productImg}
                  onChange={this.onChangeEvent}
                  ref={productImg => this.productImg = productImg }
                />
              </div>
              <button onClick={this.onSubmittion}>Save</button>
          </form>
        </div>
      </div>
    )
  }
}

export default AddItems;