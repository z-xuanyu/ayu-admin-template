import { request } from '../../request';
import {
  AddArticleCategoryParams,
  QueryArticleCategoryParams,
  UpdateArticleCategoryParams,
} from './type';

// 分类列表
export function getCategoryList(params: QueryArticleCategoryParams) {
  return request.get('/category', { params });
}

// 添加分类
export function addCategory(params: AddArticleCategoryParams) {
  return request.post('/category', params);
}

// 更新分类
export function updateCategory(params: UpdateArticleCategoryParams) {
  return request.patch(`/category/${params._id}`, params);
}

// 删除分类
export function removeCategory(id: string) {
  return request.delete(`/category/${id}`);
}
