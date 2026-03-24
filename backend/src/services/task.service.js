import TaskRepository from '../models/task.repository.js';
import ActivityRepository from '../models/activity.repository.js';
import db from '../config/db.js';

const TaskService = {
    async getAllTasks(query) {
        const result = await TaskRepository.findAll({
          ...query,
          page: Number(query.page) || 1,
          limit: Number(query.limit) || 10
        });
      
        return {
          ...result,
          page: Number(query.page) || 1,
          limit: Number(query.limit) || 10
        };
      },

  async getTaskById(id) {
    const task = await TaskRepository.findById(id);
    if (!task) {
      throw new Error('TASK_NOT_FOUND');
    }
    return task;
  },

  async createTask(data) {
    const { column_id, assignee_id, created_by } = data;
  
    if (!column_id || !assignee_id || !created_by) {
      throw new Error('MISSING_REQUIRED_FIELDS');
    }
  
    // 🔥 1. check column tồn tại + lấy workspace
    const columnResult = await db.query(
      `
      SELECT p.workspace_id
      FROM columns c
      JOIN projects p ON c.project_id = p.id
      WHERE c.id = $1
      `,
      [column_id]
    );
  
    if (!columnResult.rows.length) {
      throw new Error('COLUMN_NOT_FOUND');
    }
  
    const workspace_id = columnResult.rows[0].workspace_id;
  
    // 🔥 2. check assignee thuộc workspace
    const assigneeCheck = await db.query(
      `
      SELECT * FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
      `,
      [workspace_id, assignee_id]
    );
  
    if (!assigneeCheck.rows.length) {
      throw new Error('ASSIGNEE_NOT_IN_WORKSPACE');
    }
  
    // 🔥 3. check created_by thuộc workspace
    const creatorCheck = await db.query(
      `
      SELECT * FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
      `,
      [workspace_id, created_by]
    );
  
    if (!creatorCheck.rows.length) {
      throw new Error('CREATOR_NOT_IN_WORKSPACE');
    }
  
    // 🔥 create task
    const task = await TaskRepository.create(data);
  
    await ActivityRepository.create({
      workspace_id,
      user_id: created_by,
      entity_type: 'TASK',
      entity_id: task.id,
      action: 'CREATE'
    });
  
    return task;
  },

  async updateTask(id, data) {
    const existing = await TaskRepository.findById(id);
    if (!existing) {
      throw new Error('TASK_NOT_FOUND');
    }
  
    // 🔥 nếu đổi column (tức là move task)
    if (data.column_id && data.column_id !== existing.column_id) {
  
      const dependencies = await this.checkDependencies(id);
  
      for (const dep of dependencies) {
  
        const result = await db.query(
          `
          SELECT c.name
          FROM tasks t
          JOIN columns c ON t.column_id = c.id
          WHERE t.id = $1
          `,
          [dep.depends_on_task_id]
        );
  
        // nếu task phụ thuộc chưa ở Done → chặn
        if (result.rows[0]?.name !== 'Done') {
          throw new Error('DEPENDENCY_NOT_COMPLETED');
        }
      }
    }
  
    const updated = await TaskRepository.update(id, data);
  
    await ActivityRepository.create({
      workspace_id: null,
      user_id: data.updated_by || null,
      entity_type: 'TASK',
      entity_id: id,
      action: 'UPDATE'
    });
  
    return updated;
  },

  async deleteTask(id, user_id) {
    const existing = await TaskRepository.findById(id);
    if (!existing) {
      throw new Error('TASK_NOT_FOUND');
    }
  
    // 🔥 CHECK: có task nào phụ thuộc vào task này không
    const dependencyCheck = await db.query(
      `
      SELECT * FROM task_dependencies
      WHERE depends_on_task_id = $1
      `,
      [id]
    );
  
    if (dependencyCheck.rows.length > 0) {
      throw new Error('TASK_HAS_DEPENDENCIES');
    }
  
    await TaskRepository.delete(id);
  
    await ActivityRepository.create({
      workspace_id: null,
      user_id,
      entity_type: 'TASK',
      entity_id: id,
      action: 'DELETE'
    });
  
    return true;
  },

  async checkDependencies(taskId) {
    const result = await db.query(
      `
      SELECT td.depends_on_task_id
      FROM task_dependencies td
      WHERE td.task_id = $1
      `,
      [taskId]
    );
  
    return result.rows;
  }
};

export default TaskService;