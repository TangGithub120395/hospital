import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Avatar, message } from 'antd';
import {
  AntDesignOutlined,
} from '@ant-design/icons';
import style from './index.module.scss'

// 路由
import { useNavigate } from 'react-router-dom'

// 引入cookie
import cookie from 'react-cookies'

const items: MenuProps['items'] = [
  {
    label: '修改个人信息',
    key: '0',
  },
  {
    type: 'divider',
  },
  {
    label: '退出登录',
    key: '1',
  },
];
const App: React.FC = () => {
  // 拿路由hook
  let navigateTo = useNavigate();
  // 获取用户名
  let userName
  const user = cookie.load('userData')
  if (user.userIdentity == 1) {
    userName = '管理员 ' + user.adminName + " "
  } else if (user.userIdentity == 2) {
    userName = '医生 ' + user.doctorName + " "
  } else if (user.userIdentity == 3) {
    userName = '患者 ' + user.patientName + " "
  }

  // 点击事件
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '0') {
      const nowRouter = "/personalInformationManagement"
      // 跳转
      navigateTo(nowRouter)
    } else if (key === '1') {
      // 存储用户信息
      cookie.remove('userData')
      // 跳转
      // navigateTo("/login")
      // message.success("退出登录成功!")
      window.location.href = '/login'; // 跳转到当前路由
      window.location.reload(); // 刷新页面
    }
  };
  return (
    <div>
      <Dropdown menu={{ items, onClick }} trigger={['click']} className={style.allPage} >
        <a onClick={(e) => e.preventDefault()}>
          <Avatar style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
          <div style={window.innerWidth < 700 ? { display: 'none' } : { margin: '0 10px' }}>欢迎{userName}登录!</div>
          <DownOutlined style={window.innerWidth < 700 ? { display: 'none' } : {}} />
        </a>
      </Dropdown>
    </div>
  )
}

export default App;