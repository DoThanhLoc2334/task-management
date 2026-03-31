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
      where.push(`t.title ILIKE $${values.length}`);
    }

    // filter column
    if (column_id) {
      values.push(column_id);
      where.push(`t.column_id = $${values.length}`);
    }

    // filter assignee
    if (assignee_id) {
      values.push(assignee_id);
      where.push(`t.assignee_id = $${values.length}`);
    }

    // filter start_date
    if (start_date) {
      values.push(start_date);
      where.push(`t.start_date >= $${values.length}`);
    }

    // filter due_date
    if (due_date) {
      values.push(due_date);
      where.push(`t.due_date <= $${values.length}`);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // safe sort
    const allowedSortFields = [
      'created_at',
      'updated_at',
      'start_date',
      'due_date',
      'title'
    ];

    const safeSortBy = allowedSortFields.includes(sort_by)
      ? `t.${sort_by}`
      : 't.created_at';

    const safeOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // 👉 MAIN QUERY
    const dataQuery = `
    SELECT 
      t.id,
      t.title,
      t.description,
      t.start_date,
      t.due_date,

      -- assignee
      u.id AS assignee_id,
      u.name AS assignee_name,
      u.email AS assignee_email,

      -- labels
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', l.id,
            'name', l.name
          )
        ) FILTER (WHERE l.id IS NOT NULL),
        '[]'
      ) AS labels,

      -- attachments
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', a.id,
            'file_url', a.file_url
          )
        ) FILTER (WHERE a.id IS NOT NULL),
        '[]'
      ) AS attachments

    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    LEFT JOIN task_labels tl ON tl.task_id = t.id
    LEFT JOIN labels l ON l.id = tl.label_id
    LEFT JOIN attachments a ON a.task_id = t.id

    ${whereClause}

    GROUP BY t.id, u.id

    ORDER BY ${safeSortBy} ${safeOrder}

    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

    values.push(limit, offset);

    const dataResult = await db.query(dataQuery, values);

    // 👉 COUNT QUERY (KHÔNG JOIN để tối ưu)
    const countQuery = `
    SELECT COUNT(*) FROM tasks t
    ${whereClause}
  `;

    const countResult = await db.query(
      countQuery,
      values.slice(0, values.length - 2)
    );

    // 👉 FORMAT DATA
    const formattedData = dataResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      start_date: row.start_date,
      due_date: row.due_date,

      assignee: row.assignee_id
        ? {
          id: row.assignee_id,
          name: row.assignee_name,
          email: row.assignee_email
        }
        : null,

      labels: row.labels || [],
      attachments: row.attachments || []
    }));

    return {
      data: formattedData,
      total: parseInt(countResult.rows[0].count)
    };
  },

  async findById(id) {
    const result = await db.query(
      `
    SELECT 
      t.id,
      t.title,
      t.description,
      t.start_date,
      t.due_date,

      -- assignee
      u.id AS assignee_id,
      u.name AS assignee_name,
      u.email AS assignee_email,

      -- labels (array json)
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', l.id,
            'name', l.name
          )
        ) FILTER (WHERE l.id IS NOT NULL),
        '[]'
      ) AS labels,

      -- attachments (array json)
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', a.id,
            'file_url', a.file_url
          )
        ) FILTER (WHERE a.id IS NOT NULL),
        '[]'
      ) AS attachments

    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    LEFT JOIN task_labels tl ON tl.task_id = t.id
    LEFT JOIN labels l ON l.id = tl.label_id
    LEFT JOIN attachments a ON a.task_id = t.id

    WHERE t.id = $1
    GROUP BY t.id, u.id
    `,
      [id]
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      start_date: row.start_date,
      due_date: row.due_date,

      assignee: row.assignee_id
        ? {
          id: row.assignee_id,
          name: row.assignee_name,
          email: row.assignee_email
        }
        : null,

      labels: row.labels || [],
      attachments: row.attachments || []
    };
  },

  async findByProjectId(projectId) {
  const result = await db.query(
    `
    SELECT 
      t.id,
      t.title,
      t.description,
      t.start_date,
      t.due_date,
      t.position,

      c.id AS column_id,
      c.name AS column_name,

      u.id AS assignee_id,
      u.name AS assignee_name,
      u.email AS assignee_email

    FROM tasks t
    JOIN columns c ON t.column_id = c.id
    JOIN projects p ON c.project_id = p.id
    LEFT JOIN users u ON t.assignee_id = u.id

    WHERE p.id = $1

    ORDER BY c.id, t.position ASC
    `,
    [projectId]
  );

  // 🔥 GROUP LOGIC ở đây
  const columnsMap = {};

  for (const row of result.rows) {
    if (!columnsMap[row.column_id]) {
      columnsMap[row.column_id] = {
        column_id: row.column_id,
        column_name: row.column_name,
        tasks: []
      };
    }

    columnsMap[row.column_id].tasks.push({
      id: row.id,
      title: row.title,
      description: row.description,
      start_date: row.start_date,
      due_date: row.due_date,
      position: row.position,
      assignee: row.assignee_id
        ? {
            id: row.assignee_id,
            name: row.assignee_name,
            email: row.assignee_email
          }
        : null
    });
  }

  return Object.values(columnsMap);
},
  async create(data) {
    const {
      column_id,
      title,
      description,
     
      created_by,
      start_date,
      due_date
    } = data;

    // 🔥 lấy position tiếp theo
    const posResult = await db.query(
      `SELECT COALESCE(MAX(position), -1) + 1 AS new_position
      FROM tasks
      WHERE column_id = $1`,
      [column_id]
    );

    const position = posResult.rows[0].new_position;

    const result = await db.query(
      `INSERT INTO tasks 
      (column_id, title, description,  created_by, start_date, due_date, position)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [column_id, title, description, created_by, start_date, due_date, position]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const {
      title,
      description,
      assignee_id,
      start_date,
      due_date,
      position,
      column_id
    } = data;

    const result = await db.query(
      `UPDATE tasks SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      assignee_id = COALESCE($3, assignee_id),
      start_date = COALESCE($4, start_date),
      due_date = COALESCE($5, due_date),
      position = COALESCE($6, position),
      column_id = COALESCE($7, column_id),
      updated_at = NOW()
    WHERE id = $8
    RETURNING *`,
      [title, description, assignee_id, start_date, due_date, position, column_id, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM tasks WHERE id = $1', [id]);
    return true;
  },
  async updatePosition(taskId, position) {
    const result = await db.query(
      `
      UPDATE tasks
      SET position = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [position, taskId]
    );

    return result.rows[0];
  },
  // async reindex(columnId) {
  //   await db.query(
  //     `
  //     UPDATE tasks
  //     SET position = sub.new_pos
  //     FROM (
  //       SELECT id,
  //             ROW_NUMBER() OVER (ORDER BY position, created_at) AS new_pos
  //       FROM tasks
  //       WHERE column_id = $1
  //     ) sub
  //     WHERE tasks.id = sub.id
  //     AND tasks.column_id = $1;
  //     `,
  //     [columnId]
  //   );
  // }
  async reindex(columnId) {
    await db.query(
      `
      UPDATE tasks
      SET position = sub.new_pos
      FROM (
        SELECT id,
              ROW_NUMBER() OVER (ORDER BY position, created_at) * 1000 AS new_pos
        FROM tasks
        WHERE column_id = $1
      ) sub
      WHERE tasks.id = sub.id
      AND tasks.column_id = $1;
      `,
      [columnId]
    );
  }
};

export default TaskRepository;  