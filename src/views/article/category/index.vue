<script setup lang="tsx">
import { useLoading, useBoolean } from '@/hooks';
import { getCategoryList, removeCategory } from '@/service/api/category';
import {
  DataTableColumns,
  NButton,
  NPopconfirm,
  NSpace,
  NTag,
  PaginationProps,
} from 'naive-ui';
import { reactive, ref, type Ref, shallowRef } from 'vue';
import { ArticleCategory } from './type';
import ColumnSetting from './ColumnSetting.vue';
import TableActionModal from './TableActionModal.vue';
import type { ModalType } from './TableActionModal.vue';
defineOptions({
  name: 'ArticleCategory',
});
const { bool: visible, setTrue: openModal } = useBoolean();
const { loading, startLoading, endLoading } = useLoading(false);
const tableData = shallowRef([]);

const columns: Ref<DataTableColumns<ArticleCategory>> = ref([
  {
    type: 'selection',
    align: 'center',
  },
  {
    key: 'name',
    title: '名称',
    align: 'center',
    width: '100px',
  },
  {
    key: 'pid',
    title: '父级',
    align: 'center',
    width: '100px',
    render: (row) => {
      return (
        <NTag type={row.pid ? 'success' : 'warning'}>
          {row.pid ? row.parent?.name : '暂无'}
        </NTag>
      );
    },
  },
  {
    key: 'articleCount',
    title: '文章数量',
    align: 'center',
    width: '100px',
  },
  {
    key: 'sort',
    title: '排序',
    align: 'center',
    width: '100px',
  },
  {
    key: 'updatedAt',
    title: '更新时间',
    align: 'center',
    width: '100px',
    render: (row) => new Date(row.updatedAt as string).toLocaleString(),
  },
  {
    key: 'createdAt',
    title: '创建时间',
    align: 'center',
    width: '100px',
    render: (row) => new Date(row.createdAt as string).toLocaleString(),
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    fixed: 'right',
    width: '100px',
    render: (row) => {
      return (
        <NSpace justify={'center'}>
          <NButton
            size={'small'}
            type="primary"
            text
            onClick={() => handleEditTable(row._id)}
          >
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row._id)}>
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
]) as Ref<DataTableColumns<ArticleCategory>>;
async function getTableData() {
  startLoading();
  const { data } = await getCategoryList({
    pageNumber: 1,
    pageSize: 10,
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

const modalType = ref<ModalType>('add');
function handleAddTable() {
  openModal();
  setModalType('add');
}
function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<ArticleCategory | null>(null);

function setEditData(data: ArticleCategory | null) {
  editData.value = data;
}

// 编辑
function handleEditTable(rowId: string | undefined) {
  const findItem = tableData.value.find((item: any) => item._id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}

// 删除
async function handleDeleteTable(id: string | undefined) {
  await removeCategory(id as string);
  window.$message?.success('删除成功!');
  getTableData();
}

getTableData();
</script>

<template>
  <div class="h-full overflow-hidden">
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
        :single-line="false"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
      />
    </n-card>
    <table-action-modal
      v-model:visible="visible"
      :type="modalType"
      :edit-data="editData"
      @success="getTableData"
    />
  </div>
</template>

<style scoped lang="scss"></style>
