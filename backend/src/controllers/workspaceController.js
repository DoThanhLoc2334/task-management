import catchAsync from '../Utils/catchAsync.js';
import * as workspaceService from '../services/workSpaceService.js';

const sendSuccess = (res, data, statusCode = 200, meta = null) => {
  const response = { success: true, data };
  if (meta) response.meta = meta;
  res.status(statusCode).json(response);
};

// ─── Workspace ────────────────────────────────────────────
export const getWorkspaces = catchAsync(async (req, res) => {
  const data = await workspaceService.getWorkspaces(req.user._id);
  sendSuccess(res, data);
});

export const getWorkspaceById = catchAsync(async (req, res) => {
  const data = await workspaceService.getWorkspaceById(req.params.workspaceId, req.user._id);
  sendSuccess(res, data);
});

export const createWorkspace = catchAsync(async (req, res) => {
  const data = await workspaceService.createWorkspace(req.user._id, req.body);
  sendSuccess(res, data, 201);
});

export const updateWorkspace = catchAsync(async (req, res) => {
  const data = await workspaceService.updateWorkspace(req.params.workspaceId, req.user._id, req.body);
  sendSuccess(res, data);
});

export const deleteWorkspace = catchAsync(async (req, res) => {
  await workspaceService.deleteWorkspace(req.params.workspaceId, req.user._id);
  sendSuccess(res, null);
});

// ─── Members ──────────────────────────────────────────────
export const getMembers = catchAsync(async (req, res) => {
  const data = await workspaceService.getMembers(req.params.workspaceId, req.user._id);
  sendSuccess(res, data);
});

export const addMember = catchAsync(async (req, res) => {
  const data = await workspaceService.addMember(req.params.workspaceId, req.user._id, req.body);
  sendSuccess(res, data, 201);
});

export const updateMemberRole = catchAsync(async (req, res) => {
  const data = await workspaceService.updateMemberRole(
    req.params.workspaceId,
    req.user._id,
    req.params.memberId,
    req.body
  );
  sendSuccess(res, data);
});

export const removeMember = catchAsync(async (req, res) => {
  await workspaceService.removeMember(req.params.workspaceId, req.user._id, req.params.memberId);
  sendSuccess(res, null);
});