import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import store from '../../store';
import { AUTHENTICATION } from '../../actions/types';
import { socketConnection } from '../../socketClient';
import PageTitle from '../Title/title';
import './userForm.css';


class SignIn extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			errorMsg: '',
			redirect: false,
			touched: {
				email: false,
				password: false
			}
		};
	}

	/**
	 * send form data to the database on submit if valid
	 */
	onSubmission = (e)=> {
		e.preventDefault();
		
		let formData = {
			email: this.state.email,
			password: this.state.password
		};

		fetch('users/signin', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        	body: JSON.stringify(formData)
		})
		.then(res => {
			
        	if (res.status === 200) {
				
        		return res.json().then(res => {
					// socket connection
					socketConnection(res.userId);
					// socket connection
					const token = res.token;
					const userId = res.userId;
					sessionStorage.setItem('userDetails', userId);
					sessionStorage.setItem('user', token);
					sessionStorage.setItem('userId', this.state.email);
					sessionStorage.setItem('accountType', res.accountType);
					store.dispatch({
						type: AUTHENTICATION,
						user: 'Success',
						userId: this.state.email,
						userDetails: userId,
						accountType: res.accountType
					});
					this.setState({ redirect: true });
				})
        	} else if (res.status === 401 || res.status === 402) {
        		this.setState({ errorMsg: 'Authentication failed: please check email and password.' });
        	} else {
        		this.setState({ errorMsg: ''})
        	}
        }).catch(err => {
        	console.log('React error, signin', err);
        })
	}

	/**
	 * set values to the state with on change event
	 */
	onChange = (e)=> {
		this.setState({ [e.target.name]: e.target.value });
	}

	/**
	 * validate the user input values on front-end
	 */
	validate = (email, password)=> {
		// return true is invalid
		const patt = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		return{
			email: !patt.test(email),
			password: password.length < 6
		};
	}
	
	/**
	 * Blur event: if the user level empty field..
	 */
	handleBlur = (e)=> {
		this.setState({
			touched: {
				...this.state.touched, [e.target.name]: true
			},
		});
	}

	componentDidMount = ()=>{
		this.nameInput.focus(); 
	}
	

	render() {
		
		const errors = this.validate(this.state.email, this.state.password);
		const isDisabled = Object.keys(errors).some(x => errors[x]);

		const shouldMarkError = field => {
			const hasError = errors[field];
			const shouldShow = this.state.touched[field];
			return hasError ? shouldShow : false;
		}

		// if user loged-in, redirect to the profile page..
		if (this.state.redirect || sessionStorage.getItem("user")) {
			return (
				<Redirect to="/profile"  />
			);
		}

		return(
			<div>
				<PageTitle title='Sign in' />
				<div className='signinform'>
					<form className='sign-in-component'>
						<div>
							<input 
								ref={(input) => { this.nameInput = input; }}
								name='email'
								type='text'
								placeholder='Email'
								value={this.state.email}
								onChange={this.onChange}
								onBlur={this.handleBlur}
								className={shouldMarkError('email') ? 'error form-control' : 'form-control'}
							/>
						</div>

						<div>
							<input 
								name='password'
								type='password'
								placeholder='Password'
								value={this.state.password}
								onChange={this.onChange}
								onBlur={this.handleBlur}
								className={shouldMarkError('password') ? 'error form-control' : 'form-control'}
							/>
						</div>

						<div>
							<button
								className='btn btn-primary'
								onClick={this.onSubmission}
								disabled={isDisabled}
							>
								Sign In
							</button>
						</div>
						<p className='errorMsg'>{this.state.errorMsg}</p>
						<div className='userformlink'>
							No account? <Link to={'/signup'}>Create one!</Link>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default SignIn;