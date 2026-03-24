import WorkspaceRepository from '../models/workspace.repository.js';
import db from '../config/db.js';
import AppError from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorCodes.js';

const WorkspaceService = {

  async createWorkspace(data, userId) {
    const { name, description } = data;

    // ✅ validate
    if (!name) {
      throw new AppError(ERROR_CODES.MISSING_NAME, 400, 'Name is required');
    }

    // ✅ create workspace
    const workspace = await WorkspaceRepository.create(name, description);

    // ✅ add creator vào workspace_members
    await db.query(
      `
      INSERT INTO workspace_members (workspace_id, user_id, role, joined_at)
      VALUES ($1, $2, 'OWNER', NOW())
      `,
      [workspace.id, userId]
    );

    return workspace;
  },

  async getUserWorkspaces(userId) {
    // 👉 có thể thêm validate nếu muốn
    if (!userId) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
    }

    return await WorkspaceRepository.findByUser(userId);
  },

  async getWorkspaceById(workspaceId, userId) {

    // ✅ validate input
    if (!workspaceId) {
      throw new AppError(ERROR_CODES.WORKSPACE_NOT_FOUND, 404);
    }

    const workspace = await WorkspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new AppError(ERROR_CODES.WORKSPACE_NOT_FOUND, 404);
    }

    // ✅ check membership
    const result = await db.query(
      `
      SELECT role
      FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
      `,
      [workspaceId, userId]
    );

    if (!result.rows.length) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 403);
    }

    return {
      ...workspace,
      role: result.rows[0].role
    };
  },
  
  async addMember(workspaceId, userId, role, currentUserId) {

    // ✅ validate input
    if (!workspaceId || !userId) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Missing required fields');
    }

    // ✅ check workspace tồn tại
    const workspace = await WorkspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new AppError(ERROR_CODES.WORKSPACE_NOT_FOUND, 404);
    }

    // ✅ check quyền (chỉ OWNER mới được thêm member)
    const ownerCheck = await db.query(
      `
    SELECT role
    FROM workspace_members
    WHERE workspace_id = $1 AND user_id = $2
    `,
      [workspaceId, currentUserId]
    );

    if (!ownerCheck.rows.length || ownerCheck.rows[0].role !== 'OWNER') {
      throw new AppError(ERROR_CODES.FORBIDDEN, 403);
    }

    // ✅ check user đã ở trong workspace chưa
    const existing = await db.query(
      `
    SELECT 1
    FROM workspace_members
    WHERE workspace_id = $1 AND user_id = $2
    `,
      [workspaceId, userId]
    );

    if (existing.rows.length) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'User already in workspace');
    }

    // ✅ thêm member
    const result = await db.query(
      `
    INSERT INTO workspace_members (workspace_id, user_id, role, joined_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING workspace_id, user_id, role, joined_at
    `,
      [workspaceId, userId, role || 'MEMBER']
    );

    return result.rows[0];
  }

};

export default WorkspaceService;