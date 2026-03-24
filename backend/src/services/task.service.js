import TaskRepository from '../models/task.repository.js';


const TaskService = {
  async getAllTasks() {
    return await TaskRepository.findAll();
  },

  async getTaskById(id) {
    const task = await TaskRepository.findById(id);
    if (!task) {
      throw new Error('TASK_NOT_FOUND');
    }
    return task;
  },

  async createTask(data) {
    // validate tối thiểu
    if (!data.column_id || !data.assignee_id || !data.created_by) {
      throw new Error('MISSING_REQUIRED_FIELDS');
    }
    return await TaskRepository.create(data);
  },

  async updateTask(id, data) {
    const existing = await TaskRepository.findById(id);
    if (!existing) {
      throw new Error('TASK_NOT_FOUND');
    }
    return await TaskRepository.update(id, data);
  },

  async deleteTask(id) {
    const existing = await TaskRepository.findById(id);
    if (!existing) {
      throw new Error('TASK_NOT_FOUND');
    }
    await TaskRepository.delete(id);
    return true;
  }
};

export default TaskService;