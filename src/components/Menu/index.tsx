import React from 'react';
import { FolderOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import menu from './index.module.scss'

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('书签栏', 'sub1', <FolderOutlined />, [
    getItem('默认文件夹', '1', <FolderOutlined />),
    getItem('react', '2', <FolderOutlined />),
  ]),

  getItem('其他书签', 'sub2', <FolderOutlined />),

];

const App: React.FC = () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  return (
    <div className={menu.menuPage}>
      <Menu
        onClick={onClick}
        style={{ width: '100%'}}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default App;