import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, Modal, Radio, Select, message } from 'antd';
import { queryOneDoctorAPI, queryAllDepartmentAPI, updateDoctorAPI } from "../../../apis/api";
import { ExclamationCircleFilled } from '@ant-design/icons';


interface Values {
  title: string;
  doctorId: number;
  columns: Array<DataType>;
  queryFunc: (optionData?: optionsDataType) => void;
}

type DataType = {
  title: string;
  dataIndex: string;
  align: string;
}

type DoctorDataType = {
  doctorId: number | null;
  departmentId: number;
  doctorName: string;
  doctorSex: number;
  doctorAge: number;
  doctorTel: string;
  doctorPassword: string;
  userIdentity: number;
}

interface DepartmentDataType {
  value: number
  label: string;
}

const { confirm } = Modal;

const App: React.FC<Values> = ({ title, doctorId, columns, queryFunc }) => {
  // 医生
  const [doctorData, setDoctorData] = useState<DoctorDataType>();
  // 科室
  const [departmentData, setDepartmentData] = useState<Array<DepartmentDataType>>();

  // 查医生接口
  const getDoctorData = async () => {
    const { data } = await queryOneDoctorAPI(doctorId)
    setDoctorData(data as DoctorDataType)
  }

  // 查科室接口
  const getDepartmentData = async () => {
    const { data } = await queryAllDepartmentAPI()
    setDepartmentData(data as Array<DepartmentDataType>)
  }

  // 查医生,科室
  useEffect(() => {
    getDoctorData()
    getDepartmentData()
  }, [])

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
        const flagData = await updateDoctorAPI(submitObj)
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
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
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
          initialValues={doctorData}
          name={'form_in_modal' + doctorId}
          labelAlign='left'
        >
          <Divider />
          {columns.map((res, index) => {
            const a = <Radio.Group options={optionsSex} name='doctorSex' />
            const b = <Input placeholder={'请输入' + res.title} disabled={res.dataIndex === "doctorId" ? true : false} />
            const c = <Select placeholder="请选择科室" allowClear style={{ width: 200 }} options={departmentData} />
            let formItem
            if (res.title != '操作') {
              formItem = <Form.Item
                key={index}
                name={res.title === '所在科室' ? 'departmentId' :res.dataIndex as string}
                label={res.title as string}
              >
                {res.dataIndex === 'doctorSex' ? a : (res.title === '所在科室' ? c : b)}
              </Form.Item>
            }
            return formItem
          })}
          <Form.Item
            label="密码"
            name="doctorPassword"
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