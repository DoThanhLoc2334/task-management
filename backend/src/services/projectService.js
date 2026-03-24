import Project from '../models/Project.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import AppError from '../Utils/AppError.js';

export const getProjects = async (workspaceId) => {
  return Project.find({ workspaceId }).lean();
};

export const getProjectById = async (projectId, workspaceId) => {
  const project = await Project.findOne({ _id: projectId, workspaceId }).lean();
  if (!project) throw new AppError('Project không tồn tại.', 404, 'PROJECT_NOT_FOUND');
  return project;
};

export const createProject = async (workspaceId, userId, body) => {
  const { name, description, settings } = body;
  const project = await Project.create({
    name,
    description,
    workspaceId,
    ownerId: userId,
    settings,
  });
  return project;
};

export const updateProject = async (projectId, workspaceId, body) => {
  const { name, description, settings, status } = body;
  const project = await Project.findOneAndUpdate(
    { _id: projectId, workspaceId },
    { name, description, settings, status },
    { new: true, runValidators: true }
  );
  if (!project) throw new AppError('Project không tồn tại.', 404, 'PROJECT_NOT_FOUND');
  return project;
};

export const deleteProject = async (projectId, workspaceId) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, workspaceId },
    { archivedAt: new Date() },
    { new: true }
  );
  if (!project) throw new AppError('Project không tồn tại.', 404, 'PROJECT_NOT_FOUND');
};