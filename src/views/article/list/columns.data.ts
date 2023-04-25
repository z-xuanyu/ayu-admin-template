import { DataTableColumns } from 'naive-ui';
import { ShallowRef, shallowRef, h } from 'vue';
import { NSpace, NButton } from 'naive-ui';

interface Article {
  index: number;

  key: string;

  title: string;
}

export const columns: ShallowRef<DataTableColumns<Article>> = shallowRef([
  {
    type: 'selection',
    align: 'center',
  },
  {
    key: 'title',
    title: '标题',
    align: 'center',
    width: '100px',
  },
  {
    key: 'categoryId',
    title: '分类',
    align: 'center',
    width: '100px',
  },
  {
    key: 'cover',
    title: '封面图',
    align: 'center',
    width: '100px',
  },
  {
    key: 'digest',
    title: '摘要',
    align: 'center',
    width: '100px',
  },
  {
    key: 'views',
    title: '浏览量',
    align: 'center',
    width: '100px',
  },
  {
    key: 'author',
    title: '作者',
    align: 'center',
    width: '100px',
  },
  {
    key: 'updatedAt',
    title: '更新时间',
    align: 'center',
    width: '100px',
  },
  {
    key: 'createdAt',
    title: '创建时间',
    align: 'center',
    width: '100px',
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    fixed: 'right',
    width: '200px',
    render: (row) => {
      return h(NSpace, { justify: 'center' }, [
        h(
          NButton,
          {
            size: 'small',
            onClick: (row) => {
              console.log(row, '编辑');
            },
          },
          { default: () => '编辑' },
        ),
        h(NButton, { size: 'small' }, { default: () => '删除' }),
      ]);
    },
  },
]) as ShallowRef<DataTableColumns<Article>>;
