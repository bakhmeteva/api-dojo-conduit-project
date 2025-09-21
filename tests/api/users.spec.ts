import { test, expect } from '../../src/fixtures/api-fixtures';

test.describe('users API', () => {
  test.describe('user registration', () => {
    test('should register new user with valid data', async ({ usersController }) => {
      const timestamp = Date.now();
      const userData = {
        username: `testuser${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'password123',
      };
      const response = await usersController.registerUser(userData);
      expect(response.status()).toBe(200);
      const responseData = await response.json();
      expect(responseData.user).toHaveProperty('email', userData.email);
      expect(responseData.user).toHaveProperty('username', userData.username);
      expect(responseData.user).toHaveProperty('token');
      expect(responseData.user.token).toBeTruthy();
      expect(responseData.user).not.toHaveProperty('password');
    });

    test('should not register user with existing email', async ({ usersController }) => {
      const timestamp = Date.now();
      const userData = {
        username: `testuser${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'password123',
      };
      const firstResponse = await usersController.registerUser(userData);
      expect(firstResponse.status()).toBe(200);
      const response = await usersController.registerUser({
        ...userData,
        username: `different${timestamp}`,
      });
      expect(response.status()).toBe(422);
      const errorData = await response.json();
      expect(errorData.errors).toHaveProperty('email');
    });

    test('should not register user with invalid email format', async ({ usersController }) => {
      const timestamp = Date.now();
      const userData = {
        username: `testuser${timestamp}`,
        email: 'invalid-email-format',
        password: 'password123',
      };
      const response = await usersController.registerUser(userData);
      expect(response.status()).toBe(422);
      const errorData = await response.json();
      expect(errorData.errors).toHaveProperty('email');
    });
  });

  test.describe('user authentication', () => {
    test.beforeAll(async ({ usersController, testUser }) => {
      await usersController.registerUser(testUser);
    });

    test('should login with valid credentials', async ({ usersController, testUser }) => {
      const response = await usersController.loginUser({
        email: testUser.email,
        password: testUser.password,
      });
      expect(response.status()).toBe(200);
      const responseData = await response.json();
      expect(responseData.user).toHaveProperty('email', testUser.email);
      expect(responseData.user).toHaveProperty('token');
      expect(responseData.user.token).toBeTruthy();
      expect(responseData.user).not.toHaveProperty('password');
    });

    test('should not login with invalid email', async ({ usersController }) => {
      const response = await usersController.loginUser({
        email: 'nonexistent@example.com',
        password: 'password123',
      });
      expect(response.status()).toBe(422);
      const errorData = await response.json();
      expect(errorData.errors).toHaveProperty('email or password');
    });

    test('should not login with invalid password', async ({ usersController, testUser }) => {
      const response = await usersController.loginUser({
        email: testUser.email,
        password: 'wrongpassword',
      });
      expect(response.status()).toBe(422);
    });

    test('should not login with empty credentials', async ({ usersController }) => {
      const response = await usersController.loginUser({
        email: '',
        password: '',
      });
      expect(response.status()).toBe(422);
    });
  });

  test.describe('user profile management', () => {
    test.beforeAll(async ({ usersController, testUser }) => {
      await usersController.registerUser(testUser);
    });

    test('should get current user with valid token', async ({ authenticatedUsersController }) => {
      const response = await authenticatedUsersController.getCurrentUser();

      expect(response.status()).toBe(200);

      const responseData = await response.json();
      expect(responseData.user).toHaveProperty('email');
      expect(responseData.user).toHaveProperty('username');
      expect(responseData.user).toHaveProperty('token');
    });

    test('should not get current user without token', async ({ usersController }) => {
      const response = await usersController.getCurrentUser();

      expect(response.status()).toBe(401);
    });

    test('should update user profile with valid data', async ({ authenticatedUsersController }) => {
      const updateData = {
        bio: 'Updated bio for testing',
        image: 'https://example.com/avatar.jpg',
      };

      const response = await authenticatedUsersController.updateUser(updateData);
      expect(response.status()).toBe(200);

      const responseData = await response.json();
      expect(responseData.user.bio).toBe(updateData.bio);
      expect(responseData.user.image).toBe(updateData.image);
    });

    test('should update user email', async ({ authenticatedUsersController }) => {
      const timestamp = Date.now();
      const updateData = {
        email: `newemail${timestamp}@example.com`,
      };

      const response = await authenticatedUsersController.updateUser(updateData);
      expect(response.status()).toBe(200);

      const responseData = await response.json();
      expect(responseData.user.email).toBe(updateData.email);
    });

    test('should not update user with invalid email format', async ({ authenticatedUsersController }) => {
      const updateData = {
        email: 'invalid-email-format',
      };

      const response = await authenticatedUsersController.updateUser(updateData);
      expect(response.status()).toBe(422);
    });
  });

  test.describe('user profiles', () => {
    const timestamp = Date.now();
    const userData = {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'password123',
    };

    test.beforeAll(async ({ usersController, testUser }) => {
      const response = await usersController.registerUser(userData);
      expect(response.status()).toBe(200);
    });

    test('update profile info', async ({ authenticatedUsersController, testUser }) => {
      await authenticatedUsersController.loginUser(userData);
      const userNameNew = userData.username + `1`;
      const updateResp = await authenticatedUsersController.updateUser({
        username: userNameNew,
        bio: 'some-bio',
        image: 'https://example.com/avatar.jpg',
      });
      const response = await authenticatedUsersController.getProfile(userNameNew);
      expect(response.status()).toBe(200);
      const responseData = await response.json();
      expect(responseData.profile).toHaveProperty('username', userNameNew);
      expect(responseData.profile).toHaveProperty('bio');
      expect(responseData.profile).toHaveProperty('image');
      expect(responseData.profile).toHaveProperty('following', false);
    });

    test('should not get profile for nonexistent user', async ({ usersController }) => {
      const response = await usersController.getProfile('nonexistentuser');
      expect(response.status()).toBe(404);
    });

    test('should not follow nonexistent user', async ({ authenticatedUsersController }) => {
      const response = await authenticatedUsersController.followUnfollowUser('nonexistentuser');
      expect(response.status()).toBe(404);
    });

    test('should follow user', async ({ authenticatedUsersController, testUser }) => {
      const responseFollow = await authenticatedUsersController.followUnfollowUser(testUser.username);
      expect(responseFollow.status()).toBe(200);
      const responseData1 = await responseFollow.json();
      expect(responseData1.profile).toHaveProperty('following', true);
    });
  });
});
