const article = {
  name: 'article',
  path: '/article',
  component: 'basic',
  meta: {
    title: '文章管理',
    icon: 'carbon:cloud-service-management',
    order: 2,
  },
  children: [
    {
      name: 'article_category',
      path: '/article/category',
      component: 'self',
      meta: {
        title: '栏目分类',
        requiresAuth: true,
        icon: 'ic:round-manage-accounts',
      },
    },
    {
      name: 'article_list',
      path: '/article/list',
      component: 'self',
      meta: {
        title: '文章列表',
        requiresAuth: true,
        icon: 'ic:round-manage-accounts',
      },
    },
    {
      name: 'article_add',
      path: '/article/add',
      component: 'self',
      meta: {
        title: '添加',
        requiresAuth: true,
        hide: true,
        icon: 'ic:round-manage-accounts',
      },
    },
  ],
};

export default article;
