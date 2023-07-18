import { Button, Card, Form, Input, InputNumber, Popover, Space, Table, message } from "antd";
import { CheckOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import SearchForm from "../../../components/drugManagement/DrugEntryAndExitSearchForm";
import { AxiosRequestConfig } from "axios";
import { getScarceDrugsAPI,drugReplenishment } from "../../../apis/api";
import style from './index.module.scss'
import { ColumnsType } from "antd/es/table";

type DataType = {
  drugsId: number;
  drugsType: string;
  drugsName: string;
  productionLocation: string;
  productionDate: string;
  termValidity: string;
  therapeuticEfficacy: string;
  inventoryNum: number;
  receiptPrice: number;
  deliveryPrice: number;
  duresPosition: string;
}

export default function View() {
  /* 查找列表开始 */

  // 搜索框
  const [open, setOpen] = useState<boolean | null>(null);
  // 查到的数据
  const [tableList, setTableList] = useState<QueryAPIRes>();
  // 加载状态
  const [loading, setLoading] = useState(true);

  // 字段数组
  let options: Array<optionsType> = [
    { value: 'drugs_name', label: '药物名称' },
    { value: 'drugs_type', label: '药品类型' },
    { value: 'production_location', label: '生产公司' }
  ]

  // 查找表单
  let searchForm = {
    key: options[0].value,
    value: "",
    flag: 20,
    pageNum: 1,
    pageSize: 10
  }

  // 查找方法
  const queryFunc = (optionData: optionsDataType = { key: options[0].value, value: "", flag: 20 }) => {
    searchForm.key = optionData.key
    searchForm.value = optionData.value
    searchForm.flag = optionData.flag!
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }

  // 查找接口
  const queryAPI = async (searchForm: AxiosRequestConfig<QueryAPIReq>) => {
    // 发起查找请求
    const tableList = await getScarceDrugsAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])

  // 顶部按钮
  const topBtn = <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => open === null ? setOpen(true) : setOpen(!open)} />

  /* 查找列表结束 */

  /* 表格开始 */

  // 表头
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'drugsId',
      align: 'center',
      width: 50,
    },
    {
      title: '药品类型',
      dataIndex: 'drugsType',
      align: 'center',
    },
    {
      title: '药品名称',
      dataIndex: 'drugsName',
      align: 'center',
      ellipsis: true, // 使用ellipsis类实现超出隐藏
    },
    {
      title: '制造厂家',
      dataIndex: 'productionLocation',
      align: 'center',
      ellipsis: true, // 使用ellipsis类实现超出隐藏
    },
    {
      title: '生产日期',
      dataIndex: 'productionDate',
      align: 'center',
    },
    {
      title: '过期日期',
      dataIndex: 'termValidity',
      align: 'center',
    },
    {
      title: '治疗病症',
      dataIndex: 'therapeuticEfficacy',
      align: 'center',
      width: window.innerWidth < 700 ? 150 : 200,
      ellipsis: true, // 使用ellipsis类实现超出隐藏
    },
    {
      title: '库存数量',
      dataIndex: 'inventoryNum',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 80,
    },
    {
      title: '批发价格',
      dataIndex: 'receiptPrice',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 80,
    },
    {
      title: '销售价格',
      dataIndex: 'deliveryPrice',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 80,
    },
    {
      title: '库存位置',
      dataIndex: 'duresPosition',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 100,
      render: (_, record) => {
        return (
          <Space>
            <Popover placement="bottomRight" title={record.drugsName} content={formContent()} trigger="click">
              <Button size='small' type="link">补货</Button>
            </Popover>
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
  /* 表格结束 */
  interface ChildMethods {
    onReset: () => void;
  }
  // 拿子组件方法
  const childRef = useRef<ChildMethods>(null);
  // 每行的数据修改
  const [selectedRow, setSelectedRow] = useState<DataType>();
  // 新增修改按钮
  const onFinish = async (values: { drugsId: number, drugsAddNum: number }) => {
    const returnData = await drugReplenishment(values)
    returnData.code === 0 ? message.success(returnData.msg) : message.success(returnData.msg);
    childRef.current!.onReset();
    form.setFieldsValue({drugsAddNum:null})
  };
  // 更新数据
  const handleFormChange = (changedValues: DataType) => {
    // 更新选中行的数据状态
    const updatedRow = { ...selectedRow, ...changedValues };
    setSelectedRow(updatedRow);
  };
  // 重置表单
  const onReset = () => {
    form.resetFields()
  }
  // 新增修改表单信息
  const [form] = Form.useForm();
  // 新增修改表单
  const formContent = () => {
    return (
      <div>
        <Form form={form}
          labelAlign='left'
          onFinish={onFinish}
          labelCol={{ xs: { span: 7 }, sm: { span: 7 } }}
          wrapperCol={{ xs: { span: 17 }, sm: { span: 17 } }}
          onValuesChange={handleFormChange}>
          <Form.Item label="药品ID" name="drugsId" style={{ marginTop: '20px' }}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="补充数量" name='drugsAddNum' style={{ marginTop: '20px' }}>
            <InputNumber min={0} style={{width:'100%'}} placeholder="请输入补充数量" />
          </Form.Item>
          <div className={style.btnBox}>
            <Button type="primary" icon={<CheckOutlined />} htmlType="submit"> 确认 </Button>
            <Button onClick={onReset} icon={<RedoOutlined />}>重置</Button>
          </div>
        </Form>
      </div>
    )
  }
  return (
    <Card className={style.allPage} size='small' title="缺货统计" extra={topBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* 搜索组件 */}
      <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} open={open}  ref={childRef}/>
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='drugsId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        scroll={{ x: 1200, }}
        onRow={(record: DataType) => ({
          onClick: () => {
            form.setFieldsValue(record)
          }
        })}
      />
    </Card>
  )
}
