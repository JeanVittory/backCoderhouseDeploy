import passport from 'passport';
import { Strategy } from 'passport-local';
import { ServiceUsers } from '../services/users.services.js';
import { ServiceAdmin } from '../services/admin.services.js';
import { matchPasswords } from '../tools/bcrypt.tools.js';
import { Strategy as JWTStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import env from './env.config.js';

passport.use(
  'login',
  new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const { role } = req.body;

        if (role !== 'admin' && role !== 'user') {
          done(null, false, { message: 'Something went wrong' });
        }

        if (role !== 'admin') {
          const user = await ServiceUsers.userExist(username);
          if (!user) {
            return done(null, false, { message: 'The user not exist, please try again' });
          }
          const pwdEncrypt = await ServiceUsers.getPassword(username);
          const isMatchingPwd = await matchPasswords(password, pwdEncrypt.password);
          if (!isMatchingPwd) {
            return done(null, false, { message: 'invalid password' });
          }

          done(null, user);
        } else {
          const admin = await ServiceAdmin.userExist(username);
          if (!admin) {
            return done(null, false, { message: 'The admin not exist, please try again' });
          }
          const pwdEncrypt = await ServiceAdmin.getPassword(username);
          const isMatchingPwd = await matchPasswords(password, pwdEncrypt.password);
          if (!isMatchingPwd) {
            return done(null, false, { message: 'invalid password' });
          }
          done(null, admin);
        }
      } catch (error) {
        return error;
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user.role });
});

passport.deserializeUser(async (userData, done) => {
  const { id, role } = userData;

  if (role === 'user') {
    const user = await ServiceUsers.getUserById(id);
    if (!user) {
      done(err);
    }
    done(null, user);
  }
  if (role === 'admin') {
    const user = await ServiceAdmin.getUserById(id);
    if (!user) {
      done(err);
    }
    done(null, user);
  }
});

passport.use(
  new JWTStrategy(
    {
      secretOrKey: env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    },
    async (token, done) => {
      try {
        return done(null, token);
      } catch (error) {
        done(error);
      }
    }
  )
);
