var express = require('express');
var router = express.Router();
// new imports
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// *** Mongoose User Model
const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String },
	email: { type: String },
	password: { type: String },
	role: { type: String },
	phone: { type: String },
	gender: { type: String },
	creationData: { type: String },
    updateDate: { type: String },
	isActive: { type: Boolean },
	socketId: { type: String },
	accountType: { type: String },
	chatBox: { type: String }
});
const User = mongoose.model('User', userSchema);
module.exports = User;

router.post('/signup', (req, res) => {
	User.find({email: req.body.email}).exec().then( user => {
		if (user.length >= 1) {
			return res.status(409).json({
				message: 'Email already exists'
			})
		} else {
			// Date formate
			var date = new Date();
			date = new Date(date).toUTCString();
			date = date.split(' ').slice(0, 5).join(' ');
			// Date formate

			const user = new User({
				_id: new mongoose.Types.ObjectId(),
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				role: 'member',		//member
				phone: req.body.phone,
				gender: req.body.gender,
				isActive: true,
				creationData: date,
				updateDate: date,
				accountType: req.body.accountType
			});
			user.save().then(result => {
				res.status(201).json({
					message: 'User created',
					user: result
				})
			}).catch(err => {
				res.status(500).json({
					error: err
				});
			});
		}
	});
});


router.post('/signin', (req, res) => {
	User.find({ email: req.body.email }).exec().then( user => {
		if (user.length < 1) {
			return res.status(401).json({
				message: 'Authentication failed: email not found.'
			});
		} else {
			if(user[0].password === req.body.password) {
				if(user[0].isActive === true) {
					const token = jwt.sign(
						{ email: user[0].email, userId: user[0]._id }, 
						'StarBoy',
						{ expiresIn: "1h" }
					);
					return res.status(200).json({
						message: 'Authentication successful.',
						token,
						userId: user[0]._id,
						accountType: user[0].accountType
					});
				} else {
					return res.status(402).json({
						message: 'Authentication failed: password not matched.'
					});
				}
			}

		}
	}).catch(error => {
		res.status(500).json({
			error: error
		});
	});
});


router.post('/profile', (req, res) => {
	jwt.verify(req.body.token, 'StarBoy', (err, decoded) => {
	if (err) {
		return res.status(501).json({
			error: err
		});
	} else {
		User.find({ _id: decoded.userId }).exec().then( user => {
			if (user.length === 1) {
				if (user[0].role === 'admin') {
					User.find({}).select('name email phone gender isActive _id').exec().then(users => {
						res.status(201).json({
							users
						});
					}).catch( usersError => {
						res.status(500).json({
							usersError: usersError
						});
					});
				}	else {
					User.find({ _id: decoded.userId }).select('name email phone gender -_id').exec().then(user => {
						res.status(200).json({
							user: user[0]
						});
					})
				}
			}
		}).catch( error => {
			res.status(500).json({
				error: error
			});
		});
	}

	});
})


router.post('/edituser', (req, res) => {
	User.update({ _id: req.body.id },{ name: req.body.name, email: req.body.email, gender: req.body.gender, phone: req.body.phone, isActive: req.body.isActive, updateDate: new Date() }).exec().then(result => {
		res.status(200).json({
			message: 'User data updated',
			result
		})
	}).catch(error => {
		res.status(500).json({
			editError: error
		})
	});
})


router.post('/edit-socketid', (req, res) =>{
	User.update({ _id: req.body.userId },{ socketId: req.body.socketId }).exec().then(result => {
		res.status(200).json({
			message: 'Socket id updated',
			result
		})
	}).catch(error => {
		res.status(500).json({
			socketIdError: error
		})
	})
})


router.post('/deleteuser', (req, res) => {
	User.deleteOne({ _id: req.body.id }).exec().then(result => {
		res.status(200).json({
			message: 'user deleted',
			result
		})
	})
	.catch(error => {
		res.status(500).json({
			deleteUser: error
		})
	})
})


router.get('/', (req, res) => {
  res.status(200).json({
    router: "Working"
  });
});


router.post('/get-senders-detail', (req, res)=>{
	User.find({ _id: { $in: req.body.userList } }).exec().then(result => {
		res.status(200).json({
			result
		})
	}).catch(error =>{
		res.status(500).json({
			error
		})
	});
})


router.post('/receiver-socket-id', (req, res)=>{
	User.find({_id: req.body.receiverId}).exec().then(result=>{
		res.status(200).json({
			result: result[0]
		})
	}).catch(error=>{
		res.status(500).json({
			error
		})
	});
})


module.exports = router;
