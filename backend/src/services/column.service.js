import ColumnRepository from '../models/column.repository.js';
import db from '../config/db.js';

const ColumnService = {

  async createColumn(data, userId) {
    const { name, project_id } = data;

    if (!name || !project_id) {
      throw new Error('MISSING_FIELDS');
    }

    //check user thuộc workspace qua project
    const check = await db.query(
      `
      SELECT wm.role
      FROM projects p
      JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
      WHERE p.id = $1 AND wm.user_id = $2
      `,
      [project_id, userId]
    );

    if (!check.rows.length) {
      throw new Error('FORBIDDEN');
    }

    // 🔥 position cuối cùng
    const columns = await ColumnRepository.findByProject(project_id);
    const position = columns.length;

    return await ColumnRepository.create(name, project_id, position);
  },

  async getColumns(project_id, userId) {
    const check = await db.query(
      `
      SELECT wm.*
      FROM projects p
      JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
      WHERE p.id = $1 AND wm.user_id = $2
      `,
      [project_id, userId]
    );

    if (!check.rows.length) {
      throw new Error('FORBIDDEN');
    }

    return await ColumnRepository.findByProject(project_id);
  },

  async updateColumn(id, name, userId) {
    const column = await ColumnRepository.findById(id);

    if (!column) {
      throw new Error('COLUMN_NOT_FOUND');
    }

    const check = await db.query(
      `
      SELECT wm.role
      FROM columns c
      JOIN projects p ON c.project_id = p.id
      JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
      WHERE c.id = $1 AND wm.user_id = $2
      `,
      [id, userId]
    );

    if (!check.rows.length) {
      throw new Error('FORBIDDEN');
    }

    return await ColumnRepository.update(id, name);
  },

  async deleteColumn(id, userId) {
    const column = await ColumnRepository.findById(id);

    if (!column) {
      throw new Error('COLUMN_NOT_FOUND');
    }

    const check = await db.query(
      `
      SELECT wm.role
      FROM columns c
      JOIN projects p ON c.project_id = p.id
      JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
      WHERE c.id = $1 AND wm.user_id = $2
      `,
      [id, userId]
    );

    if (!check.rows.length) {
      throw new Error('FORBIDDEN');
    }

    await ColumnRepository.delete(id);
  },

  async reorderColumns(project_id, columns, userId) {
    // check permission
    const check = await db.query(
      `
      SELECT wm.*
      FROM projects p
      JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
      WHERE p.id = $1 AND wm.user_id = $2
      `,
      [project_id, userId]
    );

    if (!check.rows.length) {
      throw new Error('FORBIDDEN');
    }

    // 🔥 update từng column
    for (const col of columns) {
      await ColumnRepository.updatePosition(col.id, col.position);
    }
    const updatedColumns = await ColumnRepository.findByProject(project_id);
    return updatedColumns;
  }
};

export default ColumnService;