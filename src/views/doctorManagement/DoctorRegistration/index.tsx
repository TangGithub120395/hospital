import { Button, Card, Form, Input, InputNumber, Radio, Select, Space, message } from 'antd'
import style from './index.module.scss'
import { SendOutlined, RedoOutlined } from '@ant-design/icons';
import { addDoctorAPI, queryAllDepartmentAPI } from "../../../apis/api.ts";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

type DoctorFormType = {
  departmentId: number,
  doctorName: string,
  doctorSex: 1 | 2,
  doctorAge: number,
  doctorTel: string,
  doctorPassword: string
  userIdentity: number
}
interface DataType {
  value: number
  label: string;
}

export default function View() {
  // 科室列表
  const [options, setOptions] = useState<Array<DataType>>();
  // 调查全部科室接口
  const getAllDepartment = async () => {
    const { data } = await queryAllDepartmentAPI();
    setOptions(data)
  }
  // 调用 
  useEffect(() => {
    getAllDepartment()
  }, [])
  // 拿路由hook
  let navigateTo = useNavigate();
  // 表单提交
  const onFinish = async (values: DoctorFormType) => {
    let submitObj = values;
    submitObj["userIdentity"] = 2;
    const addFlag = await addDoctorAPI(submitObj)
    if (addFlag.code === 0) {
      message.success(addFlag.msg)
      navigateTo("/doctorInformationManagement")
    }
  }

  // 性别选择
  const optionsSex = [
    { label: '男', value: 1 },
    { label: '女', value: 2 },
  ];

  // 重置表单
  const onReset = () => form.resetFields();
  // 拿表单
  const [form] = Form.useForm();
  return (
    <Card title="医生注册登记" bordered={false} size='small' style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      <div className={style.allPage}>
        <div className={style.contentBox}>
          <Form
            form={form}
            labelCol={{ span: 6 }}
            initialValues={{ doctorSex: 1 }}
            onFinish={onFinish}
          >
            <Form.Item
              label="姓名"
              name='doctorName'
              rules={[{ required: true, message: '请输入医生姓名！' }]}
            >
              <Input placeholder="请输入医生姓名" allowClear />
            </Form.Item>
            <Form.Item
              label="电话"
              name='doctorTel'
              rules={[{ required: true, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入正确格式的手机号！' }]}
            >
              <Input placeholder="请输入医生电话号码" allowClear />
            </Form.Item>
            <Form.Item
              label="科室选择"
              name='departmentId'
              rules={[{ required: true, message: '请选择科室！' }]}
            >
              <Select
                placeholder="请选择科室"
                allowClear
                style={{ width: 200 }}
                options={options}
              />
            </Form.Item>
            <Form.Item label="性别" name='doctorSex'>
              <Radio.Group options={optionsSex} name='doctorSex' />
            </Form.Item>
            <Form.Item
              label="年龄"
              name='doctorAge'>
              <InputNumber placeholder="医生年龄" min={1} style={{ width: 120 }} />
            </Form.Item>
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
            <Form.Item
              label="确认密码"
              name="confirm"
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
            <Form.Item>
              <Space style={{ float: 'right' }}>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />}> 注册 </Button>
                <Button htmlType="button" onClick={onReset} icon={<RedoOutlined />}> 重置 </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Card>
  )
}
