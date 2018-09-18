import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// components
import AdminProfile from './adminProfile';
import Profile from './profile';
// Redux
import store from '../../../store';
import { AUTHENTICATION, ROLE } from '../../../actions/types';
import { connect } from 'react-redux';

class UserProfile extends Component {

	constructor(props) {
		super(props);

		this.state = {
			redirect: false,
			user: {},
			users: []
		};
	}

	/**
	 * if user successfully loged-in, load the profile data according to the user role..
	 */
	profileDataLoad = ()=> {
		if (sessionStorage.getItem("user")) {
			const loggedInUser = sessionStorage.getItem('user');
			let formData = {
				token: loggedInUser
			};
			fetch('users/profile', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
				body: JSON.stringify(formData)
			})
			.then(res => {
        	if (res.status === 200) {
        		return res.json().then( res => {
        			this.setState({ user: res.user });
        		});
        	} else if (res.status === 201) {
				sessionStorage.setItem('role', 'admin');
				store.dispatch({
					type: ROLE,
					role: 'admin'
				})
        		return res.json().then( res => {
					const users = res.users;
					this.setState({ users });
        		});
        	} else if (res.status === 501){
				sessionStorage.setItem('user', '');
    			sessionStorage.clear();
				store.dispatch({
					type: AUTHENTICATION,
					user: 'empty',
					userId: '',
					role: ''
				});
			}
        	}).catch(err => {
        		console.log('React error, profile', err);
        	});
		} else {
			this.setState({ redirect: true });
		}
	}

	/**
	 * calling the 'profileDataLoad' method..
	 */
	componentWillMount = ()=> {
		this.profileDataLoad();
	}

	/**
	 * Profile data reload if 'admin' Edit or Delete users
	 */
	profileLoad = ()=> {
		this.profileDataLoad();
	}

	render() {
		let { users, user, redirect } = this.state;

		// check if user log-out, redirect to sign-in page..
		if (redirect || this.props.userRedux !== 'Success') {
			return <Redirect to="/signin"  />
		}
		
		return(
			<div className='profile'>
				
				{ Object.getOwnPropertyNames(user).length !== 0 ? <Profile user={user} profileLoad={this.profileLoad} /> : null }

				{ users.length !== 0 ? <AdminProfile users={users} profileLoad={this.profileLoad} /> : null }

			</div>
		);
	}
}

const mapStateToProps = state => ({
	userRedux: state.authentication.user
});
  
export default connect(mapStateToProps)(UserProfile);