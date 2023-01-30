import { app } from '../config/app.config.js';
import { logger } from '../config/logger/index.js';
import { serviceRegisterUsers } from '../factory/factoryDaos.js';
import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';
import url from 'url';
const URL =
	process.env.NODE_ENV === 'production'
		? `${env.APP_HOST_RAILWAY}`
		: `http://localhost:${app.get('port')}`;

const getAdminProfile = (req, res) => {
	logger.info(`accessing the route: ${req.baseUrl}`);
	let token = req.cookies['token'];
	//const authHeader = req.headers['authorization'];
	//const token = authHeader && authHeader.split(' ')[1];
	if (token === null) res.render('main', { layout: 'login' });
	jwt.verify(token, env.JWT_SECRET, (err, token) => {
		if (err) res.render('main', { layout: 'login' });
		if (token) res.render('main', { layout: 'index' });
	});
};

const getUserProfile = async (req, res) => {
	logger.info(`accessing the route: ${req.baseUrl}`);
	const username = req.params.username;
	const user = await serviceRegisterUsers.getUserByUsername(username);
	const { avatar } = user;
	let urlAvatar = new url.URL(avatar);
	const userData = {
		username: username,
		avatar: urlAvatar.pathname,
	};
	const token = req.cookies['token'];
	// const authHeader = req.headers['authorization'];
	// const token = authHeader && authHeader.split(' ')[1];
	if (token === null) res.render('main', { layout: 'login' });
	jwt.verify(token, env.JWT_SECRET, (err, token) => {
		if (err) res.render('main', { layout: 'login' });
		if (token) res.render('main', { layout: 'users', userData });
	});
};

const auth = (req, res) => {
	logger.info(`accessing the route: ${req.baseUrl}`);
	const { role, username } = req.body;
	if (role === 'admin') {
		const token = jwt.sign({ user: req.body }, env.JWT_SECRET, { expiresIn: env.JWT_EXP_TIME });
		res.cookie('token', token, { maxAge: 20 * 6000 });
		res.redirect(`${URL}/api/v1/profile/admin`);
		//res.json({ token, role });
	}
	if (role === 'user') {
		const token = jwt.sign({ user: req.body }, env.JWT_SECRET, { expiresIn: env.JWT_EXP_TIME });
		res.cookie('token', token, { maxAge: 20 * 60000 });
		res.redirect(`${URL}/api/v1/profile/user/${username}`);
		//res.json({ token, role, username });
	}
};

const logout = (req, res) => {
	logger.info(`accessing the route: ${req.baseUrl}`);
	req.logout((err) => {
		if (err) {
			logger.error(err);
			next(err);
		}
		res.clearCookie('token');
		res.redirect(`${URL}`);
	});
};

export { getAdminProfile, getUserProfile, auth, logout };
