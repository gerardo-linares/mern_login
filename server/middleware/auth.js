import jwt from 'jsonwebtoken';
import ENV from '../config.js';

/** auth middleware */
export const Auth = async (req, res, next) => {
  try {
    // access authorize header to validate request
    const token = req.headers.authorization.split(' ')[1];

    // retrieve the user details for the logged in user
    const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication Failed!' });
  }
};

/** Middleware para establecer variables locales */
export default (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};
