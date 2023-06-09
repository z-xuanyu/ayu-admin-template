<template>
  <div class="admin-page">
    <n-card :bordered="false" class="rounded shadow-sm mb-4">
      <n-form label-placement="left" :label-width="60">
        <div class="grid grid-cols-1 gap-x-6 lg:grid-cols-2 xl:grid-cols-4">
          <n-form-item label="用户名">
            <n-input placeholder="请输入用户名称" />
          </n-form-item>
          <n-form-item label="邮箱">
            <n-input placeholder="请输入邮箱" />
          </n-form-item>
          <n-form-item label="手机号">
            <n-input placeholder="请输入手机号" />
          </n-form-item>
          <n-form-item label="性别">
            <n-select
              :options="[
                {
                  label: '男',
                  value: 0,
                },
                {
                  label: '女',
                  value: 1,
                },
              ]"
              placeholder="请选择性别"
              clearable
            />
          </n-form-item>
          <n-form-item label="状态">
            <n-select
              :options="[
                {
                  label: '正常',
                  value: 0,
                },
                {
                  label: '禁用',
                  value: 1,
                },
              ]"
              placeholder="请选择状态"
              clearable
            />
          </n-form-item>
          <n-space>
            <n-button type="primary">
              <icon-mdi:magnify class="mr-4px text-20px" />
              搜索
            </n-button>
            <n-button>
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
        :pagination="pagination"
      />
      <table-action-modal
        v-model:visible="visible"
        :type="modalType"
        :edit-data="editData"
        @success="getTableData"
      />
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NAvatar, NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { useBoolean, useLoading } from '@/hooks';
import { getAdminList, romoveAdmin } from '@/service/api/admin';
import TableActionModal from './components/TableActionModal.vue';
import type { ModalType } from './components/TableActionModal.vue';
import ColumnSetting from './components/ColumnSetting.vue';

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();

const tableData = ref<UserManagement.User[]>([]);
function setTableData(data: Array<any>) {
  tableData.value = data;
}

async function getTableData() {
  startLoading();
  const { data } = await getAdminList();
  if (data) {
    setTimeout(() => {
      const list = (data as any).items.map((item: any) => ({
        key: item._id,
        ...item,
      }));
      setTableData(list);
      endLoading();
    }, 1000);
  }
}

const columns: Ref<DataTableColumns<UserManagement.User>> = ref([
  {
    type: 'selection',
    align: 'center',
  },
  {
    key: 'name',
    title: '用户名',
    align: 'center',
    width: '200px',
  },
  {
    key: 'avatar',
    title: '头像',
    align: 'center',
    width: '100px',
    render: (row) => {
      return <NAvatar round size="small" src={row.avatar} />;
    },
  },
  {
    key: 'gender',
    title: '性别',
    align: 'center',
    width: '100px',
    render: (row) => {
      return (
        <NTag type={Number(row.gender) === 1 ? 'success' : 'warning'}>
          {Number(row.gender) === 1 ? '男' : '女'}
        </NTag>
      );
    },
  },

  {
    key: 'email',
    title: '邮箱',
    align: 'center',
    width: '200px',
  },
  {
    key: 'phone',
    title: '手机号码',
    align: 'center',
    width: '200px',
    render: (row) => row.phone || '无设置',
  },
  {
    key: 'status',
    title: '状态',
    align: 'center',
    width: '100px',
    render: (row) => {
      return (
        <NTag type={row.status ? 'success' : 'error'}>
          {row.status ? '正常' : '禁用'}
        </NTag>
      );
    },
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
          <NButton size={'small'} onClick={() => handleEditTable(row._id)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row._id)}>
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton type="error" size={'small'}>
                  删除
                </NButton>
              ),
            }}
          </NPopconfirm>
        </NSpace>
      );
    },
  },
]) as Ref<DataTableColumns<UserManagement.User>>;

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<UserManagement.User | null>(null);

function setEditData(data: UserManagement.User | null) {
  editData.value = data;
}

function handleAddTable() {
  openModal();
  setModalType('add');
}

function handleEditTable(rowId: string | undefined) {
  const findItem = tableData.value.find((item) => item._id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}

async function handleDeleteTable(rowId: string | undefined) {
  await romoveAdmin(rowId);
  window.$message?.success('删除成功!');
  getTableData();
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

getTableData();
</script>

<style scoped></style>
