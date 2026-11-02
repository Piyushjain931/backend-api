const jwt = require('jsonwebtoken');
const User = require('../models/User');

function makeToken(user) {
  return jwt.sign(
    { tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { subject: user.id, expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

async function registerUser(req, res, next) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required.' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists.' });

    const user = await User.create({ username, email: normalizedEmail, password });
    return res.status(201).json({
      message: 'Account created successfully.',
      user: { id: user.id, username: user.username, email: user.email },
      token: makeToken(user)
    });
  } catch (error) { next(error); }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password are required.' });
    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+password +tokenVersion');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }
    return res.json({
      message: 'Logged in successfully.',
      user: { id: user.id, username: user.username, email: user.email },
      token: makeToken(user)
    });
  } catch (error) { next(error); }
}

async function logoutUser(req, res, next) {
  try {
    req.user.tokenVersion += 1;
    await req.user.save();
    return res.json({ message: 'Logged out successfully. Your current token is no longer valid.' });
  } catch (error) { next(error); }
}

module.exports = { registerUser, loginUser, logoutUser };
