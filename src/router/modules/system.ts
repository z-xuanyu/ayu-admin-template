const system = {
  name: 'system',
  path: '/system',
  component: 'basic',
  children: [
    {
      name: 'system_website',
      path: '/system/website',
      component: 'self',
      meta: {
        title: '网站设置',
        requiresAuth: true,
        icon: 'ic:round-manage-accounts'
      }
    }
  ],
  meta: {
    title: '系统设置',
    icon: 'carbon:cloud-service-management',
    order: 8
  }
};

export default system;
