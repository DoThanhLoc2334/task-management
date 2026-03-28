import db from '../config/db.js';

const WorkspaceRepository = {
  async create(name, description) {
    const result = await db.query(
      `
      INSERT INTO workspaces (name, description)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name, description]
    );

    return result.rows[0];
  },

  async findByUser(userId) {
    const result = await db.query(
      `
      SELECT w.*
      FROM workspaces w
      JOIN workspace_members wm ON w.id = wm.workspace_id
      WHERE wm.user_id = $1
      `,
      [userId]
    );

    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      `
      SELECT * FROM workspaces WHERE id = $1
      `,
      [id]
    );

    return result.rows[0];
  },
  async getUsersNotInWorkspace(workspaceId) {
    const result = await db.query(
      `
      SELECT u.*
      FROM users u
      LEFT JOIN workspace_members wm 
        ON u.id = wm.user_id 
        AND wm.workspace_id = $1
      WHERE wm.user_id IS NULL
      `,
      [workspaceId]
    );

    return result.rows;
  },
  async getUsersInWorkspace(workspaceId) {
    const result = await db.query(
      `
      SELECT u.id, u.name, u.email, wm.role
      FROM users u
      INNER JOIN workspace_members wm
          ON u.id = wm.user_id
      WHERE wm.workspace_id = $1;
      `,
      [workspaceId]
    );

    return result.rows; 
  }
};

export default WorkspaceRepository;