import TaskRepository from '../models/task.repository.js';
import ActivityRepository from '../models/activity.repository.js';
import UserRepository from '../models/user.repository.js';
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
  async getTasksByProject(projectId) {
    if (!projectId) {
      throw new Error('PROJECT_ID_REQUIRED');
    }

    const data = await TaskRepository.findByProjectId(projectId);

    return data;
  },
  async getTaskById(id) {
    const task = await TaskRepository.findById(id);
    if (!task) {
      throw new Error('TASK_NOT_FOUND');
    }
    return task;
  },

  async createTask(data) {
    const { column_id, created_by } = data;

    if (!column_id || !created_by) {
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


    // 3. check created_by thuộc workspace
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

    //  create task
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

    //  nếu đổi column (tức là move task)
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

  async updateTaskStatus(taskId, status) {
    const task = await TaskRepository.findById(taskId);
    if (!task) throw new Error("TASK_NOT_FOUND");
    const normalizeStatus = (status || "").trim().toLowerCase();

    const allowed = ['todo', 'doing', 'done'];
    if (!allowed.includes(normalizeStatus)) {
      throw new Error("INVALID_STATUS");
    }

    const updated = await TaskRepository.update(taskId, { status: normalizeStatus });

    return updated;
  },

  async deleteTask(id, user_id) {
    const existing = await TaskRepository.findById(id);
    if (!existing) {
      throw new Error('TASK_NOT_FOUND');
    }

    //  CHECK: có task nào phụ thuộc vào task này không
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

  async assignTask(taskId, assignee_id) {
    const task = await TaskRepository.findById(taskId);
    if (!task) throw new Error("TASK_NOT_FOUND");

    //  normalize
    const normalizedAssigneeId =
      assignee_id && assignee_id !== '' ? assignee_id : null;

    //   check user tồn tại
    if (normalizedAssigneeId) {
      const user = await UserRepository.findById(normalizedAssigneeId);
      if (!user) throw new Error("USER_NOT_FOUND");
    }

    const updated = await TaskRepository.update(taskId, {
      assignee_id: normalizedAssigneeId
    });

    return updated;
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
  },
  async reorderTask(taskId, beforeId, afterId) {
    const task = await TaskRepository.findById(taskId);
    if (!task) throw new Error("Task not found");

    const beforeTask = beforeId
      ? await TaskRepository.findById(beforeId)
      : null;

    const afterTask = afterId
      ? await TaskRepository.findById(afterId)
      : null;

    let newPosition;

    if (!beforeTask && afterTask) {
      newPosition = afterTask.position - 1;
    }
    else if (beforeTask && !afterTask) {
      newPosition = beforeTask.position + 1;
    }
    else if (beforeTask && afterTask) {
      newPosition = (beforeTask.position + afterTask.position) / 2;
    }
    else {
      throw new Error("Invalid reorder input");
    }

    //  CHECK có cần reindex không
    const NEED_REINDEX_THRESHOLD = 0.00001;

    if (
      beforeTask &&
      afterTask &&
      Math.abs(beforeTask.position - afterTask.position) < NEED_REINDEX_THRESHOLD
    ) {
      console.log(" Reindex triggered");

      await TaskRepository.reindex(task.column_id);

      //  lấy lại position sau khi reindex
      const newBefore = await TaskRepository.findById(beforeId);
      const newAfter = await TaskRepository.findById(afterId);

      newPosition = (newBefore.position + newAfter.position) / 2;
    }

    return await TaskRepository.updatePosition(taskId, newPosition);
  },

};

export default TaskService;