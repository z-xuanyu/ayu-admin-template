const consumer = {
  name: 'consumer',
  path: '/consumer',
  component: 'basic',
  children: [
    {
      name: 'consumer',
      path: '/consumer/index',
      component: 'self',
      meta: {
        title: '用户列表',
        requiresAuth: true,
        icon: 'ic:round-manage-accounts'
      }
    }
  ],
  meta: {
    title: '用户管理',
    icon: 'material-symbols:supervisor-account-outline',
    order: 8
  }
};

export default consumer;
