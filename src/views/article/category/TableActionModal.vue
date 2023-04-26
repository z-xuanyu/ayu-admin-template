<script setup lang="ts">
import { FormInst } from 'naive-ui';
import { computed, reactive, ref, shallowRef, watch } from 'vue';
import {
  addCategory,
  getCategoryList,
  updateCategory,
} from '~/src/service/api/category';
import { ArticleCategory } from './type';
defineOptions({ name: 'TableActionModal' });
export type ModalType = NonNullable<Props['type']>;
export interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /**
   * 弹窗类型
   * add: 新增
   * edit: 编辑
   */
  type?: 'add' | 'edit';
  /** 编辑的表格行数据 */
  editData?: ArticleCategory | null;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null,
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'success'): void;
}

getCategoryData();

const emit = defineEmits<Emits>();
const formRef = ref<HTMLElement & FormInst>();
const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  },
});
const closeModal = () => {
  modalVisible.value = false;
};

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: '添加分类',
    edit: '编辑分类',
  };
  return titles[props.type];
});

function createDefaultFormModel(): ArticleCategory {
  return {
    name: '',
    pid: null,
    sort: 0,
  };
}
const formModel = reactive<ArticleCategory>(createDefaultFormModel());

const rules = reactive({
  name: {
    required: true,
    trigger: 'blur',
    message: '名称不能为空',
  },
});

// 父级分类树结构
const options = shallowRef([]);
function handleUpdateValue(value: string) {
  formModel.pid = value;
}
function TransformTreeArr(arr = [], pid = null): any {
  if (!Array.isArray(arr)) return;
  return arr
    .filter((item: any) => item.pid == pid)
    .map((childItem: any) =>
      TransformTreeArr(arr, childItem._id).length
        ? {
            key: childItem._id,
            label: childItem.name,
            children: TransformTreeArr(arr, childItem._id),
          }
        : { key: childItem._id, label: childItem.name },
    );
}
async function getCategoryData() {
  const res: any = await getCategoryList({
    pageNumber: 1,
    pageSize: 1000,
  });

  options.value = TransformTreeArr(res.data.items);
}

async function handleSubmit() {
  await formRef.value?.validate();
  if (props.type === 'add') {
    await addCategory(formModel);
    window.$message?.success('新增成功!');
  } else {
    await updateCategory(formModel as any);
    window.$message?.success('更新成功!');
  }
  emit('success');
  closeModal();
}

// 更新/添加 formModel
function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      Object.assign(formModel, defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        Object.assign(formModel, props.editData);
      }
    },
  };

  handlers[props.type]();
}
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      handleUpdateFormModelByModalType();
    }
  },
);
</script>

<template>
  <n-modal
    v-model:show="modalVisible"
    preset="card"
    :title="title"
    class="w-500px"
  >
    <n-form
      ref="formRef"
      label-placement="left"
      :label-width="80"
      :model="formModel"
      :rules="rules"
    >
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="20" label="名称" path="name">
          <n-input v-model:value="formModel.name" placeholder="请输入名称" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="20" label="父级" path="pid">
          <n-tree-select
            :options="options"
            :default-value="formModel.pid"
            @update:value="handleUpdateValue"
            placeholder="请选择父级"
          />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="10" label="排序" path="sort">
          <n-input-number
            class="w-full"
            v-model:value="formModel.sort"
            clearable
          />
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="end">
        <n-button class="w-72px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" type="primary" @click="handleSubmit"
          >确定</n-button
        >
      </n-space>
    </n-form>
  </n-modal>
</template>

<style scoped lang="scss"></style>
