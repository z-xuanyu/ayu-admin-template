import { request } from '../../request';
import {
  AddArticleParams,
  QueryArticleParams,
  UdateArticleParams,
} from './type';

// 获取文章列表
export function getArticleList(params: QueryArticleParams) {
  return request.get('/article', { params });
}

// 添加文章
export function addArticle(params: AddArticleParams) {
  return request.post('/article', params);
}

// 获取文章详细
export function getArticleInfo(id: string) {
  return request.get(`/article/${id}`);
}

// 更新文章信息
export function updateArticle(params: UdateArticleParams) {
  return request.patch(`/article/${params._id}`, params);
}

// 删除文章
export function removeArticle(id: string) {
  return request.delete(`/article/${id}`);
}
