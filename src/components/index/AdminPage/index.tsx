import { Card, Table, Tag } from 'antd'
import { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { AxiosRequestConfig } from 'axios';
// 引入cookie
import cookie from 'react-cookies'
import { queryAdminUnpayPageAPI } from '../../../apis/api';

type UnpayDataType = {
  prescriptionId: number;
  departmentName: string;
  doctorName: string;
  patientName: string;
  patientTel: string;
  paymentStatus: number;
  prescriptionTime: string;
}

export default function View() {

  // 查到的数据
  const [tableList, setTableList] = useState<QueryAPIRes>();
  // 加载状态
  const [loading, setLoading] = useState(true);

  // 拿用户信息
  let userData = cookie.load("userData")

  // 查找表单
  let searchForm = {
    key: "",
    value: "",
    flag: userData.doctorId,
    pageNum: 1,
    pageSize: 4
  }

  // 查找接口
  const queryAPI = async (searchForm: AxiosRequestConfig<QueryAPIReq>) => {
    // 发起查找请求
    const tableList = await queryAdminUnpayPageAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])


  // 表头
  const columns: ColumnsType<UnpayDataType> = [
    {
      title: '处方编号',
      dataIndex: 'prescriptionId',
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
      title: '患者姓名',
      dataIndex: 'patientName',
      align: 'center',
    },
    {
      title: '患者手机号',
      dataIndex: 'patientTel',
      align: 'center',
    },
    {
      title: '缴费状态',
      dataIndex: 'paymentStatus',
      align: 'center',
      render: (_, record) => {
        return (
          <Tag color={"error"}>{'未缴费'}</Tag>
        )
      }
    },
    {
      title: '处方开具时间',
      dataIndex: 'prescriptionTime',
      align: 'center',
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

  return (
    <div>
      <Card size='small' bordered={false} style={window.innerWidth < 700 ? {} : { marginTop: '15px', height: 'calc(100vh - 417px)' }}>
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='collectorId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        scroll={{ x: 1250, }}
      />
      </Card>
    </div>
  )
}