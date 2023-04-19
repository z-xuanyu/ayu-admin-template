<script setup lang="ts">
import { ref, h, computed, watchEffect, onMounted } from 'vue';
import type { TreeOption } from 'naive-ui';
import { NIcon } from 'naive-ui';
import { FolderOpen } from '@vicons/ionicons5';
import { getMaterialList, removeMaterial } from '@/service/api/material';
import { getMaterialCategoryList, addMaterialCategory } from '@/service/api/material-category';
import { getServiceEnvConfig } from '~/.env-config';
defineOptions({ name: 'SelectMaterial' });

interface Porps {
  value: string;
}
interface MateriaItem {
  _id: string;
  name: string;
  url: string;
}

interface Emits {
  (e: 'update:value', value: any): void;
}

const props = withDefaults(defineProps<Porps>(), {
  value: ''
});
const emit = defineEmits<Emits>();

const showModal = ref(false);
const defaultValue = ref('');
watchEffect(() => {
  defaultValue.value = props.value;
});

const selectId = ref('');
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const showPopover = ref(false);
const categoryId = ref<string | null>(null);
const categoryName = ref('');

const categoryList = ref<Array<TreeOption>>([]);
const list = ref<Array<MateriaItem>>([]);

const { url } = getServiceEnvConfig(import.meta.env);

onMounted(() => {
  getMaterialCategoryListData();
  getMaterialListData();
});

async function getMaterialListData() {
  const res: any = await getMaterialList({
    pageNumber: page.value,
    pageSize: pageSize.value,
    cid: categoryId.value
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

// 点击选择分类
const handleSelectCategory = (keys: any) => {
  categoryId.value = keys[0];
  getMaterialListData();
};

const handlePositiveClick = async (id: string) => {
  await removeMaterial(id);
  window.$message?.success('删除成功!');
  getMaterialListData();
};

const uploadUrl = computed(() => `${url}/auth/uploadImage/${categoryId.value}`);

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

// 移除默认值
const handleRemovedDefaultValue = () => {
  emit('update:value', '');
};

// 选择图片
const handleSelect = (item: { name: string; _id: string }) => {
  if (selectId.value === item._id) {
    selectId.value = '';
  } else {
    selectId.value = item._id;
  }
};

// 获取选择的素材
const selectVal = computed(() => list.value.find(item => item._id === selectId.value)?.url);

// 取消
const handleClose = () => {
  showModal.value = false;
  selectId.value = '';
};
// 确认
const handleConfirm = () => {
  emit('update:value', selectVal.value);
  handleClose();
};
</script>

<template>
  <div
    v-if="!defaultValue"
    class="w-24 h-24 rounded-md border-dashed border border-gray-300 cursor-pointer flex justify-center items-center"
    @click="showModal = !showModal"
  >
    <div class="flex flex-col items-center text-gray-400">
      <icon-material-symbols:add class="text-2xl" />
      <span>添加</span>
    </div>
  </div>
  <!-- 绑定v-model值 -->
  <div v-if="defaultValue" class="w-24 h-24 relative group cursor-pointer">
    <img :src="defaultValue" class="w-full rounded-md h-full" alt="" />
    <!-- 修改/查看 -->
    <p
      class="absolute bottom-0 right-0 object-cover bg-gray-400 hidden group-hover:block rounded-sm text-center text-white space-x-1 left-0"
    >
      <span @click="showModal = !showModal">修改</span>
      <span>|</span>
      <span>查看</span>
    </p>
    <!-- 移除图片 -->
    <icon-material-symbols:cancel
      class="text-24px text-red cursor-pointer hidden group-hover:block absolute top-0 -right-1"
      @click="handleRemovedDefaultValue"
    />
  </div>
  <div class="select-material">
    <n-modal v-model:show="showModal" to=".select-material">
      <n-card style="width: 900px" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <template #header>
          <div class="py-3 border-b border-gray-300 flex items-center justify-between">
            <span class="ml-4 text-base">选择图片</span>
            <icon-material-symbols:cancel class="text-24px text-red cursor-pointer mr-4" @click="handleClose" />
          </div>
        </template>
        <div class="flex">
          <!-- 分类 -->
          <div class="left w-160px border-r border-gray-300 flex flex-col justify-between">
            <n-tree
              block-line
              :data="categoryList"
              :render-prefix="renderPrefix"
              selectable
              :on-update:selected-keys="handleSelectCategory"
            />
            <div class="border-t border-gray-300 text-center py-2">
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
          <!-- 图片区域 -->
          <div class="flex-1 px-4">
            <div class="flex flex-col h-500px justify-between">
              <!-- 头部 -->
              <div class="flex justify-between items-center my-2">
                <NUpload :action="uploadUrl" :show-file-list="false" :on-finish="handleUploadFinish">
                  <n-button type="primary" size="small"> 本地上传 </n-button>
                </NUpload>
                <div class="space-x-3">
                  <n-input-group>
                    <n-input size="small" placeholder="请输入名称" />
                    <n-button type="primary" size="small"> 搜索 </n-button>
                  </n-input-group>
                </div>
              </div>
              <!-- 素材列表 -->
              <div class="flex-1 overflow-hidden">
                <n-scrollbar>
                  <div class="grid grid-cols-4 gap-3 mt-2">
                    <div v-for="item in list" :key="item._id" class="w-full rounded-sm cursor-pointer">
                      <div class="h-28 group relative" @click="handleSelect(item)">
                        <img class="h-full w-full object-contain rounded-sm bg-gray-200" :src="item.url" />
                        <!-- 删除图片 -->
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
                          class="text-white invisible bg-gray-400 rounded-sm z-10 group-hover:visible px-2 space-x-2 absolute bottom-0 right-0 left-0"
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
                          <span>查看</span>
                        </p>
                        <!-- 选中遮罩 -->
                        <template v-if="selectId === item._id">
                          <div
                            class="mask bg-warm-gray-700 absolute rounded-sm opacity-50 top-0 right-0 bottom-0 left-0"
                          ></div>
                          <icon-material-symbols:check-circle
                            class="text-white text-24px absolute left-1/2 top-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2"
                          />
                        </template>
                      </div>
                      <p class="truncate px-2 mt-1 text-center">{{ item.name }}</p>
                    </div>
                  </div>
                </n-scrollbar>
              </div>
              <!-- 分页 -->
              <div class="flex justify-end my-2">
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
          <!-- 选中区域 -->
          <div class="w-140px border-l border-gray-300 p-3">
            <p class="flex justify-between">
              <span>已选择1/1</span>
              <span class="text-blue-600">清除</span>
            </p>
            <div v-if="selectVal" class="relative mt-2 group mb-2">
              <img class="w-full h-24 object-cover rounded-sm" :src="selectVal" alt="" />
              <!-- 删除图片 -->
              <icon-material-symbols:cancel-outline-rounded
                class="text-24px text-red absolute hidden group-hover:block -top-2 right-0 z-10"
              />
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end space-x-3 border-t p-3 border-gray-300">
            <n-button size="small" @click="handleClose"> 取消 </n-button>
            <n-button type="primary" size="small" @click="handleConfirm"> 确认 </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped lang="scss">
.select-material {
  :deep(.n-tree-node-content) {
    align-items: unset;
    .n-tree-node-content__text {
      margin-top: 2px;
    }
    .n-tree-node-content__prefix {
      margin-right: 16px;
    }
  }
  :deep(.n-card) {
    .n-card-header {
      padding: 0;
    }
    .n-card__content {
      padding: 0;
    }
    .n-card__footer {
      padding: 0;
    }
  }
}
</style>
