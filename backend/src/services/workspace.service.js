import WorkspaceRepository from '../models/workspace.repository.js';
import db from '../config/db.js';

const WorkspaceService = {

  async createWorkspace(data, userId) {
    const { name, description } = data;

    if (!name) {
      throw new Error('MISSING_NAME');
    }

    // 🔥 create workspace
    const workspace = await WorkspaceRepository.create(name, description);

    // 🔥 add creator vào workspace_members (role cao nhất)
    await db.query(
      `
      INSERT INTO workspace_members (workspace_id, user_id, role, joined_at)
      VALUES ($1, $2, 'OWNER', NOW())
      `,
      [workspace.id, userId]
    );

    return workspace;
  },

  async getUserWorkspaces(userId) {
    return await WorkspaceRepository.findByUser(userId);
  },

  async getWorkspaceById(id, userId) {
    const workspace = await WorkspaceRepository.findById(id);

    if (!workspace) {
      throw new Error('WORKSPACE_NOT_FOUND');
    }

    // 🔥 check user có thuộc workspace không
    const check = await db.query(
      `
      SELECT * FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
      `,
      [id, userId]
    );

    if (!check.rows.length) {
      throw new Error('FORBIDDEN');
    }

    return workspace;
  }
};

export default WorkspaceService;