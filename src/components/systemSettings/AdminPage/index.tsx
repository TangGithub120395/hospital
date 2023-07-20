import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Col, Descriptions, Divider, Form, Input, Modal, Row, Space, message, theme } from 'antd';
import { findAdminByIdAPI, updateAdminAPI } from "../../../apis/api";
// 引入cookie
import cookie from 'react-cookies'
import { RedoOutlined, CheckOutlined, ExclamationCircleFilled } from '@ant-design/icons';

// 类型接口定义
interface AdminDataType {
  adminId: number;
  adminTel: string;
  adminPassword: string;
  adminName: string;
  userIdentity: number;
  createTime: string;
  updateTime: string;
  checkPassword?: string
}

const App: React.FC = () => {
  // 拿cookie
  let userData = cookie.load("userData")

  // 主题
  const { token } = theme.useToken();
  const formStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 20,
  };

  // 管理员信息
  const [adminData, setAdminData] = useState<AdminDataType>();
  const [changeForm, setChangeForm] = useState<ReactNode>();

  // 根据id查管理员
  const findAdmin = async () => {
    const { data } = await findAdminByIdAPI(userData.adminId)
    // 存储用户信息
    cookie.save('userData', data as AdminDataType, { path: "/" })
    setAdminData(data as AdminDataType)
    setChangeForm(
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={data as AdminDataType}
        autoComplete="off"
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xl={5} md={6} sm={24} style={{ width: '100%' }} >
            <Form.Item
              label="管理员ID"
              name="adminId"
            >
              <Input allowClear disabled />
            </Form.Item>
          </Col>
          <Col xl={5} md={6} sm={24} style={{ width: '100%' }} >
            <Form.Item
              label="姓名"
              name="adminName"
            >
              <Input allowClear placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col xl={5} md={6} sm={24} style={{ width: '100%' }} >
            <Form.Item
              label="电话号码"
              name="adminTel"
            >
              <Input allowClear placeholder="请输入电话号码" />
            </Form.Item>
          </Col>
          <Col xl={9} md={6} sm={24} >
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                  确定
                </Button>
                <Button htmlType="button" onClick={() => form.resetFields()} icon={<RedoOutlined />}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }

  // 调接口
  useEffect(() => {
    findAdmin()
  }, [])

  // 表单
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const { confirm } = Modal;

  // 提交表单
  const onFinish = (values: AdminDataType) => {
    let { checkPassword, ...submitForm } = values;
    'adminId' in values ? null : submitForm.adminId = adminData?.adminId as number;
    confirm({
      title: '确认修改？',
      okText: '确认',
      cancelText: '取消',
      icon: <ExclamationCircleFilled />,
      content: '注意，更改无法撤回！',
      async onOk() {
        const flagData = await updateAdminAPI(submitForm)
        message.success(flagData.msg);
        findAdmin()
      },
      onCancel() {
        console.log('取消');
      },
    });

  };

  return (
    <div>
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <Descriptions size='middle' layout="vertical" bordered >
          <Descriptions.Item label="管理员ID">{adminData?.adminId}</Descriptions.Item>
          <Descriptions.Item label="姓名">{adminData?.adminName}</Descriptions.Item>
          <Descriptions.Item label="电话号码">{adminData?.adminTel}</Descriptions.Item>
          <Descriptions.Item label="密码">{adminData?.adminPassword}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{adminData?.createTime}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{adminData?.updateTime}</Descriptions.Item>
        </Descriptions>
        <div style={formStyle}>
          <div style={{ fontWeight: '600', fontSize: '14px', color: 'rgba(0, 0, 0, 0.88)' }}>管理员信息修改</div>
          <Divider />
          {changeForm}
        </div>
        <div style={formStyle}>
          <div style={{ fontWeight: '600', fontSize: '14px', color: 'rgba(0, 0, 0, 0.88)' }}>管理员密码修改</div>
          <Divider />
          <Form
            form={changePasswordForm}
            onFinish={onFinish}
            initialValues={adminData}
            autoComplete="off"
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col xl={6} md={6} sm={24} style={{ width: '100%' }} >
                <Form.Item
                  label="密码"
                  name="adminPassword"
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
              </Col>
              <Col xl={6} md={6} sm={24} style={{ width: '100%' }} >
                <Form.Item
                  label="确认密码"
                  name="checkPassword"
                  dependencies={['adminPassword']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: '请确认密码！',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('adminPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入密码不相同！'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="请确认密码" />
                </Form.Item>
              </Col>
              <Col xl={12} md={6} sm={24} >
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                      确定
                    </Button>
                    <Button htmlType="button" onClick={() => changePasswordForm.resetFields()} icon={<RedoOutlined />}>
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Space>
    </div>
  )
};

export default App;