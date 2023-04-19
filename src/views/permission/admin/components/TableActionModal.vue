<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-500px">
    <n-form ref="formRef" label-placement="left" :label-width="80" :model="formModel" :rules="rules">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="20" label="用户名" path="name">
          <n-input v-model:value="formModel.name" placeholder="请输入用户名称" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="20" label="邮箱" path="email">
          <n-input v-model:value="formModel.email" placeholder="请输入邮箱" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="20" label="手机号" path="phone">
          <n-input v-model:value="formModel.phone" placeholder="请输入手机号" />
        </n-form-item-grid-item>
        <n-form-item-grid-item v-if="type === 'add'" :span="20" label="密码" path="phone">
          <n-input v-model:value="formModel.password" type="password" placeholder="请输入登录密码" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="20" label="头像" path="avatar">
          <n-upload
            action="https://organizer-platform-api.zhouxuanyu.com/upload"
            :default-file-list="fileList"
            list-type="image-card"
            :max="1"
            :on-finish="handleUploadImage"
            :on-remove="handleRemoveImage"
          />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="性别" path="gender">
          <n-radio-group v-model:value="formModel.gender">
            <n-radio v-for="item in genderOptions" :key="item.value" :value="item.value">{{ item.label }}</n-radio>
          </n-radio-group>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="状态" path="status">
          <n-switch v-model:value="formModel.status">
            <template #checked> 正常</template>
            <template #unchecked> 禁用</template>
          </n-switch>
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="end">
        <n-button class="w-72px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" type="primary" @click="handleSubmit">确定</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import type { FormInst, FormItemRule, UploadFileInfo } from 'naive-ui';
import { formRules, createRequiredFormRule } from '@/utils';
import { addAdmin, updateAdmin } from '@/service/api/admin';
import { genderOptions } from '@/constants';

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
  editData?: UserManagement.User | null;
}

export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'success'): void;
}

const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});
const closeModal = () => {
  modalVisible.value = false;
};

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: '添加管理员',
    edit: '编辑管理员'
  };
  return titles[props.type];
});

const fileList = ref<UploadFileInfo[]>([]);

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<UserManagement.User, 'name' | 'password' | 'gender' | 'phone' | 'avatar' | 'email' | 'status'>;

const formModel = reactive<FormModel>(createDefaultFormModel());

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  name: createRequiredFormRule('请输入名称'),
  gender: createRequiredFormRule('请选择性别'),
  phone: formRules.phone,
  email: formRules.email,
  password: createRequiredFormRule('上传头像'),
  avatar: createRequiredFormRule('上传头像'),
  status: createRequiredFormRule('请选择用户状态')
};

function createDefaultFormModel(): FormModel {
  return {
    name: '',
    gender: 1,
    phone: '',
    email: '',
    avatar: '',
    password: '',
    status: true
  };
}

// 头像上传成功
const handleUploadImage = (res: any) => {
  const data: any = JSON.parse(res.event?.currentTarget?.response);
  fileList.value = [
    {
      id: '1',
      name: '头像',
      status: 'finished',
      url: data.result
    }
  ];
  formModel.avatar = data.result;
};

// 移除头像
const handleRemoveImage = () => {
  formModel.avatar = '';
};

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel, model);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      fileList.value = [];
      const defaultFormModel = createDefaultFormModel();
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        fileList.value = [
          {
            id: '1',
            name: '头像',
            url: props.editData.avatar,
            status: 'finished'
          }
        ];
        handleUpdateFormModel(props.editData);
      }
    }
  };

  handlers[props.type]();
}

async function handleSubmit() {
  await formRef.value?.validate();
  if (props.type === 'add') {
    await addAdmin(formModel);
    window.$message?.success('新增成功!');
  } else {
    await updateAdmin(formModel);
    window.$message?.success('更新成功!');
  }
  emit('success');
  closeModal();
}

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType();
    }
  }
);
</script>

<style scoped></style>
