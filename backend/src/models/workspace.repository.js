import db from '../config/db.js';

const WorkspaceRepository = {
  async getUserRole(workspace_id, user_id) {
    const result = await db.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2`,
      [workspace_id, user_id]
    );

    return result.rows[0]; // undefined nếu không có
  }
};

export default WorkspaceRepository;