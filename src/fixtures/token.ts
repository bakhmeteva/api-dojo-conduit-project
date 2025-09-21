import { APIRequestContext } from '@playwright/test';
import fs from 'fs';

const { EMAIL, USER_NAME, PASSWORD } = process.env;
const tokenPath = '.token';

export class TokenHelper {
  static async getToken(apiClient: APIRequestContext): Promise<string> {
    const today = Date.now().toString()
    let token: string;
    token = ``;

    if (fs.existsSync(tokenPath)) {
      token = fs.readFileSync(tokenPath, { encoding: 'utf-8' });
      const userExistCheck = await apiClient.get('/api/user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });
    }
    if (!token) {
      const user = {
        email: today + EMAIL,
        password: today + PASSWORD,
        username: today + USER_NAME,
      };

      const createUserResponse = await apiClient.post('/api/users', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { user },
      });

      const loginResponse = await apiClient.post('/api/users/login', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          user: {
            email: today + EMAIL,
            password: today + PASSWORD,
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
