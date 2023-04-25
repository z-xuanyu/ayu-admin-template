import type { RouteComponent } from 'vue-router';

export const views: Record<
  PageRoute.LastDegreeRouteKey,
  RouteComponent | (() => Promise<{ default: RouteComponent }>)
> = {
  403: () => import('./_builtin/403/index.vue'),
  404: () => import('./_builtin/404/index.vue'),
  500: () => import('./_builtin/500/index.vue'),
  'constant-page': () => import('./_builtin/constant-page/index.vue'),
  login: () => import('./_builtin/login/index.vue'),
  'not-found': () => import('./_builtin/not-found/index.vue'),
  article_add: () => import('./article/add/index.vue'),
  article_list: () => import('./article/list/index.vue'),
  consumer_list: () => import('./consumer/list/index.vue'),
  dashboard_analysis: () => import('./dashboard/analysis/index.vue'),
  dashboard_workbench: () => import('./dashboard/workbench/index.vue'),
  exception_403: () => import('./exception/403/index.vue'),
  exception_404: () => import('./exception/404/index.vue'),
  exception_500: () => import('./exception/500/index.vue'),
  management_auth: () => import('./management/auth/index.vue'),
  management_role: () => import('./management/role/index.vue'),
  management_route: () => import('./management/route/index.vue'),
  material_list: () => import('./material/list/index.vue'),
  permission_admin: () => import('./permission/admin/index.vue'),
  permission_role: () => import('./permission/role/index.vue'),
  plugin_charts_antv: () => import('./plugin/charts/antv/index.vue'),
  plugin_charts_echarts: () => import('./plugin/charts/echarts/index.vue'),
  plugin_copy: () => import('./plugin/copy/index.vue'),
  plugin_editor_markdown: () => import('./plugin/editor/markdown/index.vue'),
  plugin_editor_quill: () => import('./plugin/editor/quill/index.vue'),
  plugin_icon: () => import('./plugin/icon/index.vue'),
  plugin_map: () => import('./plugin/map/index.vue'),
  plugin_print: () => import('./plugin/print/index.vue'),
  plugin_swiper: () => import('./plugin/swiper/index.vue'),
  plugin_video: () => import('./plugin/video/index.vue'),
  report: () => import('./report/index.vue'),
  system_website: () => import('./system/website/index.vue')
};
