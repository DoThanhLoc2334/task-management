import Workspace from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import AppError from '../Utils/AppError.js';

export const getWorkspaces = async (userId) => {
  const memberships = await WorkspaceMember.find({ userId }).lean();
  const workspaceIds = memberships.map((m) => m.workspaceId);
  const workspaces = await Workspace.find({ _id: { $in: workspaceIds } }).lean();
  const roleMap = Object.fromEntries(
    memberships.map((m) => [m.workspaceId.toString(), m.role])
  );
  return workspaces.map((ws) => ({ ...ws, role: roleMap[ws._id.toString()] }));
};

export const getWorkspaceById = async (workspaceId) => {
  const workspace = await Workspace.findById(workspaceId).lean();
  if (!workspace) throw new AppError('Workspace không tồn tại.', 404, 'WORKSPACE_NOT_FOUND');
  const memberCount = await WorkspaceMember.countDocuments({ workspaceId });
  return { ...workspace, memberCount };
};

export const createWorkspace = async (userId, body) => {
  const { name, description, slug } = body;

  if (slug) {
    const existing = await Workspace.findOne({ slug });
    if (existing) throw new AppError('Slug đã được sử dụng.', 409, 'SLUG_TAKEN');
  }

  const workspace = await Workspace.create({ name, description, slug, ownerId: userId });
  await WorkspaceMember.create({ workspaceId: workspace._id, userId, role: 'owner' });
  return workspace;
};

export const updateWorkspace = async (workspaceId, body) => {
  const { name, description, slug } = body;

  if (slug) {
    const existing = await Workspace.findOne({ slug, _id: { $ne: workspaceId } });
    if (existing) throw new AppError('Slug đã được sử dụng.', 409, 'SLUG_TAKEN');
  }

  const workspace = await Workspace.findByIdAndUpdate(
    workspaceId,
    { name, description, slug },
    { new: true, runValidators: true }
  );
  if (!workspace) throw new AppError('Workspace không tồn tại.', 404, 'WORKSPACE_NOT_FOUND');
  return workspace;
};

export const deleteWorkspace = async (workspaceId, userId) => {
  await Workspace.findByIdAndUpdate(workspaceId, { deletedAt: new Date() });
};

export const getMembers = async (workspaceId) => {
  return WorkspaceMember.find({ workspaceId })
    .populate('userId', 'fullName email avatarUrl')
    .lean();
};

export const addMember = async (workspaceId, currentUserId, body) => {
  const { email, role = 'member' } = body;
  const User = (await import('../models/User.js')).default;
  const targetUser = await User.findOne({ email });
  if (!targetUser) throw new AppError('Người dùng không tồn tại.', 404, 'USER_NOT_FOUND');
  const existing = await WorkspaceMember.findOne({ workspaceId, userId: targetUser._id });
  if (existing) throw new AppError('Người dùng đã là thành viên.', 409, 'ALREADY_MEMBER');
  const member = await WorkspaceMember.create({ workspaceId, userId: targetUser._id, role });
  return member.populate('userId', 'fullName email avatarUrl');
};

export const updateMemberRole = async (workspaceId, currentUserId, memberId, body) => {
  const { role } = body;
  const member = await WorkspaceMember.findById(memberId);
  if (!member || member.workspaceId.toString() !== workspaceId) {
    throw new AppError('Thành viên không tồn tại.', 404, 'MEMBER_NOT_FOUND');
  }
  if (member.role === 'owner') {
    throw new AppError('Không thể thay đổi role của owner.', 403, 'FORBIDDEN');
  }
  member.role = role;
  await member.save();
  return member;
};

export const removeMember = async (workspaceId, currentUserId, memberId) => {
  const targetMember = await WorkspaceMember.findById(memberId);
  if (!targetMember || targetMember.workspaceId.toString() !== workspaceId) {
    throw new AppError('Thành viên không tồn tại.', 404, 'MEMBER_NOT_FOUND');
  }
  if (targetMember.role === 'owner') {
    throw new AppError('Không thể xóa owner khỏi workspace.', 403, 'FORBIDDEN');
  }
  await targetMember.deleteOne();
};

