import db from '../database/db-config.js';

const findUser = () => {
  return db('users').select('id', 'username', 'department');
};

const findById = id => {
  return db('users')
    .select('id', 'username', 'department')
    .where({ id })
    .first();
};

const findBy = filter => {
  return db('users')
    .select('id', 'username', 'department', 'password')
    .where(filter);
};

const add = async user => {
  const ids = await db('users').insert(user);
  const [id] = ids;
  return findById(id);
};

export default { findUser, findById, findBy, add };
