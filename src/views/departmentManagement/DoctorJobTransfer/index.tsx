import { Button, Card, Col, Form, Input, Modal, Popover, Row, Select, Space, Table, message } from "antd";
import style from './index.module.scss'
import { CheckOutlined, ExclamationCircleFilled, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { queryAllDepartmentAPI, queryDepartmentDoctorAPI, updateDoctorAPI, updateDoctorDepartmentAPI } from "../../../apis/api.ts";
import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { ColumnsType } from "antd/es/table/InternalTable";

interface DataType {
  value: number
  label: string;
}


interface DoctorDataType {
  doctorId: number | null;
  departmentId: number;
  doctorName: string;
  departmentName: string;
}

interface ChangeType {
  doctorId: number;
  departmentId: number;
}

const { confirm } = Modal;

export default function View() {
  // 表单信息
  const [form] = Form.useForm();
  // 科室列表
  const [options, setOptions] = useState<Array<DataType>>();
  // 医生列表
  const [doctorList, setDoctorList] = useState<QueryAPIRes>();
  // 调查全部科室接口
  const getAllDepartment = async () => {
    const { data } = await queryAllDepartmentAPI();
    data?.unshift({ value: 0, label: '全部科室' })
    setOptions(data)
  }
  // 查医生API
  const queryDoctorAPI = async (value: number, page?: number) => {
    const searchForm = {
      key: 'department_id',
      value: value == 0 ? null : value,
      pageNum: page ? page : 1,
      pageSize: 8
    }
    const res = await queryDepartmentDoctorAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
    setDoctorList(res)
    setLoading(false)
  }
  // 初始查询
  useEffect(() => {
    queryDoctorAPI(0)
  }, [])
  // 查询科室下的医生
  const onFinish = (values = { key: 0 }) => {
    queryDoctorAPI(values?.key!)
  };
  // 重置查找
  const onReset = () => {
    // 重置表单
    form.resetFields();
    // 重新查找
    queryDoctorAPI(0)
  };
  // 初始调用 
  useEffect(() => {
    getAllDepartment()
  }, [])

  // 表格
  // 加载状态
  const [loading, setLoading] = useState(true);

  // 表头
  const columns: ColumnsType<DoctorDataType> = [
    {
      title: 'ID',
      dataIndex: 'doctorId',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 80,
    },
    {
      title: '医生姓名',
      dataIndex: 'doctorName',
      align: 'center',
    },
    {
      title: '科室名称',
      dataIndex: 'departmentName',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 200,
      render: (_, record: DoctorDataType) => {
        return (
          <Space>
            <Popover placement="bottomRight" title={'医生岗位迁移：' + record.doctorName} content={formContent(record)} trigger="click">
              <Button size='small' type="link">岗位迁移</Button>
            </Popover>
          </Space>
        )
      },
    },
  ];

  // 分页
  const paginationProps = {
    current: doctorList?.pageNum, //当前页码
    pageSize: doctorList?.pageSize, // 每页数据条数
    total: doctorList?.total, // 总条数
    showTotal: () => (
      <span>共 {doctorList?.total} 条</span>
    ),
    onChange: (page: number) => handlePageChange(page), //改变页码的函数
    showQuickJumper: true,
  }

  //改变页码的函数
  const handlePageChange = (page: number) => {
    queryDoctorAPI(0, page);
  }

  // 每行的数据修改
  const [selectedRow, setSelectedRow] = useState<number>();

  // 修改API
  const changeAPI = (sumbitForm: ChangeType) => {
    confirm({
      title: '确认修改？',
      okText: '确认',
      cancelText: '取消',
      icon: <ExclamationCircleFilled />,
      content: '注意，更改无法撤回！',
      async onOk() {
        const flag = await updateDoctorDepartmentAPI(sumbitForm);
        if (flag.code === 0) {
          message.success(flag.msg)
          queryDoctorAPI(0);
        } else {
          message.error(flag.msg)
        }
      },
      onCancel() {
        console.log('取消');
      },
    });
    
  }

  // 修改按钮
  const submit = (values: DoctorDataType) => {
    let sumbitForm = {
      doctorId: values.doctorId,
      departmentId: selectedRow
    }
    sumbitForm.departmentId == undefined || values.departmentId == sumbitForm.departmentId ? message.warning('未进行修改') : changeAPI(sumbitForm as ChangeType)
    formChange.setFieldsValue(selectedRow)
  };

  // 下拉改变
  const onChange = async (value: number) => {
    setSelectedRow(value)
  }

  // 新增修改表单信息
  const [formChange] = Form.useForm();
  // 新增修改表单
  const formContent = (record: DoctorDataType) => {
    return (
      <div>
        <Form
          form={formChange}
          labelAlign='left'
          onFinish={() => submit(record)}
          labelCol={{ xs: { span: 7 }, sm: { span: 7 } }}
          wrapperCol={{ xs: { span: 17 }, sm: { span: 17 } }}
        >
          <Form.Item hidden label="医生ID" name="doctorId" style={{ marginTop: '20px' }}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="医生姓名" name="doctorName" style={{ marginTop: '20px' }}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="迁移科室" style={{ marginTop: '20px' }}>
            <Select
              style={{ width: '100%' }}
              options={options}
              onChange={onChange}
              defaultValue={record.departmentId}
            />
          </Form.Item>
          <div className={style.btnBox}>
            <Button type="primary" icon={<CheckOutlined />} htmlType="submit">修改</Button>
            <Button onClick={onReset} icon={<RedoOutlined />}>重置</Button>
          </div>
        </Form>
      </div>
    )
  }

  return (
    <Card className={style.allPage} size='small' title="医生岗位迁移" bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      <Form
        name="basic"
        form={form}
        initialValues={{ key: 0 }}
        onFinish={onFinish}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xl={5} md={9} xs={24} >
            <Form.Item
              label="科室"
              name="key"
            >
              <Select
                style={{ width: '100%' }}
                options={options}
              />
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
      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={doctorList?.data}
        rowKey='doctorId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        onRow={(record: DoctorDataType) => ({
          onClick: () => {
            formChange.setFieldsValue(record)
          }
        })}
      />
    </Card>
  )
}
