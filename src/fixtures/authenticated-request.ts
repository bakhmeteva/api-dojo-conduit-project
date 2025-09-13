// src/helpers/auth-request.ts
import { APIRequestContext, APIResponse } from '@playwright/test';

export class AuthenticatedRequest {
  constructor(private request: APIRequestContext, private token: string) {}

  async get(url: string, options?: any): Promise<APIResponse> {
    return this.request.get(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Token ${this.token}`
      }
    });
  }

  async post(url: string, options?: any): Promise<APIResponse> {
    return this.request.post(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Token ${this.token}`
      }
    });
  }

  async put(url: string, options?: any): Promise<APIResponse> {
    return this.request.put(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Token ${this.token}`
      }
    });
  }

  async delete(url: string, options?: any): Promise<APIResponse> {
    return this.request.delete(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Token ${this.token}`
      }
    });
  }

  async patch(url: string, options?: any): Promise<APIResponse> {
    return this.request.patch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Token ${this.token}`
      }
    });
  }
}