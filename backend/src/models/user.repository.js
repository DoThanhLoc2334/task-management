import db from '../config/db.js';

const UserRepository = {
  async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  async create({ email, name, password_hash }) {
    const result = await db.query(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [email, name, password_hash]
    );

    return result.rows[0];
  },
  async findAll() {
    const result = await db.query(
      `SELECT id, email, name FROM users`
    );
    return result.rows;
  },
  async findById(id) {
    const result = await db.query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
};

export default UserRepository;