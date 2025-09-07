// src/fixtures/api-fixtures.ts
import { test as base } from '@playwright/test';
import { Articles } from '../controllers/articles.controller';
import { Users } from '../controllers/users.controller';
import { TokenHelper } from './token';


type Fixtures = {
  commentId: string;
};

type ApiFixtures = {
  apiClient: any;
  authApiClient: any;
  articleData: any;
};

export const test = base.extend<Fixtures & ApiFixtures>({
  apiClient: async ({ request }, use) => {
    const apiClient = request;
    await use(apiClient);
  },

  authApiClient: async ({ request }, use) => {
    const token = await TokenHelper.getToken(request);
    const requestWithToken = await request.newContext({
      extraHTTPHeaders: {
        'Authorization': `Token ${token}`
      }
    });
    await use(requestWithToken);
  },

  articleData: async ({ authApiClient }, use) => {
    const articleResponse = await authApiClient.post('/articles', {
      data: {
        article: {
          title: 'Test Article',
          description: 'Test description',
          body: 'Test article body',
          tagList: ['test']
        }
      }
    });
    const json = await articleResponse.json();
    const createdArticle = {
      ...json.article,
      commentId: undefined
    };
    await use(createdArticle);
  },


  articlesController: async ({ request }, use) => {
    const controller = new Articles(request);
    await use(controller);
  },

  usersController: async ({ request }, use) => {
    const controller = new Users(request);
    await use(controller);
  },

  authenticatedArticlesController: async ({ request }, use) => {
    const token = await TokenHelper.getToken(request);
    const authenticatedController = new Articles(request, token);
    await use(authenticatedController);
  },

  authenticatedUsersController: async ({ request }, use) => {
    const token = await TokenHelper.getToken(request);
    const authenticatedController = new Users(request, token);
    await use(authenticatedController);
  },

  testUser: async ({}, use) => {
    const testUser = {
      email: process.env.EMAIL || 'test@example.com',
      password: process.env.PASSWORD || 'password123',
      username: process.env.USER_NAME || 'testuser',
    };
    await use(testUser);
  }
});

export { expect } from '@playwright/test';