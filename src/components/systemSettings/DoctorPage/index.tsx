import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Card, Col, Descriptions, Divider, Form, Input, Modal, Radio, Row, Space, message, theme } from 'antd';
import { queryOneDoctorAPI, updateDoctorAPI, queryDepartmentNameAPI } from "../../../apis/api";
import style from './index.module.scss'
// 引入cookie
import cookie from 'react-cookies'
import { RedoOutlined, CheckOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import UploadHeadImg from '../components/UploadHeadImg';
// 类型接口定义
interface DoctorDataType {
  doctorId: number;
  headImg:string;
  departmentId: number;
  doctorName: string;
  doctorSex: number;
  doctorAge: number;
  doctorTel: string;
  doctorPassword: string;
  userIdentity: number;
  createTime: string;
  updateTime: string;
  checkPassword?: string
}

const App: React.FC = () => {
  // 拿cookie
  let userData:DoctorDataType = cookie.load("userData")

  // 医生信息
  const [doctorData, setdoctorData] = useState<DoctorDataType>();
  const [changeForm, setChangeForm] = useState<ReactNode>();
  const [departmentName, setDepartmentName] = useState<string>();
  // 查科室函数

  const queryDepartmentName = async () => {
     const res = await queryDepartmentNameAPI(userData.departmentId)
     setDepartmentName(res.data?.departmentName);
  }
  // 查科室
  useEffect(() => {
    queryDepartmentName()
  }, [])
  console.log(departmentName);
  
  // 性别选择
  const optionsSex = [
    { label: '男', value: 1 },
    { label: '女', value: 2 },
  ];

  // 根据id查医生
  const findDoctor = async () => {
    const { data } = await queryOneDoctorAPI(userData.doctorId)
    // 存储用户信息
    cookie.save('userData', data as DoctorDataType, { path: "/" })
    setdoctorData(data as DoctorDataType)
    setChangeForm(
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        initialValues={data as DoctorDataType}
        autoComplete="off"
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="医生ID"
              name="doctorId"
            >
              <Input allowClear disabled />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="姓名"
              name="doctorName"
            >
              <Input allowClear placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="性别"
              name="doctorSex"
            >
              <Radio.Group options={optionsSex} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="电话号码"
              name="doctorTel"
            >
              <Input allowClear placeholder="请输入电话号码" />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="年龄"
              name="doctorAge"
            >
              <Input allowClear placeholder="请输入年龄" />
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
    findDoctor()
  }, [])

  // 表单
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const { confirm } = Modal;

  // 提交表单
  const onFinish = (values: DoctorDataType) => {
    let { checkPassword, ...submitForm } = values;
    'doctorId' in values ? null : submitForm.doctorId = doctorData?.doctorId as number;
    confirm({
      title: '确认修改？',
      okText: '确认',
      cancelText: '取消',
      icon: <ExclamationCircleFilled />,
      content: '注意，更改无法撤回！',
      async onOk() {
        const flagData = await updateDoctorAPI(submitForm)
        message.success(flagData.msg);
        findDoctor()
      },
      onCancel() {
        console.log('取消');
      },
    });

  };

  return (
    <div className={style.allPage}>
      <UploadHeadImg refresh={findDoctor} headImgUrl={userData.headImg}  />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Descriptions size='middle' layout="horizontal" bordered >
          <Descriptions.Item label="医生ID">{doctorData?.doctorId}</Descriptions.Item>
          <Descriptions.Item label="科室">{departmentName}</Descriptions.Item>
          <Descriptions.Item label="姓名">{doctorData?.doctorName}</Descriptions.Item>
          <Descriptions.Item label="电话号码">{doctorData?.doctorTel}</Descriptions.Item>
          <Descriptions.Item label="密码">{doctorData?.doctorPassword}</Descriptions.Item>
          <Descriptions.Item label="性别">{doctorData?.doctorSex ? '男' : '女'}</Descriptions.Item>
          <Descriptions.Item label="年龄">{doctorData?.doctorAge}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{doctorData?.createTime}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{doctorData?.updateTime}</Descriptions.Item>
        </Descriptions>
        <div>
          <Card size='small' title="医生信息修改" bordered={true} >
            {changeForm}
          </Card>
          <Card size='small' title="医生密码修改" bordered={true} style={{ marginTop: '15px' }}>
            <Form
              form={changePasswordForm}
              onFinish={onFinish}
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              initialValues={doctorData}
              autoComplete="off"
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xl={8} md={8} sm={24} >
                  <Form.Item
                    label="密码"
                    name="doctorPassword"
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
                    dependencies={['doctorPassword']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: '请确认密码！',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('doctorPassword') === value) {
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