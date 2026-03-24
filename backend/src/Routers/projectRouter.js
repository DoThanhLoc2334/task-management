import express from 'express';
import * as projectController from '../controllers/projectController.js';

const router = express.Router({ mergeParams: true }); // mergeParams để đọc được :workspaceId từ parent

const mockAuth = (req, res, next) => {
  req.user = { _id: '69c247428b2dac1da560ec5b' };
  next();
};

router.use(mockAuth);

router.route('/')
  .get(projectController.getProjects)
  .post(projectController.createProject);

router.route('/:projectId')
  .get(projectController.getProjectById)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

export default router;