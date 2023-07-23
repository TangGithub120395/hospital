import { Button, Card, Popconfirm, Space, Table, Tag, message } from "antd";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import SearchForm from "../../components/SearchForm";
import { AxiosRequestConfig } from "axios";
import { queryRegisterAPI, delRegisterAPI } from "../../apis/api";
import style from './index.module.scss'
import { ColumnsType } from "antd/es/table";
import DrugManageForm from "../../components/drugManagement/DrugManageForm";
// 引入cookie
import cookie from 'react-cookies'

type RegisterDataType = {
  registerId: number;
  departmentName: string;
  doctorName: string;
  registerCost: number;
  completionStatus: number;
  registerDate: string;
  createTime: string;
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
    { value: 'drugs_type', label: '科室' },
    { value: 'production_location', label: '生产公司' }
  ]

  // 拿用户信息
  let userData = cookie.load("userData")

  // 查找表单
  let searchForm = {
    key: options[0].value,
    value: "",
    flag: userData.patientId,
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
    const tableList = await queryRegisterAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])

  /* 查找列表结束 */

  /* 表格开始 */

  // 挂号取消
  const deleteBtn = async (id: number) => {
    const deleteFlag = await delRegisterAPI(id)
    deleteFlag.code === 0 ? message.success(deleteFlag.msg) : message?.success(deleteFlag.msg);
    queryFunc()
  }

  // 表头
  const columns: ColumnsType<RegisterDataType> = [
    {
      title: 'ID',
      dataIndex: 'registerId',
      align: 'center',
      width: 50,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      align: 'center',
    },
    {
      title: '医生姓名',
      dataIndex: 'doctorName',
      align: 'center',
    },
    {
      title: '挂号费（元）',
      dataIndex: 'registerCost',
      align: 'center',
    },
    {
      title: '挂号时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '预约时间',
      dataIndex: 'registerDate',
      align: 'center',
    },
    {
      title: '进行状态',
      dataIndex: 'completionStatus',
      align: 'center',
      render: (_, record) => {
        return (

          <Tag color={record.completionStatus == 1 ? "success" : "warning"}>{record.completionStatus == 1 ? '完成' : '未完成'}</Tag>
        )
      }
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => {
        return (
          <Popconfirm
            placement="bottomRight"
            title={'挂号取消'}
            description={'确认取消本次挂号吗？'}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            okText="确认"
            cancelText="取消"
            onConfirm={() => deleteBtn(record.registerId as number)}
          >
            <Button size='small' danger type="link" >取消挂号</Button>
          </Popconfirm >
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
        rowKey='registerId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        scroll={{ x: 1250, }}
      />
    </Card>
  )
}
