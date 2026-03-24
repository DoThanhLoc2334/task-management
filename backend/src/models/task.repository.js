import db from '../config/db.js';

const TaskRepository = {
    async findAll(query) {
        const {
          search,
          page = 1,
          limit = 10,
          column_id,
          assignee_id,
          start_date,
          due_date,
          sort_by = 'created_at',
          order = 'desc'
        } = query;
      
        const offset = (page - 1) * limit;
      
        let where = [];
        let values = [];
      
        // search
        if (search) {
          values.push(`%${search}%`);
          where.push(`title ILIKE $${values.length}`);
        }
      
        // filter column
        if (column_id) {
          values.push(column_id);
          where.push(`column_id = $${values.length}`);
        }
      
        // filter assignee
        if (assignee_id) {
          values.push(assignee_id);
          where.push(`assignee_id = $${values.length}`);
        }
      
        // filter start_date
        if (start_date) {
          values.push(start_date);
          where.push(`start_date >= $${values.length}`);
        }
      
        // filter due_date
        if (due_date) {
          values.push(due_date);
          where.push(`due_date <= $${values.length}`);
        }
      
        const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
      
        // ⚠️ validate sort để tránh SQL injection
        const allowedSortFields = [
          'created_at',
          'updated_at',
          'start_date',
          'due_date',
          'title'
        ];
      
        const safeSortBy = allowedSortFields.includes(sort_by)
          ? sort_by
          : 'created_at';
      
        const safeOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
      
        const dataQuery = `
          SELECT * FROM tasks
          ${whereClause}
          ORDER BY ${safeSortBy} ${safeOrder}
          LIMIT $${values.length + 1}
          OFFSET $${values.length + 2}
        `;
      
        values.push(limit, offset);
      
        const dataResult = await db.query(dataQuery, values);
      
        const countQuery = `
          SELECT COUNT(*) FROM tasks
          ${whereClause}
        `;
      
        const countResult = await db.query(
          countQuery,
          values.slice(0, values.length - 2)
        );
      
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