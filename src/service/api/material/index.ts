import { request } from '../../request';
import type { QueryMaterialListParams, UpdateMaterialParams } from './type';

// 获取素材列表
export function getMaterialList(params: QueryMaterialListParams) {
  return request.get('/material', { params });
}

// 更新素材信息
export function updateMaterial(id: string, params: UpdateMaterialParams) {
  return request.patch(`/material/${id}`, params);
}

// 删除素材
export function removeMaterial(id: string) {
  return request.delete(`/material/${id}`);
}
