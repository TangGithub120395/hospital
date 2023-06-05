import React, { ChangeEvent, useRef, useState } from 'react';
import type {MutableRefObject} from 'react'
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Space, Form, Input, Col, Row } from 'antd';


const View: React.FC = () => {

  // 设置表单ref
  const loginForm:MutableRefObject<any> = useRef()

  // 登陆注册标志
  const [flag, setFlag] = useState("登录");

  // 改变状态
  const changeFlag = () => {
    flag === '登录' ? setFlag("注册") : setFlag("登录")
    // 重置表单
    loginForm.current.resetFields()
  }

  // 登陆注册控制
  let checkPassword
  if (flag === "注册") {
    checkPassword = <Form.Item
      name="checkPassword"
      rules={[
        {
          required: true,
          message: '两次输入密码不一致！',
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('两次输入密码不一致'));
          },
        }),
      ]}
    >
      <Input.Password placeholder='请确认密码' />
    </Form.Item>
  }

  // 登录注册按钮控制
  let flagBtn
  if (flag === "注册") {
    flagBtn = <Space style={{ float: 'right' }}>
      <Button
        type="primary"
        icon={<ReloadOutlined />}
        htmlType="reset"
      />
      <Button type="primary" htmlType="submit">确定</Button>
      <Button onClick={changeFlag}>登录</Button>
    </Space>
  } else {
    flagBtn = <Space style={{ float: 'right' }}>
      <Button
        type="primary"
        icon={<ReloadOutlined />}
        htmlType="reset"
      />
      <Button type="primary" htmlType="submit">登录</Button>
      <Button onClick={changeFlag}>注册</Button>
    </Space>
  }

  // 登录按钮
  const onFinish = (values: object) => {
    if (flag === "登录") {
      console.log('登录:', values);
    } else {
      console.log('注册:', values);
    }
  }


  // 视图渲染
  return (
    <div style={{ padding: '0px 10px 10px 10px ', width: '280px' }}>
      <h1 style={{ fontWeight: '600', marginBottom: '10px', fontSize: '16px', color: "#444" }}>用户{flag}</h1>
      <Form
        ref={loginForm}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 0 }}
        initialValues={{ username: "", password: "", checkPassword: "" }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入手机号！' }]}
        >
          <Input placeholder='请输入手机号' />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password placeholder='请输入密码' />
        </Form.Item>
        {checkPassword}
        <Row>
          <Col span={24} offset={0}>
            {flagBtn}
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default View;