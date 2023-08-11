import { Card, Table, Tag } from 'antd'
import { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { AxiosRequestConfig } from 'axios';
// 引入cookie
import cookie from 'react-cookies'
import { queryRegisterAPI } from '../../../apis/api';


type RegisterDataType = {
  registerId: number;
  departmentName: string;
  doctorName: string;
  registerCost: number;
  completionStatus: number;
  registerDate: string;
  createTime: string;
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
    flag: userData.patientId,
    pageNum: 1,
    pageSize: 5
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
          rowKey='registerId'
          size='small' bordered
          loading={loading}
          pagination={paginationProps}
          scroll={{ x: 1250, }}
        />
      </Card>
    </div>
  )
}