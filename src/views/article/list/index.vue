<script setup lang="ts">
import { useLoading } from '@/hooks';
import { getArticleList } from '@/service/api/article';
import { PaginationProps } from 'naive-ui';
import { reactive, shallowRef } from 'vue';
import { columns } from './columns.data';
import ColumnSetting from './components/ColumnSetting.vue';

defineOptions({
  name: 'ArticleList',
});

const { loading, startLoading, endLoading } = useLoading(false);
const tableData = shallowRef([]);

function handleAddTable() {}

async function getTableData() {
  startLoading();
  const { data } = await getArticleList({
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
</script>

<template>
  <div class="h-full overflow-hidden">
    <n-card title="文章管理" :bordered="false" class="rounded-16px shadow-sm">
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
    </n-card>
  </div>
</template>

<style scoped lang="scss"></style>
