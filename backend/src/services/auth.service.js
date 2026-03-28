import bcrypt from 'bcrypt';
import UserRepository from '../models/user.repository.js';
import WorkspaceRepository from '../models/workspace.repository.js';
import {
  generateAccessToken,
  generateRefreshToken
} from '../Utils/generateToken.js';
import WorkspaceService from './workspace.service.js';

const AuthService = {
  async register({ email, name, password }) {
    if (!email || !password) {
      throw new Error('MISSING_REQUIRED_FIELDS');
    }

    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserRepository.create({
      email,
      name,
      password_hash: hashedPassword
    });

    return {
      id: user.id,
      email: user.email
    };
  },

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('MISSING_REQUIRED_FIELDS');
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      accessToken,
      refreshToken
    };
  },
  async getAllUsers() {
    return await UserRepository.findAll();
  },

  async getUsersNotInWorkspace(workspaceId) {
    if (!workspaceId) {
      throw new Error('workspace_id is required');
    }

    return await WorkspaceRepository.getUsersNotInWorkspace(workspaceId);
  },
  async getUsersInWorkspace(workspaceId){
    if(!workspaceId){
      throw new Error('workspace_id is required')
    }
    return await WorkspaceRepository.getUsersInWorkspace(workspaceId);
  }

};

export default AuthService;