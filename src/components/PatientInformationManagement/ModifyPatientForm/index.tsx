import React, { useState } from 'react';
import { Button, Divider, Form, Input, Modal, Radio, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { updatePatientAPI } from '../../../apis/api';


interface Values {
  title: string;
  patientData: PatientDataType;
  columns: Array<ColumnsDataType>;
  queryFunc: (optionData?: optionsDataType) => void;
}

type ColumnsDataType = {
  title: string;
  dataIndex: string;
  align: string;
}

interface PatientDataType {
  patientId: number;
  patientName: string;
  patientSex: number;
  patientAge: number;
  patientNumber: number;
  patientTel: string;
  patientPassword: string;
  userIdentity: number;
}

const { confirm } = Modal;

const App: React.FC<Values> = ({ title, patientData, columns, queryFunc }) => {

  // 控制开启关闭
  const [open, setOpen] = useState(false);

  // 提交表单
  const onCreate = (values: any) => {
    let submitObj = values;
    submitObj["userIdentity"] = 2;
    confirm({
      title: '确认修改？',
      okText: '确认',
      cancelText: '取消',
      icon: <ExclamationCircleFilled />,
      content: '注意，更改无法撤回！',
      async onOk() {
        const flagData = await updatePatientAPI(submitObj)
        message.success(flagData.msg);
        setTimeout(() => {
          setOpen(false);
        }, 300);
        queryFunc()
      },
      onCancel() {
        console.log('取消');
      },
    });
  };

  // 取消按钮
  const onCancel = () => {
    setOpen(false);
  }

  // 表单布局  
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
    },
  };

  // 性别选择
  const optionsSex = [
    { label: '男', value: 1 },
    { label: '女', value: 2 },
  ];

  // 表单信息
  const [form] = Form.useForm();
  return (
    <div>
      <Button
        size='small'
        type="link"
        onClick={() => setOpen(true)}
      >
        修改
      </Button>
      <Modal
        open={open}
        title={title}
        okText="确认"
        cancelText="取消"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          {...formItemLayout}
          form={form}
          initialValues={patientData}
          name={'form_in_modal' + patientData.patientId}
          labelAlign='right'
        >
          <Divider />
          {columns.map((res, index) => {
            const a = <Radio.Group options={optionsSex} name='patientSex' />
            const b = <Input placeholder={'请输入' + res.title} disabled={res.dataIndex === "patientId" ? true : false} />
            let formItem
            if (res.title != '操作') {
              formItem = <Form.Item
                key={index}
                name={res.dataIndex as string}
                label={res.title as string}
              >
                {res.dataIndex === 'patientSex' ? a : b}
              </Form.Item>
            }
            return formItem
          })}
          <Form.Item
            label="密码"
            name="patientPassword"
            hasFeedback
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        </Form>
        <Divider />
      </Modal>
    </div >
  );
};

export default App;