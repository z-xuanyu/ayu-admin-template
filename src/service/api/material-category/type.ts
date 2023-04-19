export interface AddMaterialCategoryParams {
  // 分类名称
  name: string;

  // 父级分类
  pid?: string | null;
}
