import { request } from '../../request';

// 分类列表
export function getCategoryList() {
  return request.get('/category');
}
