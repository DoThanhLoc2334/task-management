import TaskService from '../services/task.service.js';
import { successResponse, errorResponse } from '../Utils/response.js';

const TaskController = {
  async getAll(req, res) {
    try {
      const data = await TaskService.getAllTasks();
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
      return successResponse(res, data, 'Task created');
    } catch (err) {
      if (err.message === 'MISSING_REQUIRED_FIELDS') {
        return errorResponse(res, 'Missing required fields', 400);
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
      return errorResponse(res, err.message);
    }
  },

  async delete(req, res) {
    try {
      await TaskService.deleteTask(req.params.id);
      return successResponse(res, null, 'Deleted successfully');
    } catch (err) {
      if (err.message === 'TASK_NOT_FOUND') {
        return errorResponse(res, 'Task not found', 404);
      }
      return errorResponse(res, err.message);
    }
  }
};

export default TaskController;