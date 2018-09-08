import React, { Component } from 'react';
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import store from './store';
import { AUTHENTICATION, ROLE, RECEIVER_ID } from './actions/types';
import {socketConnection} from './socketClient';
import Header from './Header/header';
import Pages from './components/routes';
import Footer from './Footer/footer';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    if(sessionStorage.getItem('userId') !== '') {
      socketConnection(sessionStorage.getItem('userDetails'));
    }
  }

  /**
   * update the redux store if the webpage is reloaded..
   */
  componentWillMount = ()=> {  
    if (sessionStorage.getItem("user")) {
      this.setState({ checkSession: false });
      store.dispatch({
        type: AUTHENTICATION,
        user: 'Success',
        userId: sessionStorage.getItem('userId'),
        userDetails: sessionStorage.getItem('userDetails'),
        accountType: sessionStorage.getItem('accountType')
      })
      store.dispatch({
        type: ROLE,
        role: sessionStorage.getItem('role')
      })
      store.dispatch({
        type: RECEIVER_ID,
        receiverId: sessionStorage.getItem('receiverId')
      })
    } else {
      this.setState({ checkSession: true });
    }
  }

  render() {
    const HeaderComponent = withRouter(props => <Header {...props}/>);

    return(
      <Router>
        <div className='main-page'>
          <HeaderComponent/>
          <Pages/>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;