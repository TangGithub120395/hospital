import { Button, Card, Space, Table } from "antd";
import {SearchOutlined} from "@ant-design/icons";
import { useEffect, useState } from "react";
import SearchForm from "../../components/SearchForm";
import { AxiosRequestConfig } from "axios";
import { queryPatientCasePageAPI } from "../../apis/api";
import style from './index.module.scss'
import { ColumnsType } from "antd/es/table";
// 引入cookie
import cookie from 'react-cookies'
import CaseDetails from "../../components/caseFiling/CaseDetails";

type PrescriptionDataType = {
  prescriptionId: number;
  registerId: number;
  departmentName: string;
  doctorTel: string;
  doctorName: string;
  prescriptionDiagnosis: string;
  prescriptionTime: string;
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
    { value: 'prescription_time', label: '开具时间' },
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
    const tableList = await queryPatientCasePageAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])

  /* 查找列表结束 */

  /* 表格开始 */

  // 表头
  const columns: ColumnsType<PrescriptionDataType> = [
    {
      title: 'ID',
      dataIndex: 'prescriptionId',
      align: 'center',
      width: 50,
    },
    {
      title: '挂号单号',
      dataIndex: 'registerId',
      align: 'center',
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
      title: '医生电话',
      dataIndex: 'doctorTel',
      align: 'center',
    },
    {
      title: '开具时间',
      dataIndex: 'prescriptionTime',
      align: 'center',
    },
    {
      title: '病理诊断',
      dataIndex: 'prescriptionDiagnosis',
      align: 'center',
      width: 400,
      ellipsis: true, // 使用ellipsis类实现超出隐藏
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
  </Space>
  /* 表格结束 */

  return (
    <Card className={style.allPage} size='small' title="处方信息" extra={topBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* 搜索组件 */}
      <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} open={open} />
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='prescriptionId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        scroll={{ x: 1250, }}
        expandable={{
          expandedRowRender: (record) => <CaseDetails registerId={record.registerId} />
        }}
      />
    </Card>
  )
}
