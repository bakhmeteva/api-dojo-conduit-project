
import { expect, test } from '@playwright/test';
import { Schemas } from '../../src/schemas/article_schema';
import { Articles } from '../../src/controllers/articles.controller';

test('should validate article response', async ({ articlesController}) => {
  const response = await articlesController.getArticle('some-slug');
  const responseData = await response.json();

  const { error } = Schemas.article.validate(responseData);
  expect(error).toBeUndefined();
});