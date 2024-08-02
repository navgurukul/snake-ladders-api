// ----------------------------------------------------
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Knex = require('knex');
const { Model } = require('objection');
const knexConfig = require('./knexfile');
const userRoutes = require('./routes/userRoutes');
const room = require('./routes/room');
const User = require('./models/user');
require('dotenv').config();

const PORT = process.env.PORT;
// Initialize knex connection.
const knex = Knex(knexConfig.development);
Model.knex(knex);

// Create Express app
const app = express();

// Set up session management
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Middleware to check JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token is not valid' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authentication token is required' });
  }
};


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


// Configure Passport to use Google OAuth 2.0 strategy

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.query().findOne({ googleId: profile.id });
    if (!user) {
      user = await User.query().insert({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  const user = await User.query().findById(id);
  done(null, user);
});

// Use routes
app.use('/api', userRoutes);
// use roomRoutes
// app.use('/api', roomRoutes);
app.use('/api/room', room);

// Start server
app.listen(PORT, () => {
  console.log( `Server started at http://localhost:${PORT}`);
});
