import { test, expect } from '../../src/fixtures/api-fixtures';

test.describe('articles API', () => {
  test('create article', async ({ authenticatedArticlesController }) => {
    const response = await authenticatedArticlesController.createArticle({
      title: 'MyTestArticleTitle',
      description: 'MyTestArticleDescription',
      body: 'MyTestArticleBody',
    });
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    const slug = responseData.article.slug.toString();
    expect(responseData.article).toHaveProperty('title', 'MyTestArticleTitle');
    const getArticle = await authenticatedArticlesController.getArticle(slug);
    expect(getArticle.status()).toBe(200);
  });

  test('edit article', async ({ authenticatedArticlesController }) => {
    const responseCreate = await authenticatedArticlesController.createArticle({
      title: 'MyTestArticleTitle',
      description: 'MyTestArticleDescription',
      body: 'MyTestArticleBody',
    });
    expect(responseCreate.status()).toBe(200);
    const responseData = await responseCreate.json();
    const slug = responseData.article.slug.toString();

    const editResponse = await authenticatedArticlesController.editArticle(slug, {
      title: 'MyTestArticleTitleEdit',
    });
    expect(editResponse.status()).toBe(200);
    const responseData2 = await editResponse.json();
    expect(responseData2.article).toHaveProperty('title', 'MyTestArticleTitleEdit');
  });

  test('delete article', async ({ authenticatedArticlesController }) => {
    const responseCreate = await authenticatedArticlesController.createArticle({
      title: 'MyTestArticleTitle',
      description: 'MyTestArticleDescription',
      body: 'MyTestArticleBody',
    });
    expect(responseCreate.status()).toBe(200);
    const responseData = await responseCreate.json();
    const slug = responseData.article.slug.toString();
    const deleteResponse = await authenticatedArticlesController.deleteArticle(slug);
    expect(deleteResponse.status()).toBe(204);
    const getResponse = await authenticatedArticlesController.getArticle(slug);
    expect(getResponse.status()).toBe(404);
  });

  test('find article by title', async ({ authenticatedArticlesController }) => {
    const timestamp = Date.now();
    const articleName = 'MyTestArticleTitleForSearch' + timestamp;
    await authenticatedArticlesController.createArticle({
      title: articleName,
      description: 'MyTestArticleDescription',
      body: 'MyTestArticleBody',
    });

    const response = await authenticatedArticlesController.getArticles();
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    const matchingArticles = responseData.articles.filter((article) => article.title.includes(articleName));
    expect(matchingArticles.length).toBe(1);
  });

  test('find article by tag', async ({ authenticatedArticlesController }) => {
    const timestamp = Date.now();
    const articleName = 'MyTestArticleTitleForSearch' + timestamp;
    const tag = 'dojo' + timestamp;
    await authenticatedArticlesController.createArticle({
      title: articleName,
      description: 'MyTestArticleDescription',
      body: 'MyTestArticleBody',
      tagList: [tag],
    });

    const response = await authenticatedArticlesController.getArticles();
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    const matchingArticles = responseData.articles.filter(
      (article) => article.tagList && article.tagList.includes(tag),
    );

    expect(matchingArticles.length).toBe(1);
    expect(matchingArticles[0].title).toBe(articleName);
    expect(matchingArticles[0].tagList).toContain(tag);
  });

  test('favorite article add and remove', async ({ authenticatedArticlesController }) => {
    const responseCreate = await authenticatedArticlesController.createArticle({
      title: 'MyTestArticleTitle',
      description: 'MyTestArticleDescription',
      body: 'MyTestArticleBody',
    });
    expect(responseCreate.status()).toBe(200);
    const responseData = await responseCreate.json();
    const slug = responseData.article.slug.toString();
    const responseAdd = await authenticatedArticlesController.addToFavorites(slug);
    expect(responseAdd.status()).toBe(200);
    const responseData2 = await responseAdd.json();
    expect(responseData2.article).toHaveProperty('favorited', true);

    const responseRemove = await authenticatedArticlesController.removeFromFavorites(slug);
    expect(responseRemove.status()).toBe(200);
    const responseData3 = await responseRemove.json();
    expect(responseData3.article).toHaveProperty('favorited', false);
  });

  test('add comment', async ({ authenticatedArticlesController }) => {
    const responseCreate = await authenticatedArticlesController.createArticle({
      title: 'MyTestArticleTitle',
      description: 'MyTestArticleDescription',
      body: 'MyTestArticleBody',
    });

    const comment = `My Best comment`;
    expect(responseCreate.status()).toBe(200);
    const responseData = await responseCreate.json();
    const slug = responseData.article.slug.toString();
    const responseAdd = await authenticatedArticlesController.addArticleComment(slug, comment);
    expect(responseAdd.status()).toBe(200);
    const responseData2 = await responseAdd.json();
    expect(responseData2.comment).toHaveProperty('body', comment);

    const commentId = responseData2.comment.id.toString();

    const responseRemove = await authenticatedArticlesController.deleteArticleComment(slug, commentId);
    expect(responseRemove.status()).toBe(204);
  });
});
