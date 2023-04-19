const report = {
  name: 'report',
  path: '/report',
  component: 'basic',
  children: [
    {
      name: 'report',
      path: '/report/index',
      component: 'self',
      meta: {
        title: '报告列表',
        requiresAuth: true,
        icon: 'ic:round-manage-accounts',
      },
    },
  ],
  meta: {
    title: '报告管理',
    icon: 'carbon:cloud-service-management',
    order: 2,
  },
};

export default report;
