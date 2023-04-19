import { request } from '../../request';
import type { AddMaterialCategoryParams } from './type';

// 添加素材分类
export function addMaterialCategory(params: AddMaterialCategoryParams) {
  return request.post('/material-category', params);
}
// 素材分类列表
export function getMaterialCategoryList() {
  return request.get('/material-category');
}
