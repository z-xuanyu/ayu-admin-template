import { request } from '../../request';
import { QueryArticleParams } from './type';

// 获取文章列表
export function getArticleList(params: QueryArticleParams) {
  return request.get('/article', { params });
}

// 删除文章
export function removeArticle(id: string) {
  return request.delete(`/article/${id}`);
}
