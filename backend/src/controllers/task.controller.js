import TaskService from '../services/task.service.js';
import { successResponse, errorResponse } from '../Utils/response.js';
import db from '../config/db.js';

const TaskController = {
    async getAll(req, res) {
        try {
          const data = await TaskService.getAllTasks(req.query);
          return successResponse(res, data);
        } catch (err) {
          return errorResponse(res, err.message);
        }
      },

  async getById(req, res) {
    try {
      const data = await TaskService.getTaskById(req.params.id);
      return successResponse(res, data);
    } catch (err) {
      if (err.message === 'TASK_NOT_FOUND') {
        return errorResponse(res, 'Task not found', 404);
      }
      return errorResponse(res, err.message);
    }
  },

  async create(req, res) {
    try {
      const data = await TaskService.createTask(req.body);
      console.log("Created task:", data);
      return successResponse(res, data, 'Task created');
    } catch (err) {
      if (err.message === 'MISSING_REQUIRED_FIELDS') {
        return errorResponse(res, 'Missing required fields', 400);
      }
      if (err.message === 'COLUMN_NOT_FOUND') {
        return errorResponse(res, 'Column not found', 404);
      }
      

      if (err.message === 'CREATOR_NOT_IN_WORKSPACE') {
        return errorResponse(res, 'Creator not in workspace', 400);
      }
      return errorResponse(res, err.message);
    }
  },

  async update(req, res) {
    try {
      const data = await TaskService.updateTask(req.params.id, req.body);
      return successResponse(res, data, 'Task updated');
    } catch (err) {
      if (err.message === 'TASK_NOT_FOUND') {
        return errorResponse(res, 'Task not found', 404);
      }
      if (err.message === 'DEPENDENCY_NOT_COMPLETED') {
        return errorResponse(res, 'Dependency not completed', 400);
      }
      return errorResponse(res, err.message);
    }
  },

  async delete(req, res) {
    try {
      await TaskService.deleteTask(req.params.id, req.body.user_id);
      return successResponse(res, null, 'Deleted successfully');
    } catch (err) {
      if (err.message === 'TASK_NOT_FOUND') {
        return errorResponse(res, 'Task not found', 404);
      }
      if (err.message === 'TASK_HAS_DEPENDENCIES') {
        return errorResponse(res, 'Task has dependencies', 400);
      }
      return errorResponse(res, err.message);
    }
  },
  async reorder(req, res, next) {
  try {
    const taskId = req.params.id;
    const { before_id, after_id } = req.body;

    const data = await TaskService.reorderTask(
      taskId,
      before_id,
      after_id
    );

    return successResponse(res, data, "Reordered");
  } catch (err) {
    next(err);
  }
}
};

export default TaskController;