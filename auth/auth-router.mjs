import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserModel from '../users/user-model.mjs';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, department, password } = req.body;

  try {
    // hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.add({
      username,
      department,
      password: hashedPassword
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login
router.post('/login', async (req, res) => {
  let { username, password } = req.body;

  try {
    const user = await UserModel.findBy({ username }).first();
    const validPassword = await bcrypt.compare(password, user.password);
    if (user && validPassword) {
      const token = signToken(user);
      res
        .header('authorization', token)
        .status(200)
        .json({
          token,
          message: `Welcome ${user.username}!`
        });
    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({
          message:
            'you can checkout any time you like, but you can never leave!!!!!'
        });
      } else {
        res.status(200).json({ message: 'logged out' });
      }
    });
  } else {
    res.status(200).end();
  }
});

function signToken(user) {
  const payload = {
    username: user.username
  };

  const secret = process.env.JWT_SECRET || 'this a secret';

  const options = {
    expiresIn: '1h'
  };

  return jwt.sign(payload, secret, options);
}

export default router;
