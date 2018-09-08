import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { Avatar } from 'antd';
import store from '../store';
import { AUTHENTICATION, ROLE } from '../actions/types';

class Menu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sticky : 'normal'
        }
    }
    
    /**
    * User logout if loged in..
    */
    logout = ()=> {
        sessionStorage.setItem('user', '');
        sessionStorage.setItem('userId', '');
        sessionStorage.setItem('role', '');
        sessionStorage.setItem('userId', '');
        sessionStorage.setItem('accountType','');
        sessionStorage.setItem('userDetails','');
        sessionStorage.clear();
        store.dispatch({
          type: AUTHENTICATION,
          user: 'empty',
          userId: '',
          userDetails: '',
          accountType: ''
        })
        store.dispatch({
          type: ROLE,
          role: ''
        })
        this.setState({ 
          checkSession: true
        });
    }

    componentDidMount =()=> {
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount =()=> {
        window.removeEventListener('scroll', this.handleScroll);
    }
    handleScroll =()=> {
        if (window.scrollY < 65) {
            this.setState({sticky:'normal'})
        }
        else {
            this.setState({sticky:'sticky'})
        }
    }

    render() {
        var profileLinkName;
        if(this.props.roleRedux === 'admin') { profileLinkName = 'Manage Users' } 
        else { profileLinkName = 'Profile' }

        return (
            <Navbar collapseOnSelect className={`${this.state.sticky}`}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Auction</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>

                <Navbar.Collapse>
                    <Nav pullRight activeKey={this.props.path}>
                        {
                            this.props.accountTypeRedux === 'business' ?
                            <NavItem eventKey={'product-history'} componentClass={Link} href="/product-history" to="/product-history">
                                Manage Products
                            </NavItem> 
                            : null    
                        }
                        {
                            this.props.checkSessionRedux === 'Success' ?
                            <NavItem eventKey={'user-bids'} componentClass={Link} href="/user-bids" to="/user-bids">
                                Bid History
                            </NavItem> 
                            : null
                        }
                        <NavItem eventKey={'products'} componentClass={Link} href="/products" to="/products">
                            Products
                        </NavItem>
                        <NavItem eventKey={'how-to-shop'} componentClass={Link} href="/how-to-shop" to="/how-to-shop">
                            How to shop
                        </NavItem>
                        { this.props.checkSessionRedux !== 'Success' ?
                            (
                            <NavDropdown title={<Avatar size="small" >USER</Avatar>} id="basic-nav-dropdown">
                                <MenuItem componentClass={Link} href="/signup" to="/signup">
                                    Sign Up
                                </MenuItem>
                                <MenuItem componentClass={Link} href="/signin" to="/signin">
                                    Sign In
                                </MenuItem>
                            </NavDropdown>
                            ) : (
                            <NavDropdown title={<Avatar className='active' size="small">USER</Avatar>}  id="basic-nav-dropdown">
                                <MenuItem componentClass={Link} href="/profile" to="/profile">
                                    {profileLinkName}
                                </MenuItem>
                                <MenuItem componentClass={Link} href="/signin" to="/signin" onClick={this.logout}>
                                    Logout
                                </MenuItem>
                            </NavDropdown>
                            )
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}


const mapStateToProps = state => ({
    userId: state.authentication.userDetails,
    checkSessionRedux: state.authentication.user,
    accountTypeRedux: state.authentication.accountType,
    roleRedux: state.authentication.role
});
  
export default connect(mapStateToProps)(Menu);