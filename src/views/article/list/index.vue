<script setup lang="tsx">
import { useLoading } from '@/hooks';
import { getArticleList, removeArticle } from '@/service/api/article';
import {
  DataTableColumns,
  NButton,
  NImage,
  NPopconfirm,
  NSpace,
  NTag,
  PaginationProps,
} from 'naive-ui';
import { reactive, ShallowRef, shallowRef } from 'vue';
import ColumnSetting from './components/ColumnSetting.vue';
import { useRouter } from 'vue-router';
import { ArticleColumn } from './type';
import { getCategoryList } from '@/service/api/category';
import { transformSelectOptionTreeArr } from '@/utils/common/transform';

defineOptions({
  name: 'ArticleList',
});

const router = useRouter();
const { loading, startLoading, endLoading } = useLoading(false);
const tableData = shallowRef([]);

const columns: ShallowRef<DataTableColumns<ArticleColumn>> = shallowRef([
  {
    type: 'selection',
    align: 'center',
  },
  {
    key: 'title',
    title: '标题',
    align: 'center',
    width: '200px',
  },
  {
    key: 'categoryId',
    title: '分类',
    align: 'center',
    width: '100px',
    render: (row) => {
      return (
        <NTag type={row.categoryId ? 'success' : 'warning'}>
          {row.categoryId ? row.category?.name : '暂无'}
        </NTag>
      );
    },
  },
  {
    key: 'cover',
    title: '封面图',
    align: 'center',
    width: '100px',
    render: (row) => <NImage src={row.cover} />,
  },
  {
    key: 'digest',
    title: '摘要',
    align: 'center',
    width: '200px',
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
    key: 'status',
    title: '状态',
    align: 'center',
    width: '100px',
    render: (row) => {
      return (
        <NTag type={row.status ? 'success' : 'warning'}>
          {row.status ? '正常' : '禁用'}
        </NTag>
      );
    },
  },
  {
    key: 'updatedAt',
    title: '更新时间',
    align: 'center',
    width: '130px',
    render: (row) => new Date(row.updatedAt as string).toLocaleString(),
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    fixed: 'right',
    width: '200px',
    render: (row) => {
      return (
        <NSpace justify={'center'}>
          <NButton
            size={'small'}
            type="primary"
            text
            onClick={() => handleEditTable(row._id as string)}
          >
            编辑
          </NButton>
          <NPopconfirm
            onPositiveClick={() => handleDeleteTable(row._id as string)}
          >
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton type="error" size={'small'} text>
                  删除
                </NButton>
              ),
            }}
          </NPopconfirm>
        </NSpace>
      );
    },
  },
]) as ShallowRef<DataTableColumns<ArticleColumn>>;

function handleAddTable() {
  router.push({
    name: 'article_add',
  });
}

// 搜索form
const searchForm = reactive<{
  title: string;
  status: string;
  categoryId: string | null;
}>({
  title: '',
  categoryId: null,
  status: '',
});

const categoryOptions = shallowRef([]);
async function getCategoryListData() {
  const res: any = await getCategoryList({
    pageNumber: 1,
    pageSize: 1000,
  });
  categoryOptions.value = transformSelectOptionTreeArr(res.data.items);
}

function handleResetSearchForm() {
  searchForm.title = '';
  searchForm.status = '';
}

async function getTableData() {
  startLoading();
  const { data } = await getArticleList({
    pageNumber: 1,
    pageSize: 10,
    title: searchForm.title,
    status: searchForm.status,
    categoryId: searchForm.categoryId,
  });
  if (data) {
    setTimeout(() => {
      const list = (data as any).items.map((item: any) => ({
        key: item._id,
        ...item,
      }));
      tableData.value = list;
      endLoading();
    }, 1000);
  }
}

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  },
});

// 编辑
function handleEditTable(id: string) {
  router.push({
    name: 'article_add',
    query: {
      id,
    },
  });
}
// 删除
async function handleDeleteTable(id: string) {
  await removeArticle(id);
  window.$message?.success('删除成功!');
  getTableData();
}

getTableData();
getCategoryListData();
</script>

<template>
  <div class="h-full overflow-hidden">
    <n-card :bordered="false" class="rounded shadow-sm mb-4">
      <n-form label-placement="left" :label-width="80" ref="searchFormRef">
        <div class="grid grid-cols-1 gap-x-6 lg:grid-cols-2 xl:grid-cols-4">
          <n-form-item label="文章标题">
            <n-input
              v-model:value="searchForm.title"
              placeholder="请输入文章标题"
              clearable
            />
          </n-form-item>
          <n-form-item label="栏目分类">
            <n-tree-select
              :options="categoryOptions"
              v-model:value="searchForm.categoryId"
              placeholder="请选择分类"
              clearable
            />
          </n-form-item>
          <n-form-item label="状态">
            <n-select
              v-model:value="searchForm.status"
              :options="[
                {
                  label: '正常',
                  value: 'true',
                },
                {
                  label: '禁用',
                  value: 'false',
                },
              ]"
              placeholder="请选择状态"
              clearable
            />
          </n-form-item>
          <n-space>
            <n-button type="primary" @click="getTableData">
              <icon-mdi:magnify class="mr-4px text-20px" />
              搜索
            </n-button>
            <n-button @click="handleResetSearchForm">
              <icon-mdi-refresh
                class="mr-4px text-16px"
                :class="{ 'animate-spin': loading }"
              />
              重置
            </n-button>
          </n-space>
        </div>
      </n-form>
    </n-card>
    <n-card :bordered="false" class="rounded-16px shadow-sm">
      <n-space class="pb-12px" justify="space-between">
        <n-space>
          <n-button type="primary" size="small" @click="handleAddTable">
            <icon-ic-round-plus class="mr-4px text-20px" />
            新增
          </n-button>
        </n-space>
        <n-space align="center" :size="18">
          <n-button size="small" type="primary" @click="getTableData">
            <icon-mdi-refresh
              class="mr-4px text-16px"
              :class="{ 'animate-spin': loading }"
            />
            刷新表格
          </n-button>
          <column-setting v-model:columns="columns" />
        </n-space>
      </n-space>
      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :single-line="false"
        :pagination="pagination"
      />
    </n-card>
  </div>
</template>

<style scoped lang="scss"></style>
