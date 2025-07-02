import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'KPI', title: 'KPI', href: paths.dashboard.KPI, icon: 'chart-pie' },
  // { key: 'customers', title: 'Адаптация сотрудников', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Сотрудники', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'hiring', title: 'Управление наймом', href: paths.dashboard.hiring, icon: 'x-square' },
  { key: 'settings', title: 'Настройки', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Аккаунт', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
