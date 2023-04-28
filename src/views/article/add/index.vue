<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css';
import { reactive, shallowRef, onBeforeUnmount, onMounted, ref } from 'vue';
import SelectMaterial from '@/components/custom/SelectMaterial.vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { useRouter, useRoute } from 'vue-router';
import { getCategoryList } from '@/service/api/category';
import {
  AddArticleParams,
  UdateArticleParams,
} from '@/service/api/article/type';
import {
  addArticle,
  getArticleInfo,
  updateArticle,
} from '@/service/api/article';

defineOptions({
  name: 'ArticleAdd',
});

const router = useRouter();
const route = useRoute();
const articleId = ref(route.query.id);

const editorRef = shallowRef();
const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

onMounted(() => {
  getCategoryListData();
  articleId.value && getArticleInfoData();
});

async function getArticleInfoData() {
  const info = await getArticleInfo(articleId.value as string);
  console.log(info, '文章信息');
  formModel.value = info.data as AddArticleParams;
}

// 获取
const options = shallowRef([]);
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
async function getCategoryListData() {
  const res: any = await getCategoryList({
    pageNumber: 1,
    pageSize: 1000,
  });
  options.value = TransformTreeArr(res.data.items);
}

const formModel = ref<AddArticleParams>({
  title: '',
  categoryId: null,
  cover: '',
  desc: '',
  digest: '',
  author: '',
  views: 0,
  sort: 0,
  content: '',
  status: true,
});

const rules = reactive({
  title: {
    required: true,
    trigger: 'blur',
    message: '文章标题不能为空',
  },
  categoryId: {
    required: true,
    trigger: 'blur',
    message: '文章分类不能为空',
  },
  content: {
    required: true,
    trigger: 'blur',
    message: '文章内容不能为空',
  },
});

function back() {
  router.back();
}

async function handleSubmit() {
  if (articleId.value) {
    await updateArticle(formModel.value as UdateArticleParams);
    window.$message?.success('更新成功!');
  } else {
    await addArticle(formModel.value);
    window.$message?.success('添加成功！');
  }
  back();
}
</script>

<template>
  <div class="article-add-page">
    <div class="p-4 rounded-md space-x-2 bg-white dark:bg-dark shadow-sm">
      <span class="cursor-pointer" @click="back"
        ><icon-bytesize:arrow-left
      /></span>
      <span class="cursor-pointer" @click="back"> 返回</span>
      <span>|</span>
      <span class="text-lg"> {{ articleId ? '编辑文章' : '添加文章' }}</span>
    </div>
    <div class="mt-4 bg-white dark:bg-dark p-4">
      <n-form
        ref="formRef"
        label-placement="left"
        :label-width="100"
        :model="formModel"
        :rules="rules"
      >
        <div class="flex space-x-4">
          <div class="left">
            <div class="w-96">
              <n-form-item label="文章标题" path="title">
                <n-input
                  type="textarea"
                  placeholder="请输入文章标题"
                  round
                  clearable
                  v-model:value="formModel.title"
                />
              </n-form-item>
            </div>
            <div class="w-96">
              <n-form-item label="文章栏目" path="categoryId">
                <n-tree-select
                  :options="options"
                  v-model:value="formModel.categoryId"
                  placeholder="请选择父级"
                />
              </n-form-item>
            </div>
            <div class="w-96">
              <n-form-item label="文章简介" path="desc">
                <n-input
                  type="textarea"
                  placeholder="请输入文章简介"
                  round
                  clearable
                  v-model:value="formModel.desc"
                />
              </n-form-item>
            </div>
            <div class="w-96">
              <n-form-item label="摘要" path="digest">
                <n-input
                  type="textarea"
                  placeholder="请输入文章摘要"
                  round
                  clearable
                  v-model:value="formModel.digest"
                />
              </n-form-item>
            </div>
            <div class="w-96">
              <n-form-item label="文章封面" path="cover">
                <SelectMaterial v-model:value="formModel.cover" />
              </n-form-item>
            </div>
            <div class="w-96">
              <n-form-item label="作者" path="author">
                <n-input
                  v-model:value="formModel.author"
                  type="text"
                  placeholder="请输入作者名称"
                />
              </n-form-item>
            </div>
            <div class="w-54">
              <n-form-item label="排序" path="sort">
                <n-input-number
                  class="w-full"
                  v-model:value="formModel.sort"
                  clearable
                />
              </n-form-item>
            </div>
            <div class="w-54">
              <n-form-item label="初始浏览量" path="views">
                <n-input-number
                  class="w-full"
                  v-model:value="formModel.views"
                  clearable
                />
              </n-form-item>
            </div>
            <div class="w-96">
              <n-form-item label="文章状态" path="status">
                <n-radio-group
                  v-model:value="formModel.status"
                  name="radiogroup"
                >
                  <n-space>
                    <n-radio :value="true" name="true"> 显示 </n-radio>
                    <n-radio :value="false" name="false"> 隐藏 </n-radio>
                  </n-space>
                </n-radio-group>
              </n-form-item>
            </div>
          </div>
          <!-- 富文本 -->
          <div class="right flex-1">
            <div class="w-full">
              <n-form-item label="文章内容" path="content">
                <div class="h-[650px]">
                  <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editorRef"
                    :defaultConfig="toolbarConfig"
                    mode="default"
                  />
                  <Editor
                    style="
                      height: 100%;
                      overflow-y: hidden;
                      border: 1px solid #ccc;
                    "
                    v-model="formModel.content"
                    :defaultConfig="editorConfig"
                    mode="default"
                    @onCreated="handleCreated"
                  />
                </div>
              </n-form-item>
            </div>
          </div>
        </div>
      </n-form>
    </div>
    <div class="bg-white dark:bg-dark text-center py-4">
      <n-button type="primary" class="px-10" @click="handleSubmit">
        {{ articleId ? '确认更新' : '添加保存' }}
      </n-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.w-e-toolbar) {
  background: inherit !important;
}
:deep(.w-e-text-container) {
  background: inherit;
}
</style>
