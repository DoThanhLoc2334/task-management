import ProjectRepository from '../models/project.repository.js';
import db from '../config/db.js';

const ProjectService = {

  async createProject(data, userId) {
    const { name, workspace_id } = data;

    if (!name || !workspace_id) {
      throw new Error('MISSING_FIELDS');
    }

    // 🔥 check user thuộc workspace
    const member = await db.query(
      `
      SELECT role FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
      `,
      [workspace_id, userId]
    );

    if (!member.rows.length) {
      throw new Error('FORBIDDEN');
    }

    const role = member.rows[0].role;

    // 🔥 chỉ role cao mới tạo project
    if (role !== 'OWNER') {
      throw new Error('NO_PERMISSION');
    }

    return await ProjectRepository.create(data);
  },

  async getProjects(workspace_id, userId) {

    const member = await db.query(
      `
      SELECT * FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
      `,
      [workspace_id, userId]
    );

    if (!member.rows.length) {
      throw new Error('FORBIDDEN');
    }

    return await ProjectRepository.findByWorkspace(workspace_id);
  },

  async getProjectById(id, userId) {
    const project = await ProjectRepository.findById(id);

    if (!project) {
      throw new Error('PROJECT_NOT_FOUND');
    }

    const member = await db.query(
      `
      SELECT * FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
      `,
      [project.workspace_id, userId]
    );

    if (!member.rows.length) {
      throw new Error('FORBIDDEN');
    }

    return project;
  },

  async updateProject(id, data, userId) {
    const project = await ProjectRepository.findById(id);

    if (!project) {
      throw new Error('PROJECT_NOT_FOUND');
    }

    const member = await db.query(
      `
      SELECT role FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
      `,
      [project.workspace_id, userId]
    );

    if (!member.rows.length) {
      throw new Error('FORBIDDEN');
    }

    if (member.rows[0].role !== 'OWNER') {
      throw new Error('NO_PERMISSION');
    }

    return await ProjectRepository.update(id, data);
  },

  async deleteProject(id, userId) {
    const project = await ProjectRepository.findById(id);

    if (!project) {
      throw new Error('PROJECT_NOT_FOUND');
    }

    const member = await db.query(
      `
      SELECT role FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
      `,
      [project.workspace_id, userId]
    );

    if (!member.rows.length) {
      throw new Error('FORBIDDEN');
    }

    if (member.rows[0].role !== 'OWNER') {
      throw new Error('NO_PERMISSION');
    }

    await ProjectRepository.delete(id);

    return true;
  }
};

export default ProjectService;