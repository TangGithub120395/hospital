import React, { useState } from 'react'
import style from './index.module.scss'
import { Card, Button, Checkbox, Form, Input, message } from 'antd';
import {
  RedoOutlined,
  CheckOutlined,
  SendOutlined
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom'

// 引入cookie
import cookie from 'react-cookies'

// 拿接口
import { RegisterAPI, LoginAPI } from "@/apis/api.ts";

import { CheckboxChangeEvent } from 'antd/es/checkbox';

export default function View() {

  // 拿路由hook
  let navigateTo = useNavigate();

  // 登陆注册标志
  const [flag, setFlag] = useState(true);
  // 记住我标志
  const [remember, setRemember] = useState(true);
  // 重置
  const [reset, setReset] = useState(false);

  // 登录缓存
  let login = {
    tel: "",
    password: ""
  }
  // 检查有无登录缓存
  let user = JSON.parse(localStorage.getItem("userData")!)
  if (user) {
    login = user
  }

  // 切换患者注册
  const changeType = () => {
    flag ? setFlag(false) : setFlag(true)
    onReset()
  }
  // 控制检查密码框显示
  let checkPassword
  if (!flag) {
    checkPassword =
      <Form.Item
        label="确认密码"
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '请确认密码！',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入密码不相同！'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="请确认密码" />
      </Form.Item>
  }

  // 记住我选择框
  const onChange = (e: CheckboxChangeEvent) => {
    setRemember(e.target.checked)
  };

  // 请求成功
  const onFinish = async (values = { tel: "", password: "", userIdentity: 3 }) => {
    if (flag) {
      // 发起登录请求
      const loginAPIRes: LoginAPIRes = await LoginAPI(values)
      // 提示
      if (loginAPIRes.code === 0) {
        message.success(loginAPIRes.msg)
        // 存储用户信息
        cookie.save('userData', loginAPIRes.data, { path: "/" })
        // 跳转
        navigateTo("/index")
      } else {
        message.error(loginAPIRes.msg);
      }
    } else {
      // 发起注册请求
      const registerAPIRes: RegisterAPIRes = await RegisterAPI({
        patientTel: values.tel,
        patientPassword: values.password,
        userIdentity: 3
      })
      // 提示
      registerAPIRes.code === 0 ? message.success(registerAPIRes.msg) : message.error(registerAPIRes.msg);
      // 切换登录状态
      changeType()
    }
    // 是否选择记住我
    if (remember) {
      localStorage.setItem('userData', JSON.stringify(values));
    } else {
      localStorage.removeItem('userData');
    }
  };

  // 登录失败
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // 重置表单
  const onReset = () => {
    setReset(true);
    setTimeout(() => {
      form.resetFields();
    }, 1);
  };

  const [form] = Form.useForm();

  return (
    <div className={style.allPage}>
      <div className={style.loginBox}>
        <div className={style.title}>某医院门诊诊疗系统</div>
        <Card title="系统登录" bordered={false} className={style.loginCard}>
          <Form
            name="basic"
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              initialValue={reset ? "" : login.tel}
              label="手机号"
              name="tel"
              rules={[{ required: true, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入正确格式的手机号！' }]}
              hasFeedback
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>

            <Form.Item
              initialValue={reset ? "" : login.password}
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>

            {checkPassword}

            <Form.Item valuePropName="checked" wrapperCol={{ offset: 6, span: 18 }}>
              <Checkbox checked={remember} onChange={onChange}>记住我</Checkbox>
              <Button type="text" style={{ color: '#1677ff' }} onClick={changeType}>患者{flag ? "注册" : "登录"}</Button>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <Button type="primary" htmlType="submit">
                {/* <CheckOutlined /> */}
                <SendOutlined />
                {flag ? "登录" : "注册"}
              </Button>
              <Button htmlType="button" onClick={onReset} style={{ marginLeft: "10px" }}>
                <RedoOutlined />
                重置
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <div className={style.bottomBox}>
          <div>© HOSPITALSM</div>
          <div>CREATE ❤ BY DYULOON</div>
        </div>
      </div>
    </div>
  )
}
