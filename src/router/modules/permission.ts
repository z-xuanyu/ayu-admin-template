const permission = {
  name: 'permission',
  path: '/permission',
  component: 'basic',
  children: [
    {
      name: 'permission_admin',
      path: '/permission/admin',
      component: 'self',
      meta: {
        title: '管理员',
        requiresAuth: true,
        icon: 'ic:round-manage-accounts'
      }
    }
  ],
  meta: {
    title: '权限管理',
    icon: 'carbon:cloud-service-management',
    order: 8
  }
};

export default permission;
