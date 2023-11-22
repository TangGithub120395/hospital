import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Card, Col, Descriptions, Divider, Form, Input, Modal, Radio, Row, Space, message, theme } from 'antd';
import { findPatientByIdAPI, updatePatientAPI } from "../../../apis/api";
import style from './index.module.scss'
// 引入cookie
import cookie from 'react-cookies'
import { RedoOutlined, CheckOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import UploadHeadImg from '../components/UploadHeadImg';

// 类型接口定义
interface PatientDataType {
  patientId: number;
  headImg:string;
  patientName: string;
  patientSex: number;
  patientAge: number;
  patientNumber: number;
  patientTel: string;
  patientPassword: string;
  userIdentity: number;
  createTime: string;
  updateTime: string;
  checkPassword?: string
}

const App: React.FC = () => {
  // 拿cookie
  let userData = cookie.load("userData")

  // 患者信息
  const [patientData, setpatientData] = useState<PatientDataType>();
  const [changeForm, setChangeForm] = useState<ReactNode>();

  // 性别选择
  const optionsSex = [
    { label: '男', value: 1 },
    { label: '女', value: 2 },
  ];

  // 根据id查患者
  const findPatient = async () => {
    const { data } = await findPatientByIdAPI(userData.patientId)
    // 存储用户信息
    cookie.save('userData', data as PatientDataType, { path: "/" })
    setpatientData(data as PatientDataType)
    setChangeForm(
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        initialValues={data as PatientDataType}
        autoComplete="off"
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="患者ID"
              name="patientId"
            >
              <Input allowClear disabled />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="姓名"
              name="patientName"
            >
              <Input allowClear placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="性别"
              name="patientSex"
            >
              <Radio.Group options={optionsSex} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="电话号码"
              name="patientTel"
            >
              <Input allowClear placeholder="请输入电话号码" />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="年龄"
              name="patientAge"
            >
              <Input allowClear placeholder="请输入年龄" />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="身份证号"
              name="patientNumber"
            >
              <Input allowClear placeholder="请输入身份证号" />
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ marginTop: '-10px' }} />
        <Space style={{ float: 'right' }}>
          <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
            确定
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()} icon={<RedoOutlined />}>
            重置
          </Button>
        </Space>
      </Form>
    )
  }

  // 调接口
  useEffect(() => {
    findPatient()
  }, [])

  // 表单
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const { confirm } = Modal;

  // 提交表单
  const onFinish = (values: PatientDataType) => {
    let { checkPassword, ...submitForm } = values;
    'patientId' in values ? null : submitForm.patientId = patientData?.patientId as number;
    confirm({
      title: '确认修改？',
      okText: '确认',
      cancelText: '取消',
      icon: <ExclamationCircleFilled />,
      content: '注意，更改无法撤回！',
      async onOk() {
        const flagData = await updatePatientAPI(submitForm)
        message.success(flagData.msg);
        findPatient()
      },
      onCancel() {
        console.log('取消');
      },
    });

  };

  return (
    <div className={style.allPage}>
      <UploadHeadImg refresh={findPatient} headImgUrl={userData.headImg}  />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Descriptions size='middle' layout="horizontal" bordered >
          <Descriptions.Item label="患者ID">{patientData?.patientId}</Descriptions.Item>
          <Descriptions.Item label="姓名">{patientData?.patientName}</Descriptions.Item>
          <Descriptions.Item label="电话号码">{patientData?.patientTel}</Descriptions.Item>
          <Descriptions.Item label="密码">{patientData?.patientPassword}</Descriptions.Item>
          <Descriptions.Item label="性别">{patientData?.patientSex ? '男' : '女'}</Descriptions.Item>
          <Descriptions.Item label="年龄">{patientData?.patientAge}</Descriptions.Item>
          <Descriptions.Item label="身份证号">{patientData?.patientNumber}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{patientData?.createTime}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{patientData?.updateTime}</Descriptions.Item>
        </Descriptions>
        <div>
          <Card size='small' title="患者信息修改" bordered={true} >
            {changeForm}
          </Card>
          <Card size='small' title="患者密码修改" bordered={true} style={{ marginTop: '15px' }}>
            <Form
              form={changePasswordForm}
              onFinish={onFinish}
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              initialValues={patientData}
              autoComplete="off"
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xl={8} md={8} sm={24} >
                  <Form.Item
                    label="密码"
                    name="patientPassword"
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
                <Col xl={8} md={6} sm={24} >
                  <Form.Item
                    label="确认密码"
                    name="checkPassword"
                    dependencies={['patientPassword']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: '请确认密码！',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('patientPassword') === value) {
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
              </Row>
              <Divider style={{ marginTop: '-10px' }} />
              <Space style={{ float: 'right' }}>
                <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                  确定
                </Button>
                <Button htmlType="button" onClick={() => changePasswordForm.resetFields()} icon={<RedoOutlined />}>
                  重置
                </Button>
              </Space>
            </Form>
          </Card>
        </div>
      </Space>
    </div>
  )
};

export default App;