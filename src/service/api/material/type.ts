// 列表
export interface QueryMaterialListParams {
  pageNumber: number;
  pageSize: number;
  name?: string;
  type?: string;
  cid?: string | null;
}

export interface UpdateMaterialParams {
  // 文件名称
  name: string;
}
