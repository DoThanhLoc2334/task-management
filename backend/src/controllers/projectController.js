import catchAsync from '../Utils/catchAsync.js';
import * as projectService from '../services/projectService.js';

const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({ success: true, data });
};

export const getProjects = catchAsync(async (req, res) => {
  const data = await projectService.getProjects(req.params.workspaceId);
  sendSuccess(res, data);
});

export const getProjectById = catchAsync(async (req, res) => {
  const data = await projectService.getProjectById(
    req.params.projectId,
    req.params.workspaceId
  );
  sendSuccess(res, data);
});

export const createProject = catchAsync(async (req, res) => {
  const data = await projectService.createProject(
    req.params.workspaceId,
    req.user._id,
    req.body
  );
  sendSuccess(res, data, 201);
});

export const updateProject = catchAsync(async (req, res) => {
  const data = await projectService.updateProject(
    req.params.projectId,
    req.params.workspaceId,
    req.body
  );
  sendSuccess(res, data);
});

export const deleteProject = catchAsync(async (req, res) => {
  await projectService.deleteProject(req.params.projectId, req.params.workspaceId);
  sendSuccess(res, null);
});