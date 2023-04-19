<template>
  <div>
    <div
      class="search-wrapper rounded-5px shadow-sm bg-white p-4 mb-6 flex items-center space-x-3"
    >
      <div class="flex items-center">
        <span class="mr-4">标题:</span>
        <div class="w-64">
          <n-input
            v-model:value="searchForm.title"
            type="text"
            placeholder="请输入搜索标题"
            clearable
          />
        </div>
      </div>
      <n-button type="primary" @click="handleSearch">
        <icon-material-symbols:search class="mr-4px text-20px" />
        搜索
      </n-button>
    </div>
    <!-- 列表 -->
    <n-card :bordered="false" class="rounded-16px shadow-sm">
      <n-space class="pb-12px" justify="space-between">
        <n-space>
          <n-upload
            :action="uploadUrl"
            :show-file-list="false"
            :on-finish="handleUploadFinish"
            :on-before-upload="handleUploadBefore"
          >
            <n-button size="small" type="primary">{{
              loading ? '导入中...' : '导入数据'
            }}</n-button>
          </n-upload>
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
      <n-data-table :columns="columns" :data="tableData" :loading="loading" />
      <div class="flex justify-end mt-4">
        <n-pagination
          :page="pageNumber"
          :page-size="pageSize"
          :item-count="total"
          :page-sizes="[10, 20, 30, 40]"
          show-size-picker
          :on-update:page="handleChangePage"
          :on-update:page-size="handleChangePageSize"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { useLoading } from '@/hooks';
import { getReportList } from '@/service/api/report';
import { NButton, NPopconfirm, NSpace } from 'naive-ui';
import { computed, h, Ref, ref } from 'vue';
import { getServiceEnvConfig } from '~/.env-config';
import ColumnSetting from './components/ColumnSetting.vue';

const { url } = getServiceEnvConfig(import.meta.env);
const { loading, startLoading, endLoading } = useLoading(false);

const searchForm = ref({
  title: '',
});

const pageNumber = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref<Array<any>>([]);
function setTableData(data: Array<any>) {
  tableData.value = data;
}
const uploadUrl = computed(() => `${url}/upload/xlsx`);

async function getTableData() {
  startLoading();
  const { data } = await getReportList({
    pageNumber: pageNumber.value,
    pageSize: pageSize.value,
    title: searchForm.value.title,
  });
  if (data) {
    setTimeout(() => {
      const list = (data as any).items.map((item: any) => ({
        key: item._id,
        ...item,
      }));
      total.value = (data as any)?.total;
      setTableData(list);
      endLoading();
    }, 1000);
  }
}

const columns: Ref<any> = ref([
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
    key: 'page',
    title: '页码',
    align: 'center',
    width: '100px',
  },
  {
    key: 'figure',
    title: '图表',
    align: 'center',
    width: '100px',
  },
  {
    key: 'singleUser',
    title: '单语言电子版',
    align: 'center',
    width: '100px',
    render: (row: any) =>
      h('span', { class: 'text-red-600' }, { default: () => row.singleUser }),
  },
  {
    key: 'multiUser',
    title: '双语电子版',
    align: 'center',
    width: '100px',
    render: (row: any) =>
      h('span', { class: 'text-red-600' }, { default: () => row.multiUser }),
  },
  {
    key: 'summary',
    title: '内容摘要',
    align: 'center',
    width: '200px',
    render: (row: any) => String(row.summary).substring(0, 50),
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    fixed: 'right',
    width: '100px',
    render: (row: any) => {
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
]);

function handleChangePage(value: number) {
  pageNumber.value = value;
  getTableData();
}

function handleChangePageSize(value: number) {
  pageSize.value = value;
  getTableData();
}

// 处理添加搜索
function handleSearch() {
  pageNumber.value = 1;
  getTableData();
}

// 数据导入前
function handleUploadBefore() {
  startLoading();
}

// 导入成功
const handleUploadFinish = () => {
  getTableData();
  window.$message?.success('数据导入成功!');
};

// 编辑
function handleEditTable(id: string) {
  console.log(id);
}
// 删除
function handleDeleteTable(id: string) {
  console.log(id);
}

function init() {
  getTableData();
}

// 初始化
init();
</script>

<style lang="scss" scoped></style>
