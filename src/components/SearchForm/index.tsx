import React from 'react';
import { Button, Space, Select, Form, Input, Col, Row } from 'antd';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons/lib/icons';

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

type propsType = {
  options: optionsType[]
  queryFunc: (optionData?: optionsDataType) => void
}


const App: React.FC<propsType> = (props: propsType) => {
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values: any) => {
    // 调用父级的查找方法
    props.queryFunc(values)
  };
  return (
    <Form
      form={form}
      style={{ maxWidth: 650 }}
      initialValues={{ key: props.options[0].value }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col xl={10} md={9} xs={24} >
          <Form.Item
            label="字段："
            name="key"
          >
            <Select
              style={{ width: '100%' }}
              options={props.options}
            />
          </Form.Item>
        </Col>
        <Col xl={10} md={9} sm={24} style={{ width: '100%' }} >
          <Form.Item
            label="值："
            name="value"
          >
            <Input allowClear placeholder="请输入查询字段值" />
          </Form.Item>
        </Col>
        <Col xl={4} md={6} sm={24} >
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button htmlType="button" onClick={onReset} icon={<RedoOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default App;