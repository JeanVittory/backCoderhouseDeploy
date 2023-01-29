import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';

const isAuthUser = (req, res, next) => {
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
  const token = req.cookies['token'];
  if (token === undefined) return res.render('main', { layout: 'login' });
  return jwt.verify(token, env.JWT_SECRET, (err, token) => {
    if (token.user.role === 'admin') return res.render('main', { layout: 'login' });
    if (err) return res.render('main', { layout: 'login' });
    return next();
  });
};

const isAuth = (req, res, next) => {
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
  const token = req.cookies['token'];
  console.log(token);
  if (token === undefined) return res.render('main', { layout: 'login' });
  return jwt.verify(token, env.JWT_SECRET, (err, token) => {
    if (err) return res.render('main', { layout: 'login' });
    return next();
  });
};

const isAuthAdmin = (req, res, next) => {
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
  const token = req.cookies['token'];
  if (token === undefined) return res.render('main', { layout: 'login' });
  return jwt.verify(token, env.JWT_SECRET, (err, token) => {
    if (token.user.role === 'user') return res.render('main', { layout: 'login' });
    if (err) return res.render('main', { layout: 'login' });
    return next();
  });
};

export { isAuthUser, isAuth, isAuthAdmin };
