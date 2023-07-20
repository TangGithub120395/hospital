import { Button, Card, Popconfirm, Space, Table, message } from "antd";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import SearchForm from "../../../components/SearchForm";
import { AxiosRequestConfig } from "axios";
import { quertdrugsAPI, deldrugsAPI } from "../../../apis/api";
import style from './index.module.scss'
import { ColumnsType } from "antd/es/table";
import DrugManageForm from "../../../components/drugManagement/DrugManageForm";

type DrugDataType = {
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
type ColumnsDataType = {
  title: string;
  dataIndex: string;
  align: string;
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
    pageNum: 1,
    pageSize: 10
  }

  // 查找方法
  const queryFunc = (optionData: optionsDataType = { key: options[0].value, value: "" }) => {
    searchForm.key = optionData.key
    searchForm.value = optionData.value
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }

  // 查找接口
  const queryAPI = async (searchForm: AxiosRequestConfig<QueryAPIReq>) => {
    // 发起查找请求
    const tableList = await quertdrugsAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])

  /* 查找列表结束 */

  /* 表格开始 */

  // 删除
  const deleteBtn = async (id: number) => {
    const deleteFlag = await deldrugsAPI(id)
    deleteFlag.code === 0 ? message.success(deleteFlag.msg) : message?.success(deleteFlag.msg);
    queryFunc()
  }

  // 表头
  const columns: ColumnsType<DrugDataType> = [
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
      width: window.innerWidth < 700 ? 0 : 80,
      ellipsis: true, // 使用ellipsis类实现超出隐藏
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => {
        return (
          <Space>
            <DrugManageForm title={'修改药品：' + record.drugsName} drugData={record} columns={columns as Array<ColumnsDataType>} queryFunc={queryFunc} />
            <Popconfirm
              placement="bottomRight"
              title={'删除'}
              description={'确认删除药品 ' + record.drugsName + ' 吗？'}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okText="确认删除"
              cancelText="取消"
              onConfirm={() => deleteBtn(record.drugsId as number)}
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
  const topBtn = <Space>
    <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => open === null ? setOpen(true) : setOpen(!open)} />
    <DrugManageForm title={'药品入库'} columns={columns as Array<ColumnsDataType>} queryFunc={queryFunc} />
  </Space>
  /* 表格结束 */


  return (
    <Card className={style.allPage} size='small' title="药品出入库" extra={topBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* 搜索组件 */}
      <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} open={open} />
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='drugsId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        scroll={{ x: 1250, }}
      />
    </Card>
  )
}
