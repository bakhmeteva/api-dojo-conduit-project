// src/fixtures/TokenHelper.ts
import { APIRequestContext } from '@playwright/test';
import fs from 'fs';

const { EMAIL, USER_NAME, PASSWORD } = process.env;
const tokenPath = '.token';

export class TokenHelper {
  static async getToken(apiClient: APIRequestContext): Promise<string> {
    let token: string;

    if (fs.existsSync(tokenPath)) {
      token = fs.readFileSync(tokenPath, { encoding: 'utf-8' });
      const userExistCheck = await apiClient.get('/user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });
    }

    // @ts-ignore
    if (!token) {
      const user = {
        email: EMAIL,
        password: PASSWORD,
        username: USER_NAME,
      };

      const createUserResponse = await apiClient.post('/users', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { user },
      });

      const loginResponse = await apiClient.post('/users/login', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          user: {
            email: EMAIL,
            password: PASSWORD,
          },
        },
      });

      const json = await loginResponse.json();
      token = json.user.token;
      fs.writeFileSync(tokenPath, token);
    }

    return token;
  }
}
