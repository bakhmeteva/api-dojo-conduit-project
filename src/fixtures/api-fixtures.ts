import { test as base, APIRequestContext } from '@playwright/test';
import { Articles } from '../controllers/articles.controller';
import { Users } from '../controllers/users.controller';
import { TokenHelper } from './token';

type ApiFixtures = {
  apiClient: APIRequestContext;
  authApiClient: any;
  articleData: any;
  articlesController: Articles;
  usersController: Users;
  authenticatedArticlesController: Articles;
  authenticatedUsersController: Users;
  testUser: {
    email: string;
    password: string;
    username: string;
  };
  commentId: string;
};

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    await use(request);
  },

  authApiClient: async ({ request }, use) => {
    const token = await TokenHelper.getToken(request);

    const authClient = {
      get: (url: string, options: any = {}) => {
        return request.get(url, {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: `Token ${token}`,
          },
        });
      },

      post: (url: string, options: any = {}) => {
        return request.post(url, {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: `Token ${token}`,
          },
        });
      },

      put: (url: string, options: any = {}) => {
        return request.put(url, {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: `Token ${token}`,
          },
        });
      },

      delete: (url: string, options: any = {}) => {
        return request.delete(url, {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: `Token ${token}`,
          },
        });
      },

      patch: (url: string, options: any = {}) => {
        return request.patch(url, {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: `Token ${token}`,
          },
        });
      },
    };

    await use(authClient);
  },

  articleData: async ({ authApiClient }, use) => {
    const articleResponse = await authApiClient.post('/articles', {
      data: {
        article: {
          title: 'Test Article',
          description: 'Test description',
          body: 'Test article body',
          tagList: ['test'],
        },
      },
    });
    const json = await articleResponse.json();
    const createdArticle = {
      ...json.article,
      commentId: undefined,
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
  },

  commentId: async ({}, use) => {
    await use('');
  },
});

export { expect } from '@playwright/test';
