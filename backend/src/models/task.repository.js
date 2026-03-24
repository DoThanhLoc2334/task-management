import db from '../config/db.js';

const TaskRepository = {
  async findAll() {
    const result = await db.query('SELECT * FROM tasks');
    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  },

  async create(data) {
    const {
      column_id,
      title,
      description,
      assignee_id,
      created_by,
      start_date,
      due_date
    } = data;

    const result = await db.query(
      `INSERT INTO tasks 
      (column_id, title, description, assignee_id, created_by, start_date, due_date)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [column_id, title, description, assignee_id, created_by, start_date, due_date]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const {
      title,
      description,
      assignee_id,
      start_date,
      due_date
    } = data;

    const result = await db.query(
      `UPDATE tasks SET
        title = $1,
        description = $2,
        assignee_id = $3,
        start_date = $4,
        due_date = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *`,
      [title, description, assignee_id, start_date, due_date, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM tasks WHERE id = $1', [id]);
    return true;
  }
};

export default TaskRepository;