import { request } from '../../request';
import type { AddAdminParams, UpdateAdminParams } from './type';

// 获取管理员列表
export function getAdminList() {
  return request.get('/admin');
}

// 添加管理员
export function addAdmin(params: AddAdminParams) {
  return request.post('/admin', params);
}

// 编辑管理员
export function updateAdmin(params: UpdateAdminParams) {
  return request.patch(`/admin/${params._id}`, params);
}

// 删除管理员
export function romoveAdmin(id: string | undefined) {
  return request.delete(`/admin/${id}`);
}
