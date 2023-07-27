import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, InputNumber, Modal, Select, Space, message } from 'antd';
import { ExclamationCircleFilled, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { addPrescriptionAPI, getAllDrugsPageAPI } from '../../../apis/api';

interface MedicineDataType {
  registerId: number;
  drugsId: number;
  medicineNum: number;
  medicineNotes: string;
}

const { confirm } = Modal;

interface RegistrationDataType {
  registerId: number;
  doctorId: number;
  patientId: number;
  medicineList?: Array<MedicineDataType>
}

interface Values {
  title: string;
  RegistrationData: RegistrationDataType
  queryFunc: (optionData?: optionsDataType) => void;
}

interface OptionsType {
  label: string;
  value: number;
}

const App: React.FC<Values> = ({ title, RegistrationData, queryFunc }) => {

  // 控制开启关闭
  const [open, setOpen] = useState(false);
  // 药物选择
  const [options, setOptions] = useState<Array<OptionsType>>();

  // 查询全部药物
  const findAllDrugs = async () => {
    const { data } = await getAllDrugsPageAPI();
    setOptions(data as Array<OptionsType>)
  }

  // 调用接口
  useEffect(() => {
    findAllDrugs()
  }, [])


  // 提交表单
  const onCreate = (values: any) => {
    let submitForm = {
      ...RegistrationData,
      children: values.children
    }
    for (let i = 0; i < submitForm.children.length; i++) {
      submitForm.children[i].registerId = RegistrationData.registerId;
    }
    confirm({
      title: '新增',
      okText: '确认',
      cancelText: '取消',
      icon: <ExclamationCircleFilled />,
      content: '确认新增该处方？',
      async onOk() {
        const flagData = await addPrescriptionAPI(submitForm)
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

  // 表单信息
  const [form] = Form.useForm();

  return (
    <div>
      <Button
        size='small'
        type="link"
        onClick={() => setOpen(true)}
      >
        处方开具
      </Button>
      <Modal
        open={open}
        title={title}
        okText="确认"
        cancelText="取消"
        onCancel={onCancel}
        width={800}
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
        <Divider />
        <Form
          form={form}
          name="dynamic_form_nest_item"
          style={{ maxWidth: 800 }}
        >
          <Form.Item
            label='挂号ID'
          >
            <Input disabled defaultValue={RegistrationData.registerId} style={{ width: '200px' }} />
          </Form.Item>
          <Form.List name="children">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'drugsId']}
                      label='药物选择'
                    >
                      <Select style={{ width: window.innerWidth < 700 ? 90 : 150 }} options={options} placeholder='请选择药物' />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'medicineNum']}
                      label='药物数量'
                    >
                      <InputNumber style={{ width: window.innerWidth < 700 ? 80 : 100 }} min={1} placeholder='请输入药物数量' />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'medicineNotes']}
                      label='服用方法'
                    >
                      <Input placeholder="请输入服用方法" style={{ width: window.innerWidth < 700 ? 90 : 260 }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加药物项
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
        <Divider />
      </Modal>
    </div >
  );
};

export default App;