const express = require('express');
const userService = require('../services/userService');
const router = express.Router();
// const auth = require('../middleware/auth');
const { authenticateJWT } = require('../middleware/auth');
const jwt = require('jsonwebtoken');


// --------------------
const passport = require('passport');
// const passport = require('../config/passportConfig');


// -----------------------------------------------------------------------------
// Google OAuth login route
router.get('/auth/google', passport.authenticate('google', {
  // how to console log the user info or jwt token
  scope: ['profile', 'email']
}));


router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send the token as part of the response or set it as a cookie
    res.json({ token });
  }
);

// ---------------------------------------------------------------------------------------------
// GET user by ID
router.get('/users/:id', authenticateJWT, async (req, res) => {
  try {
    // console.log(req.user, 'req.user line no 101 Route');
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// POST (create user)
router.post('/users/create', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// PUT (update user)
router.put('/users/:id', async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    const rowsDeleted = await userService.deleteUser(req.params.id);
    if (rowsDeleted === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
