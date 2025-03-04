import type { NavSectionProps } from 'src/components/nav-section';

import { useMemo } from 'react';

import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales';
import { useGetMenus } from 'src/actions/shared/shared';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};
export function getNavData(): any {
  const getMenuIcon = (entryName: string): JSX.Element | null => {
    switch (entryName) {
      case 'Security':
        return <Iconify icon="mdi:security-lock" />;
      case 'الأمان':
        return <Iconify icon="mdi:security-lock" />;
      case 'Workflow':
        return <Iconify icon="mdi:workflow" />;
      case 'سير العمل':
        return <Iconify icon="mdi:workflow" />;
      case 'الموارد البشرية':
        return <Iconify icon="mdi:account-multiple" />;
      case 'Human Resources':
        return <Iconify icon="mdi:account-multiple" />;
      case 'Settings':
      case 'الإعدادات':
        return <Iconify icon="mdi:settings" />;
      default:
        return null;
    }
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { menus, menusLoading, menusValidating } = useGetMenus('EN');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslate();
  const generateNavItems = (item: any) => {
    const children = item.childs.map((child: any) => ({
      title: t(child.entryName),
      path: `/${child.functionPath}`,
    }));
    return {
      title: t(item.entryName),
      path: item.functionPath ? `/${item.functionPath}` : '/',
      icon: getMenuIcon(item.entryName),
      ...(children.length > 0 && { children }),
    };
  };
}
// ----------------------------------------------------------------------

export function navData(): NavSectionProps['data'] {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslate();

  const getMenuIcon = (entryName: string): JSX.Element | null => {
    switch (entryName) {
      case 'Security':
        return <Iconify icon="mdi:security-lock" />;
      case 'الأمان':
        return <Iconify icon="mdi:security-lock" />;
      case 'Workflow':
        return <Iconify icon="mdi:workflow" />;
      case 'سير العمل':
        return <Iconify icon="mdi:workflow" />;
      case 'الموارد البشرية':
        return <Iconify icon="mdi:account-multiple" />;
      case 'Human Resources':
        return <Iconify icon="mdi:account-multiple" />;
      case 'Settings':
      case 'الإعدادات':
        return <Iconify icon="mdi:settings" />;
      default:
        return null;
    }
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { menus, menusLoading, menusValidating } = useGetMenus('EN');
  const generateNavItems = (item: any) => {
    const children = item.childs.map((child: any) => ({
      title: t(child.entryName),
      path: `/${child.functionPath}`,
    }));
    return {
      title: t(item.entryName),
      path: item.functionPath ? `/${item.functionPath}` : '/',
      icon: getMenuIcon(item.entryName),
      ...(children.length > 0 && { children }),
    };
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data: any = useMemo(() => {
    if (menusLoading || !menus) {
      return [{ subheader: '', items: [] }];
    }
    return [
      {
        subheader: '',
        items: menus.map(generateNavItems),
      },
    ];
  }, [menus, menusLoading, t]);
  return data;
}
