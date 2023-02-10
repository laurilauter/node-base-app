import { User } from '../db/dbConnection.js';
import bcrypt from 'bcryptjs';

export async function createUser(req, res, next) {
	try {
		const { email, password, role } = req.body;
		const re = /\S+@\S+\.\S+/;
		if (re.test(email) && password.length > 4) {
			const user = await User.findOne({ email: email });
			if (!user) {
				let createUser = new User({
					email: email,
					password: bcrypt.hashSync(password, 10),
					role: role
				});
				await User.create(createUser);
				//send to login
				res.status(201).send({ message: 'User created' });
			} else {
				res.status(403).send({ error: 'User already exists' });
				//send to login
			}
		} else {
			res.status(406).send({ error: 'Email or password not acceptable' });
		}
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

//:TODO
//user patch self (user)
//user patch any (admin)

//delete self (user)
//delete any (admin)

//FIND TEST ENDPOINTS BELOW - > REMOVE LATER
export async function publicdataUser(req, res, next) {
	try {
		console.log('PD req.session.cookie ', req.session.cookie);
		console.log('PD req.sessionID ', req.sessionID);
		console.log('PD req.session.user ', req.session.user);

		const message = {
			alert: 'Public data',
			data: 'This is PUBLIC data visible without logging in',
			userId: req.session.userId
		};
		console.log('public data accessed');
		res.status(200).send({ message: message });
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

export async function userdataUser(req, res, next) {
	try {
		console.log('UD req.session.cookie ', req.session.cookie);
		console.log('UD req.sessionID ', req.sessionID);
		console.log('UD req.session.user ', req.session.user);

		const message = {
			alert: 'User data',
			data: 'This is USER data, available only to role: user',
			userId: req.session.userId
		};
		console.log('user data accessed');
		res.status(200).send({ message: message });
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

export async function admindataUser(req, res, next) {
	try {
		console.log('AD req.session.cookie ', req.session.cookie);
		console.log('AD req.sessionID ', req.sessionID);
		console.log('AD req.session.user ', req.session.user);

		const message = {
			alert: 'Admin data',
			data: 'This is ADMIN data, available only to role: admin',
			userId: req.session.userId
		};
		console.log('admin data accessed');
		res.status(200).send({ message: message });
	} catch (error) {
		res.status(500).send({ error: error });
	}
}
