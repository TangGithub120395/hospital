import React, { useImperativeHandle, useState } from 'react'
import Login from '../Login'
import head from './index.module.scss'
import { CopyOutlined, SearchOutlined, MoreOutlined, UserAddOutlined, LoginOutlined } from '@ant-design/icons';
import { MenuProps, Button } from 'antd';
import { Input, Dropdown, Col, Row, Space, Popover } from 'antd';

export default function Head(props: any) {
  // 判断阴影是否出现
  const [shadowFlag, setShadowFlag] = useState("")

  useImperativeHandle(props.onRef, () => {
    return {
      func: changeShadowFlag
    }
  });

  // let g: (string | number)[]
  // g = [1, 2, 3, 'ad']
  // let list: Array<string | number>
  // list = [1, 2, 3, 'ad']

  // 修改阴影状态方法
  let changeShadowFlag: (flag: boolean) => void
  changeShadowFlag = (flag) => {
    let change: string = ""
    // flag ? head.headPageShadowStar : head.headPageShadowEnd
    if (flag) {
      change = head.headPageShadowStar
    } else {
      if (shadowFlag != "") {
        change = head.headPageShadowEnd
      } else {
        change = ""
      }
    }
    setShadowFlag(change)
  };

  // 右侧
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div>添加新书签</div>
      ),
    },
    {
      key: '2',
      label: (
        <div>添加新文件夹</div>
      ),
    }
  ];

  // 登录
  const content = (
    <Login />
  );

  return (
    <Row className={`${head.headPage} ${shadowFlag}`}>
      <Col span={8}>
        <div className={head.leftBox}>
          <CopyOutlined className={head.iconStyle} />
          <h1 className={head.titleStyle}>书签</h1>
        </div>
      </Col>
      <Col span={12}>
        <Input className={head.centerBox} size="large" allowClear placeholder="搜索书签" prefix={<SearchOutlined />} />
      </Col>
      <Col span={4}>
        <Space style={{ float: 'right' }}>
          <Popover placement="bottomRight" content={content} trigger="click">
            <Button type="primary" size='large' shape="circle" icon={<UserAddOutlined />} />
          </Popover>
          <Dropdown className={head.rightBox} menu={{ items }} trigger={['click']} placement="bottomRight">
            <MoreOutlined onClick={(e) => e.preventDefault()} style={{ fontSize: '280%' }} />
          </Dropdown>
        </Space>
      </Col>
    </Row>
  )
}
