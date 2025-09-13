
import { Profile } from './user.interface';

export interface Article {
  slug?: string;
  title?: string;
  description?: string;
  body?: string;
  tagList?: string[];
  createdAt?: string;
  updatedAt?: string;
  favorited?: boolean;
  favoritesCount?: number;
  author?: Profile;
}

export interface CreateArticleRequest {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export interface UpdateArticleRequest {
  title?: string;
  description?: string;
  body?: string;
  tagList?: string[];
}

export interface GetArticlesParams {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

export interface ArticleResponse {
  article: Article;
}

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Profile;
}

export interface CommentResponse {
  comment: Comment;
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface TagsResponse {
  tags: string[];
}