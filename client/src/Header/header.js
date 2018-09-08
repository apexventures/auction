import React, { Component } from 'react';
import Menu from './menu';
import Bannar from './Bannar';
import './header.css';

class Header extends Component {
    render() {
        var path = this.props.location.pathname.replace('/','')
        if(path === '') { path = 'home'; }

        return (
            <div className={`header ${path}`}>
                <Menu path={path} />
                <Bannar/>
            </div>
        );
    }
}

export default Header;