// src/controllers/Users.controller.ts
import { APIRequestContext } from '@playwright/test';
import { BaseController } from './base.controller';
import {
  RegisterUserRequest,
  LoginUserRequest,
  UpdateUserRequest
} from '../interfaces/user.interface';

export class Users extends BaseController {
  private static readonly usersEndpoint = "/api/users/";
  private static readonly userEndpoint = "/api/user";
  private static readonly profilesEndpoint = "/api/profiles/";

  constructor(request: APIRequestContext, token?: string) {
    super(request, token);
  }

  async registerUser(userData: RegisterUserRequest) {
    const response = await this.request.post(Users.usersEndpoint, {
      headers: this.getHeaders(false),
      data: { user: userData }
    });
    return response;
  }

  async loginUser(credentials: LoginUserRequest) {
    const response = await this.request.post(Users.usersEndpoint + "login", {
      headers: this.getHeaders(false),
      data: { user: credentials }
    });
    return response;
  }

  async getCurrentUser() {
    const response = await this.request.get(Users.userEndpoint, {
      headers: this.getHeaders(true)
    });
    return response;
  }

  async updateUser(userData: UpdateUserRequest) {
    const response = await this.request.put(Users.userEndpoint, {
      headers: this.getHeaders(true),
      data: { user: userData }
    });
    return response;
  }

  async getProfile(username: string) {
    const response = await this.request.get(Users.profilesEndpoint + username, {
      headers: this.getHeaders(false)
    });
    return response;
  }

  async followUnfollowUser(username: string) {
    const response = await this.request.post(Users.profilesEndpoint + `${username}/follow`, {
      headers: this.getHeaders(true)
    });
    return response;
  }


}