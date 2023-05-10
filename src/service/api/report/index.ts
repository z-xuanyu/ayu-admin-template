import { request } from '../../request';
import { QueryReportListParams } from './type';

export function getReportList(params: QueryReportListParams) {
  return request.get('/report', { params });
}

export function removeReport(id: string) {
  return request.delete(`/report/${id}`);
}
