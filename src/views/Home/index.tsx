import React, { useState } from 'react';
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import style from './index.module.scss'
import { Outlet, useNavigate } from 'react-router-dom'

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('系统首页', '/index', <UserOutlined />),
  getItem('科室管理', 'sub1', <UserOutlined />, [
    getItem('科室信息管理', '/InformationManagement', <UserOutlined />),
    getItem('医生岗位迁移', '/DoctorJobTransfer', <UserOutlined />),
  ]),
  getItem('医生管理', 'sub2', <UserOutlined />, [
    getItem('医生注册登记', '4', <UserOutlined />),
    getItem('医生信息管理', '5', <UserOutlined />),
  ]),
  getItem('患者信息管理', '6', <UserOutlined />),
  getItem('财务管理', 'sub3', <UserOutlined />, [
    getItem('未缴信息统计', '7', <UserOutlined />),
    getItem('财务信息管理', '8', <UserOutlined />),
  ]),
  getItem('药品管理', 'sub4', <UserOutlined />, [
    getItem('缺货统计', '9', <UserOutlined />),
    getItem('药品出入库', '10', <UserOutlined />),
  ]),
  getItem('系统设置', 'sub5', <UserOutlined />, [
    getItem('个人信息管理', '11', <UserOutlined />),
    getItem('菜单信息管理', '12', <UserOutlined />),
  ]),
];

const View: React.FC = () => {

  // 展开收回菜单
  const [collapsed, setCollapsed] = useState(false);

  // 跳转路由hook
  const navigateTo = useNavigate();

  // 面包屑列表  
  // const nowBreadcrumbList = {
  //   title: '系统首页',
  //   href: '/index',
  // }
  const [nowBreadcrumbList, setNowBreadcrumbList] = useState({title: '系统首页',href: '/index'});
  // 菜单点击事件
  const menuClick = (e: { key: string }) => {
    navigateTo(e.key);
    setNowBreadcrumbList({title: '系统首页',href: e.key})

    // setBreadcrumbList
  }


  // 当前展开菜单
  const [openKeys, setOpenKey] = useState([''])
  // 菜单收缩事件
  const handleOpenChange = (keys: string[]) => {
    setOpenKey([keys[keys.length - 1]])

  }

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    // 布局容器
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider breakpoint="lg" collapsedWidth={window.innerWidth < 700 ? 0 : 75} trigger={null} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className={style.logo} />
        <Menu
          theme="dark"
          defaultSelectedKeys={['/index']}
          mode="inline"
          items={items}
          onClick={menuClick}
          onOpenChange={handleOpenChange}
          openKeys={openKeys}
        />
      </Sider>
      {/* 右侧布局 */}
      <Layout>
        {/* 头部布局 */}
        <Header style={{ padding: 0, background: colorBgContainer }} >
          {/* 收起菜单按钮 */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 50,
              height: 50,
            }}
          />
          {/* 面包屑 */}
          <Breadcrumb
            style={{ margin: ' 0 5px' }}
            separator="/"
            items={[nowBreadcrumbList]}
          />
        </Header>
        {/* 内容布局 */}
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default View;