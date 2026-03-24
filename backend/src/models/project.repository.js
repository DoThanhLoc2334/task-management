import db from '../config/db.js';

const ProjectRepository = {

  async create(data) {
    const { name, description, workspace_id } = data;

    const result = await db.query(
      `
      INSERT INTO projects (name, description, workspace_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, description, workspace_id]
    );

    return result.rows[0];
  },

  async findByWorkspace(workspace_id) {
    const result = await db.query(
      `
      SELECT * FROM projects
      WHERE workspace_id = $1
      ORDER BY created_at DESC
      `,
      [workspace_id]
    );

    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      `
      SELECT * FROM projects WHERE id = $1
      `,
      [id]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const { name, description } = data;

    const result = await db.query(
      `
      UPDATE projects
      SET name = $1,
          description = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [name, description, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    await db.query(
      `
      DELETE FROM projects WHERE id = $1
      `,
      [id]
    );
  }
};

export default ProjectRepository;