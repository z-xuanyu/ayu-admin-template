<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import WangEditor from 'wangeditor';
import { createRequiredFormRule } from '@/utils';
import SelectMaterial from '@/components/custom/SelectMaterial.vue';

interface FormModel {
  name: string;
  phone?: string;
  email?: string;
  avatar: string;
}

const formModel = reactive<FormModel>(createDefaultFormModel());

const rules = {
  name: createRequiredFormRule('请输入名称'),
  avatar: createRequiredFormRule('上传头像')
};

function createDefaultFormModel(): FormModel {
  return {
    name: '',
    phone: '',
    email: '',
    avatar: ''
  };
}

const fileList = ref<UploadFileInfo[]>([]);
const handleUploadImage = () => {
  console.log(4);
};
const handleRemoveImage = () => {
  console.log(5154);
};

const editor = ref<WangEditor>();
const domRef = ref<HTMLElement>();

function renderWangEditor() {
  editor.value = new WangEditor(domRef.value);
  setEditorConfig();
  editor.value.create();
}

function setEditorConfig() {
  if (editor.value?.config?.zIndex) {
    editor.value.config.zIndex = 10;
  }
}

onMounted(() => {
  renderWangEditor();
});
</script>

<template>
  <div class="website-page">
    <div class="bg-white rounded-md p-4">
      <h3 class="text-lg mb-6">PC端设置</h3>
      <div class="w-full md:w-1/2 lg:w-1/3">
        <n-form ref="formRef" label-placement="left" :label-width="120" :model="formModel" :rules="rules">
          <n-grid :cols="24">
            <n-form-item-grid-item :span="24" label="PC端LOGO" path="avatar">
              <div class="w-full">
                <SelectMaterial v-model:value="formModel.avatar" />
                <p class="text-xxs text-gray-400 mt-2">建议尺寸：120*28px，支持jpg，jpeg，png格式</p>
              </div>
            </n-form-item-grid-item>
            <n-form-item-grid-item :span="24" label="网站标题" path="name">
              <n-input v-model:value="formModel.name" placeholder="请输入PC网站标题" />
            </n-form-item-grid-item>
            <n-form-item-grid-item :span="24" label="网站图标" path="avatar">
              <div class="w-full">
                <n-upload
                  action="https://organizer-platform-api.zhouxuanyu.com/upload"
                  :default-file-list="fileList"
                  list-type="image-card"
                  :max="1"
                  :on-finish="handleUploadImage"
                  :on-remove="handleRemoveImage"
                />
                <p class="text-xxs text-gray-400 mt-2">建议尺寸：100*100像素，支持jpg，jpeg，png格式</p>
              </div>
            </n-form-item-grid-item>

            <n-form-item-grid-item :span="24" label="网站描述" path="email">
              <n-input v-model:value="formModel.email" placeholder="请输入PC端网站描述" />
            </n-form-item-grid-item>
            <n-form-item-grid-item :span="24" label="网站关键词" path="phone">
              <n-input v-model:value="formModel.phone" placeholder="请输入PC端网站关键词" />
            </n-form-item-grid-item>
          </n-grid>
        </n-form>
      </div>
    </div>
    <!-- 备案信息 -->
    <div class="bg-white rounded-md p-4 mt-6">
      <h3 class="text-md mb-6">站点底部版权备案信息设置</h3>
      <div class="w-full md:w-1/2 lg:w-1/3">
        <n-form ref="formRef" label-placement="left" :label-width="120" :model="formModel" :rules="rules">
          <n-grid :cols="24">
            <n-form-item-grid-item :span="24" label="显示内容" path="email">
              <n-input v-model:value="formModel.email" placeholder="请输入内容 ，例如： ICP备案号" />
            </n-form-item-grid-item>
            <n-form-item-grid-item :span="24" label="网站关键词" path="phone">
              <n-input v-model:value="formModel.phone" placeholder="请输入链接，例如：http://www.beian.gov.cn" />
            </n-form-item-grid-item>
          </n-grid>
        </n-form>
      </div>
    </div>
    <!-- 隐私协议 -->
    <div class="bg-white rounded-md mt-6 pb-6">
      <h3 class="text-md p-4 border-b border-gray-200">服务协议</h3>
      <div class="p-4 flex items-center w-full xl:w-1/2">
        <span class="mr-4">协议名称 </span>
        <n-input v-model:value="formModel.phone" class="flex-1" placeholder="请输入协议标题" />
      </div>
      <div class="w-full xl:w-1/2 p-4 h-400px">
        <div ref="domRef" class="bg-white h-full dark:bg-dark"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
