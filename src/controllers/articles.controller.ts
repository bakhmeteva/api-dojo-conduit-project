
import { APIRequestContext } from '@playwright/test';
import { BaseController } from './base.controller';
import {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
  GetArticlesParams
} from '../interfaces/article.interface';

export class Articles extends BaseController {
  private static readonly articlesEndpoint = "/api/articles/";

  constructor(request: APIRequestContext, token?: string) {
    super(request, token);
  }

  async createArticle(articleData: CreateArticleRequest) {
    const response = await this.request.post(Articles.articlesEndpoint, {
      headers: this.getHeaders(true),
      data: { article: articleData }
    });
    return response;
  }

  async editArticle(slug: string, articleData: Article) {
    return  await this.request.put(Articles.articlesEndpoint + slug, {
      headers: this.getHeaders(true),
      data: { article: articleData }
    });
  }

  async deleteArticle(slug: string) {
    return await this.request.delete(Articles.articlesEndpoint + slug, {
      headers: this.getHeaders(true)
    });
  }

  async getArticle(slug: string) {
    const response = await this.request.get(Articles.articlesEndpoint + slug, {
      headers: this.getHeaders(false)
    });
    return response;
  }

  async getArticles(params?: GetArticlesParams) {
    let url = Articles.articlesEndpoint.slice(0, -1); // видаляємо останній слеш

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    const response = await this.request.get(url, {
      headers: this.getHeaders(false)
    });
    return response;
  }

  async getFeedArticles(params?: { limit?: number; offset?: number }) {
    let url = Articles.articlesEndpoint + "feed";

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    const response = await this.request.get(url, {
      headers: this.getHeaders(true)
    });
    return response;
  }

  async removeFromFavorites(slug: string) {
    const response = await this.request.delete(Articles.articlesEndpoint + `${slug}/favorite`, {
      headers: this.getHeaders(true)
    });
    return response;
  }

  async addToFavorites(slug: string) {
    const response = await this.request.post(Articles.articlesEndpoint + `${slug}/favorite`, {
      headers: this.getHeaders(true)
    });
    return response;
  }

  async getFavoriteArticles(author: string) {
    const response = await this.request.get(Articles.articlesEndpoint, {
      headers: this.getHeaders(false),
      params: {
        favorited: author,
      }
    });
    return response;
  }

  async addArticleComment(slug: string, body: string) {
    const response = await this.request.post(Articles.articlesEndpoint + `${slug}/comments`, {
      headers: this.getHeaders(true),
      data: { comment: { body } }
    });
    return response;
  }

  async deleteArticleComment(slug: string, commentId: string) {
    const response = await this.request.delete(Articles.articlesEndpoint + `${slug}/comments/${commentId}`, {
      headers: this.getHeaders(true)
    });
    return response;
  }
}