
import { test, expect } from '../../src/fixtures/api-fixtures';



test.describe('users API', () => {
  test('should register a new user', async ({  usersController }) => {
    const timestamp = Date.now();
    const userData = {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'password123'
    };

    const response = await usersController.registerUser(userData);

    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.user).toHaveProperty('email', userData.email);
    expect(responseData.user).toHaveProperty('username', userData.username);
    expect(responseData.user).toHaveProperty('token');
    expect(responseData.user.token).toBeTruthy();
  });

  test('should not register user with existing email', async ({ usersController }) => {
    const timestamp = Date.now();
    const userData = {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'password123'
    };

    // Реєструємо користувача вперше
    await usersController.registerUser(userData);

    // Намагаємось зареєструвати з тим же email
    const response = await usersController.registerUser({
      ...userData,
      username: `different${timestamp}`
    });

    expect(response.status()).toBe(404);
  });

  test('should login with valid credentials', async ({ usersController, testUser }) => {
    const response = await usersController.loginUser({
      email: testUser.email,
      password: testUser.password
    });

    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.user).toHaveProperty('email', testUser.email);
    expect(responseData.user).toHaveProperty('token');
    expect(responseData.user.token).toBeTruthy();
  });

  test('should not login with invalid credentials', async ({ usersController }) => {
    const response = await usersController.loginUser({
      email: 'invalid@example.com',
      password: 'wrongpassword'
    });
    expect(response.status()).toBe(404);
  });



  test('should update user profile', async ({ authenticatedUsersController }) => {
    const updateData = {
      bio: 'Updated bio for testing',
      image: 'https://example.com/avatar.jpg'
    };

    const response = await authenticatedUsersController.updateUser(updateData);

    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.user.bio).toBe(updateData.bio);
    expect(responseData.user.image).toBe(updateData.image);
  });

  test('should not get current user without token', async ({ usersController }) => {
    const response = await usersController.getCurrentUser();

    expect(response.status()).toBe(401);
  });
});