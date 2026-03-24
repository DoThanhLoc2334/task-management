import TaskService from '../services/task.service.js';


const TaskController = {
  async getAll(req, res) {
    try {
      const data = await TaskService.getAllTasks();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await TaskService.getTaskById(req.params.id);
      res.json(data);
    } catch (err) {
      if (err.message === 'TASK_NOT_FOUND') {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await TaskService.createTask(req.body);
      res.status(201).json(data);
    } catch (err) {
      if (err.message === 'MISSING_REQUIRED_FIELDS') {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      res.status(500).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = await TaskService.updateTask(req.params.id, req.body);
      res.json(data);
    } catch (err) {
      if (err.message === 'TASK_NOT_FOUND') {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(500).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await TaskService.deleteTask(req.params.id);
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      if (err.message === 'TASK_NOT_FOUND') {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(500).json({ message: err.message });
    }
  }
};

export default TaskController;