import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, Modal, Select, message } from 'antd';
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
  const onCreate =  (values: any) => {
    let submitObj = values;
    submitObj["userIdentity"] = 2;
    confirm({
      title: '确认修改？',
      okText: '确认',
      cancelText: '取消',
      icon: <ExclamationCircleFilled />,
      content: '注意，更改无法撤回！',
      async onOk () {
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
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
    },
  };

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
        >
          <Divider />
          {columns.map((res, index) => {
            let formItem
            if (res.dataIndex && res.title != '所在科室') {
              formItem = <Form.Item
                key={index}
                name={res.dataIndex as string}
                label={res.title as string}
              >
                <Input placeholder={'请输入' + res.title} disabled={res.dataIndex === "doctorId" ? true : false} />
              </Form.Item>
            } else if (res.title === '所在科室') {
              formItem = <Form.Item
                key={index}
                name='departmentId'
                label={res.title as string}
              >
                <Select
                  placeholder="请选择科室"
                  allowClear
                  style={{ width: 200 }}
                  options={departmentData}
                />
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