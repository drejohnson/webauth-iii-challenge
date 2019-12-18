import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'You shall not pass!' });

  try {
    const verified = jwt.verify(
      token,
      process.env.TOKEN_SECRET || 'this a secret'
    );
    req.token = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid Token' });
  }
};
