const system = {
  name: 'material',
  path: '/material',
  component: 'basic',
  children: [
    {
      name: 'material',
      path: '/material/index',
      component: 'self',
      meta: {
        title: '素材中心',
        requiresAuth: true,
        icon: 'ic:round-manage-accounts',
      },
    },
  ],
  meta: {
    title: '素材管理',
    icon: 'carbon:cloud-service-management',
    order: 8,
  },
};

export default system;
