import React, { useState } from 'react';
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import style from './index.module.scss'

const { Header, Content, Footer, Sider } = Layout;

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
  getItem('首页', '1', <UserOutlined />),
  getItem('科室管理', 'sub1', <UserOutlined />, [
    getItem('科室信息管理', '2', <UserOutlined />),
    getItem('医生岗位迁移', '3', <UserOutlined />),
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

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    // 布局容器
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider breakpoint="lg" collapsedWidth={window.innerWidth < 700 ? 0 : 75} trigger={null} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className={style.logo} />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
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
            items={[
              {
                title: '首页',
                href: '/home',
              },
            ]}
          />
        </Header>
        {/* 内容布局 */}
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            Bill is a cat.
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default View;