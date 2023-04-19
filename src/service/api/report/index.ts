import { request } from '../../request';
import { QueryReportListParams } from './type';
// 获取素材列表
export function getReportList(params: QueryReportListParams) {
  return request.get('/report', { params });
}

// 删除素材
export function removeReport(id: string) {
  return request.delete(`/report/${id}`);
}
