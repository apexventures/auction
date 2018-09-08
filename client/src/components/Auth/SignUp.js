import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Radio } from 'antd';
import './userForm.css';
import PageTitle from '../Title/title';

const RadioGroup = Radio.Group;

class SignUp extends Component {

	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			name:'',
			gender: '',
			phone: '',
			errorMsg: null,
			redirect: false,
			accountType: 'personal',
			touched: {
				email: false,
				password: false
			},
		};
	}

	/**
	 * set values to the state with on change event
	 */
	onChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	}

	/**
	 * validate the user input values on front-end
	 */
	validate = (name, email, password, phone)=> {
		// return true is invalid
		const patt = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		return{
			name: name.length === 0,
			email: !patt.test(email),
			password: password.length < 6,
			phone: phone.length < 4 || isNaN(phone)
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

	/**
	 * send form data to the database on submit if valid
	 */
	onSubmission = e => {
		e.preventDefault();		

		let formData = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			phone: this.state.phone,
			gender: this.state.gender,
			accountType: this.state.accountType
		};

		fetch('users/signup', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        	body: JSON.stringify(formData)
		})
		.then(res => {
        	if (res.status === 201) {
        		this.setState({ redirect: true });
        	} else if (res.status === 409) {
        		this.setState({ errorMsg: 'Email already exists, please try another.' });
        	}
        }).catch(err => {
        	console.log('React error, signup', err)
        })
	}

	componentDidMount = ()=>{
		this.nameInput.focus(); 
	}

	render() {
		const { name, email, password, phone } = this.state;
		const errors = this.validate(name, email, password, phone);
		const isDisabled = Object.keys(errors).some(x => errors[x]);
		const shouldMarkError = field => {
			const hasError = errors[field];
			const shouldShow = this.state.touched[field];
			return hasError ? shouldShow : false;
		}

		// if user successfully registered, redirect to the sign-in page..
		if (this.state.redirect) {
			return <Redirect to="/signin"  />
		}
		// check if user is loged-in, redirect to the profile page...
		if (sessionStorage.getItem("user")) {
			return <Redirect to="/profile"  />
		}

		return(
			<div>
				<PageTitle title='Sign up' />
				<div className='signupform'>
					<form className='sign-up-component'>
						<h4 className='text-center'>Join our community</h4>

						<div className="accountType">
							<RadioGroup name='accountType' onChange={this.onChange} value={this.state.accountType}>
								<Radio value={'personal'}>Personal account</Radio>
								<Radio value={'business'}>Business account</Radio>
							</RadioGroup>
						</div>

						<div>
							<input
								ref={(input) => { this.nameInput = input; }}
								value={this.state.name}
								onChange={this.onChange}
								onBlur={this.handleBlur}
								type='text'
								name='name'
								placeholder='Name'
								className={shouldMarkError('name') ? 'error form-control' : 'form-control'}
							/>
						</div>

						<div>
							<input
								value={this.state.email}
								onChange={this.onChange}
								onBlur={this.handleBlur}
								type='text'
								name='email'
								placeholder='Email'
								className={shouldMarkError('email') ? 'error form-control' : 'form-control'}
							/>
						</div>

						<div>
							<input
								value={this.state.password}
								onChange={this.onChange}
								onBlur={this.handleBlur}
								type='password'
								name='password'
								placeholder='Password'
								className={shouldMarkError('password') ? 'error form-control' : 'form-control'}
							/>
						</div>

						<div>
							<input
								value={this.state.phone}
								onChange={this.onChange}
								onBlur={this.handleBlur}
								type='text'
								name='phone'
								placeholder='Phone Number'
								className={shouldMarkError('phone') ? 'error form-control' : 'form-control'}
							/>
						</div>

						<div>
							<select value={this.state.gender} onChange={this.onChange} name='gender'>
								<option default>Gender (Optional)</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</select>
						</div>
						
						<div>
							<button
								onClick={this.onSubmission}
								className='btn btn-primary'
								disabled={isDisabled}
							>
							Register
							</button>
						</div>
						<p className='errorMsg'>{this.state.errorMsg}</p>
						<div className='userformlink'>
							already have account? <Link to={'/signin'}>Sign In</Link>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default SignUp;

