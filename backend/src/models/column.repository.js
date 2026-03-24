import db from '../config/db.js';

const ColumnRepository = {

  async create(name, project_id, position) {
    const result = await db.query(
      `
      INSERT INTO columns (name, project_id, position)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, project_id, position]
    );

    return result.rows[0];
  },

  async findByProject(project_id) {
    const result = await db.query(
      `
      SELECT * FROM columns
      WHERE project_id = $1
      ORDER BY position ASC
      `,
      [project_id]
    );

    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      `
      SELECT * FROM columns WHERE id = $1
      `,
      [id]
    );

    return result.rows[0];
  },

  async update(id, name) {
    const result = await db.query(
      `
      UPDATE columns
      SET name = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [name, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    await db.query(
      `
      DELETE FROM columns WHERE id = $1
      `,
      [id]
    );
  },

  async updatePosition(id, position) {
    await db.query(
      `
      UPDATE columns
      SET position = $1
      WHERE id = $2
      `,
      [position, id]
    );
  }
};

export default ColumnRepository;