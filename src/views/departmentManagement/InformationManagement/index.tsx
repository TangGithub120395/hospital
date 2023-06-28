import { useEffect, useState } from 'react'
import { Card, Button, Space, Table, Popover, Form, Input, Popconfirm, message } from 'antd';
import style from './index.module.scss'
import {
  SearchOutlined,
  PlusOutlined,
  RedoOutlined,
  CheckOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

// 拿搜索表单
import SearchForm from '../../../components/SearchForm'

// 拿接口
import { addInformationManagementAPI, delInformationManagementAPI, updateInformationManagementAPI, getInformationManagementAPI } from "../../../apis/api.ts";
import { AxiosRequestConfig } from 'axios';
import { ColumnsType } from 'antd/es/table/InternalTable';

interface DataType {
  departmentId: number | null;
  departmentName: string;
}

export default function View() {

  let options: Array<optionsType> = [
    { value: 'department_name', label: '科室名称' },
  ]

  let searchForm = {
    key: options[0].value,
    value: "",
    pageNum: 1,
    pageSize: 10
  }

  // 查到的数据
  const [tableList, setTableList] = useState<QueryAPIRes>();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 搜索框
  const [showSearch, setShowSearch] = useState(true);
  // 每行的数据修改
  const [selectedRow, setSelectedRow] = useState<DataType>();
  // 修改新增标志
  const [changeFlag, setChangeFlag] = useState(true);

  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])

  // 查找方法
  const queryFunc = (optionData: optionsDataType = { key: options[0].value, value: "" }) => {
    searchForm.key = optionData.key
    searchForm.value = optionData.value
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }

  // 查找接口
  const queryAPI = async (searchForm: AxiosRequestConfig<QueryAPIReq>) => {
    // 发起查找请求
    const tableList = await getInformationManagementAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  // 新增修改按钮
  const onFinish = async (values: DataType) => {
    let sumbitForm = {
      departmentId: values.departmentId,
      departmentName: selectedRow?.departmentName
    }
    const returnData = changeFlag ? await addInformationManagementAPI({ departmentName: selectedRow?.departmentName }) : await updateInformationManagementAPI(sumbitForm)
    returnData.code === 0 ? message.success(returnData.msg) : message.success(returnData.msg);
    queryFunc()
    form.setFieldsValue(sumbitForm)
  };
  // 更新数据
  const handleFormChange = (changedValues: DataType) => {
    // 更新选中行的数据状态
    const updatedRow = { ...selectedRow, ...changedValues };
    setSelectedRow(updatedRow);
  };

  // 新增修改表单信息
  const [form] = Form.useForm();
  // 新增修改表单
  const formContent = (record?: DataType) => {
    return (
      <div>
        <Form form={form}
          labelAlign='left'
          onFinish={onFinish}
          labelCol={{ xs: { span: 7 }, sm: { span: 7 } }}
          wrapperCol={{ xs: { span: 17 }, sm: { span: 17 } }}
          onValuesChange={handleFormChange}>
          <Form.Item hidden={record ? false : true} label="科室ID" name="departmentId" style={{ marginTop: '20px' }}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="科室名称" name='departmentName' style={{ marginTop: '20px' }}>
            <Input placeholder="请输入科室名" />
          </Form.Item>
          <div className={style.btnBox}>
            <Button type="primary" icon={<CheckOutlined />} htmlType="submit"> {record ? '修改' : '新增'} </Button>
            <Button onClick={onReset} icon={<RedoOutlined />}>重置</Button>
          </div>
        </Form>
      </div>
    )
  }

  // 删除
  const deleteBtn = async (id: number) => {
    const deleteFlag = await delInformationManagementAPI(id)
    deleteFlag.code === 0 ? message.success(deleteFlag.msg) : message.success(deleteFlag.msg);
    queryFunc()
  }

  // 重置表单
  const onReset = () => {
    form.resetFields()
  }

  // 表头
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'departmentId',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 80,
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
      render: (_, record) => {
        return (
          <Space>
            <Popover placement="bottom" title={'修改科室：' + record.departmentName} content={formContent(record)} trigger="click">
              <Button size='small' type="link" onClick={() => setChangeFlag(false)}>修改</Button>
            </Popover>
            <Popconfirm
              placement="bottomRight"
              title={'删除'}
              description={'确认删除科室 ' + record.departmentName + ' 吗？'}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okText="确认删除"
              cancelText="取消"
              onConfirm={() => deleteBtn(record.departmentId as number)}
            >
              <Button size='small' danger type="link" >删除</Button>
            </Popconfirm >
          </Space>
        )
      },
    },
  ];
  // 分页
  const paginationProps = {
    current: tableList?.pageNum, //当前页码
    pageSize: tableList?.pageSize, // 每页数据条数
    total: tableList?.total, // 总条数
    showTotal: () => (
      <span>共 {tableList?.total} 条</span>
    ),
    onChange: (page: number) => handlePageChange(page), //改变页码的函数
    showQuickJumper: true,
  }

  const handlePageChange = (page: number) => {
    searchForm.pageNum = page
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>);
  }

  // 顶部按钮
  // pc端
  const pcTopBtn =
    <Space>
      <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => { setShowSearch(!showSearch) }} />
      <Popover placement="bottomRight" title={'新增科室'} content={formContent} trigger="click">
        <Button type="primary" shape="circle" onClick={() => {setChangeFlag(true); form.setFieldsValue({departmentName:""})}} icon={<PlusOutlined />} />
      </Popover>
    </Space>
  return (
    <Card className={style.allPage} title="科室信息管理" extra={pcTopBtn} bordered={false} style={{ width: '100%' ,height:'calc(100vh - 80px)' }}>
      <div style={showSearch ? { display: 'none' } : { display: 'block' }}>
        <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} />
      </div>
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='departmentId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        onRow={(record: DataType) => ({
          onClick: () => {
            form.setFieldsValue(record)
          }
        })}
      />
    </Card>
  )
}

