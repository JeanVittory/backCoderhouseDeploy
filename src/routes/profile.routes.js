import { Router } from 'express';
import passport from 'passport';
import {
  auth,
  getAdminProfile,
  getUserProfile,
  logout,
} from '../controllers/profile.controller.js';

const routerProfile = Router();

routerProfile.post('/', passport.authenticate('login'), auth);
routerProfile.get('/admin', getAdminProfile);
routerProfile.get('/user/:username', getUserProfile);
routerProfile.post('/logout', logout);

export { routerProfile };
