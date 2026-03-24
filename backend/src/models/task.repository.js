import db from '../config/db.js';

const TaskRepository = {
    async findAll({ search, page = 1, limit = 10, column_id }) {
        const offset = (page - 1) * limit;
      
        let where = [];
        let values = [];
      
        // search theo title
        if (search) {
          values.push(`%${search}%`);
          where.push(`title ILIKE $${values.length}`);
        }
      
        // filter theo column
        if (column_id) {
          values.push(column_id);
          where.push(`column_id = $${values.length}`);
        }
      
        const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
      
        // query data
        const dataQuery = `
          SELECT * FROM tasks
          ${whereClause}
          ORDER BY created_at DESC
          LIMIT $${values.length + 1}
          OFFSET $${values.length + 2}
        `;
      
        values.push(limit, offset);
      
        const dataResult = await db.query(dataQuery, values);
      
        // query total
        const countQuery = `
          SELECT COUNT(*) FROM tasks
          ${whereClause}
        `;
      
        const countResult = await db.query(countQuery, values.slice(0, values.length - 2));
      
        return {
          data: dataResult.rows,
          total: parseInt(countResult.rows[0].count)
        };
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