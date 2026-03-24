import db from '../config/db.js';

const ActivityRepository = {
  async create(data) {
    const {
      workspace_id,
      user_id,
      entity_type,
      entity_id,
      action
    } = data;

    const result = await db.query(
      `INSERT INTO activity_logs 
      (workspace_id, user_id, entity_type, entity_id, action)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [workspace_id, user_id, entity_type, entity_id, action]
    );

    return result.rows[0];
  }
};

export default ActivityRepository;