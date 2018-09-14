import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Timmer from './timmer';
import PageTitle from '../Title/title';
import './products.css';

class Products extends Component {

  constructor(props) {
    super(props);

    this.state = {
      products: [],
      currentPage: 1,
      PerPage: 8
    };
  }
  
  /**
   * fetch all products from an API
   */
  componentDidMount = ()=> {
    fetch('product')
    .then(res => res.json())
    .then(res => this.setState({ products: res.products }))
    .catch(error => console.log(error));
  }

  handleClick = (event)=> {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  render() {
    const { products, currentPage, PerPage } = this.state;
    // Logic for displaying current todos
    const indexOfLastItem = currentPage * PerPage;
    const indexOfFirstItem = indexOfLastItem - PerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / PerPage); i++) {
      pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li key={number} id={number} onClick={this.handleClick}>
          {number}
        </li>
      );
    });


    return (
      <div>
        <PageTitle title='Products' />
        <div className='container products-container'>
          <div className='products'>
            {
              currentItems.map(product => {
                return(
                  <div key={product._id} className='product col-lg-3 col-md-4 col-sm-6 col-xs-6'>
                    <Link to={`product/${product._id}`}> <img className='product-image' src={`../../public/images/${product.productImg}`} alt={product.productImg} />
                    <h4 className='product-title'> {product.title} </h4> </Link>
                    <p className='product-discription'>{product.discription}</p>
                    <h5 className='product-price'><span>Current bid </span>${product.currentBid}</h5>
                    <p>
                      Time left:
                      <Timmer value={product.bidEndTime} />
                    </p>
                  </div>
                );
              })
            }
          </div>
          <hr />
          <div className='paginate'>
            <ul>
              {renderPageNumbers}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Products;