import TaskRepository from '../models/task.repository.js';
import ActivityRepository from '../models/activity.repository.js';

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
    if (!data.column_id || !data.assignee_id || !data.created_by) {
      throw new Error('MISSING_REQUIRED_FIELDS');
    }
  
    const task = await TaskRepository.create(data);
  
    // 🔥 log activity
    await ActivityRepository.create({
      workspace_id: null, // tạm thời
      user_id: data.created_by,
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
  
    await TaskRepository.delete(id);
  
    await ActivityRepository.create({
      workspace_id: null,
      user_id,
      entity_type: 'TASK',
      entity_id: id,
      action: 'DELETE'
    });
  
    return true;
  }
};

export default TaskService;