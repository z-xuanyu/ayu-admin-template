<script setup lang="ts">
import { ref, h, onMounted, computed } from 'vue';
import type { TreeOption } from 'naive-ui';
import { NIcon, NUpload } from 'naive-ui';
import { FolderOpen } from '@vicons/ionicons5';
import { getMaterialList, removeMaterial } from '@/service/api/material';
import { getMaterialCategoryList, addMaterialCategory } from '@/service/api/material-category';
import { getServiceEnvConfig } from '~/.env-config';

interface MateriaItem {
  _id: string;
  name: string;
  url: string;
}

const { url } = getServiceEnvConfig(import.meta.env);

const tabName = ref('image');
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const showPopover = ref(false);
const categoryId = ref<string | null>(null);
const categoryName = ref('');

const categoryList = ref<Array<TreeOption>>([]);
const list = ref<Array<MateriaItem>>([]);

onMounted(() => {
  getMaterialCategoryListData();
  getMaterialListData();
});

async function getMaterialListData() {
  const res: any = await getMaterialList({
    pageNumber: page.value,
    pageSize: pageSize.value,
    cid: categoryId.value,
    type: tabName.value
  });
  list.value = res.data.items;
  total.value = res.data.total;
}

async function getMaterialCategoryListData() {
  const res: any = await getMaterialCategoryList();
  categoryList.value = res.data.map((item: any) => ({
    key: item._id,
    label: item.name
  }));
  categoryList.value.unshift({
    key: 'null',
    label: '全部文件'
  });
}

// 添加素材分类
async function handleAddMaterialCategory() {
  await addMaterialCategory({
    name: categoryName.value
  });
  // eslint-disable-next-line require-atomic-updates
  categoryName.value = '';
  window.$message?.success('分组添加成功!');
  showPopover.value = false;
  getMaterialCategoryListData();
}

// tab 改变
const handleTabs = (value: string) => {
  tabName.value = value;
  getMaterialListData();
};

// 点击选择分类
const handleSelectCategory = (keys: any) => {
  categoryId.value = keys[0];
  getMaterialListData();
};

const uploadUrl = computed(() => {
  return tabName.value === 'image'
    ? `${url}/auth/uploadImage/${categoryId.value}`
    : `${url}/auth/uploadVideo/${categoryId.value}`;
});
// 是否全选
const allCheck = ref(false);
// 素材上传成功
const handleUploadFinish = () => {
  getMaterialListData();
  window.$message?.success('上传成功!');
};
function renderPrefix() {
  return h(
    NIcon,
    { text: true, type: 'primary' },
    { default: () => h(FolderOpen, { class: 'text-yellow-300 text-2xl' }) }
  );
}

const handlePositiveClick = async (id: string) => {
  await removeMaterial(id);
  window.$message?.success('删除成功!');
  getMaterialListData();
};
</script>

<template>
  <div class="p-4 bg-white rounded-md shadow-sm material-page">
    <n-tabs type="line" animated :on-update:value="handleTabs">
      <n-tab-pane name="image" tab="图片"></n-tab-pane>
      <n-tab-pane name="video" tab="视频"></n-tab-pane>
    </n-tabs>
    <div class="flex">
      <div class="left md:w-200px w-140px h-70vh border-r border-gray-300 flex flex-col justify-between">
        <n-tree
          block-line
          :data="categoryList"
          :render-prefix="renderPrefix"
          selectable
          :on-update:selected-keys="handleSelectCategory"
        />
        <div class="border-t border-gray-300 text-center pt-3">
          <n-popover trigger="click" :show="showPopover">
            <template #trigger>
              <n-button size="small" @click="showPopover = !showPopover">添加分组</n-button>
            </template>
            <n-input-group>
              <n-input v-model:value="categoryName" size="small" placeholder="请输入名称" />
              <n-button type="primary" size="small" @click="handleAddMaterialCategory"> 确认 </n-button>
            </n-input-group>
          </n-popover>
        </div>
      </div>
      <div class="flex-1 px-4">
        <div class="flex flex-col h-70vh justify-between">
          <!-- 头部 -->
          <div class="md:flex justify-between items-center">
            <div class="space-x-3 flex items-center">
              <NUpload :action="uploadUrl" :show-file-list="false" :on-finish="handleUploadFinish">
                <n-button type="primary" size="small"> 本地上传 </n-button>
              </NUpload>
              <n-button size="small"> 删除 </n-button>
              <n-button size="small"> 移动 </n-button>
            </div>
            <div class="space-x-3 mt-2 md:mt-0">
              <n-input-group>
                <n-input size="small" placeholder="请输入名称" />
                <n-button type="primary" size="small"> 搜索 </n-button>
              </n-input-group>
            </div>
          </div>
          <div class="my-2">
            <n-checkbox v-model:checked="allCheck"> 当页全选 </n-checkbox>
          </div>
          <!-- 素材列表 -->
          <div class="flex-1 overflow-hidden">
            <n-scrollbar>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-10 gap-3 mt-2">
                <div v-for="item in list" :key="item._id" class="w-full rounded-sm group cursor-pointer relative">
                  <div class="h-28 group relative">
                    <n-image class="h-full w-full object-contain rounded-sm bg-gray-200" :src="item.url" />

                    <n-popconfirm @positive-click="handlePositiveClick(item._id)">
                      <template #trigger>
                        <!-- 删除图片 -->
                        <icon-material-symbols:cancel-outline-rounded
                          class="text-24px text-red absolute hidden group-hover:block -top-2 right-0 z-10"
                        />
                      </template>
                      您确认要删除改素材吗?
                    </n-popconfirm>
                    <!-- 操作按钮 -->
                    <p
                      class="text-white invisible text-center bg-gray-400 rounded-sm z-10 group-hover:visible px-2 space-x-1 absolute bottom-0 right-0 left-0"
                    >
                      <n-popover trigger="click">
                        <template #trigger>
                          <span>重命名</span>
                        </template>
                        <n-input-group>
                          <n-input size="small" placeholder="请输入名称" />
                          <n-button type="primary" size="small"> 确认 </n-button>
                        </n-input-group>
                      </n-popover>
                      <span>|</span>
                      <span>查看</span>
                    </p>
                  </div>
                  <p class="truncate text-center">{{ item.name }}</p>
                </div>
              </div>
              <!-- 空数据 -->
              <div v-if="!list.length">
                <n-empty size="huge" description="暂无没有素材文件,请上传!" class="mt-20"> </n-empty>
              </div>
            </n-scrollbar>
          </div>
          <!-- 分页 -->
          <div class="md:flex justify-between items-center mt-2">
            <div class="space-x-3 mb-2 md:mb-0">
              <n-checkbox v-model:checked="allCheck"> 当页全选 </n-checkbox>
              <n-button size="small"> 删除 </n-button>
              <n-button size="small"> 移动 </n-button>
            </div>
            <n-pagination
              v-model:page="page"
              v-model:page-size="pageSize"
              :page-count="total"
              show-size-picker
              size="small"
              :page-sizes="[10, 20, 30, 40]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.material-page {
  :deep(.n-tree-node-content) {
    align-items: unset;
    .n-tree-node-content__text {
      margin-top: 2px;
    }
    .n-tree-node-content__prefix {
      margin-right: 16px;
    }
  }
}
</style>
