// 转化下拉选择框 options 树结构数组
export function transformSelectOptionTreeArr(arr = [], pid = null): any {
  if (!Array.isArray(arr)) return;
  return arr
    .filter((item: any) => item.pid == pid)
    .map((childItem: any) =>
      transformSelectOptionTreeArr(arr, childItem._id).length
        ? {
            key: childItem._id,
            label: childItem.name,
            children: transformSelectOptionTreeArr(arr, childItem._id),
          }
        : { key: childItem._id, label: childItem.name },
    );
}
