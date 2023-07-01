import { Button, Card, Popconfirm, Space, Table, message } from "antd";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import SearchForm from "../../../components/SearchForm";
import { AxiosRequestConfig } from "axios";
import { getDoctorAPI, delDoctorAPI } from "../../../apis/api";
import style from './index.module.scss'
import { ColumnsType } from "antd/es/table";
import ModifyForm from '../../../components/doctorManagement/ModifyForm'

type DataType = {
  doctorId: number | null;
  departmentId: number;
  doctorName: string;
  doctorSex: number;
  doctorAge: number;
  doctorTel: string;
  doctorPassword: string;
  userIdentity: number;
}

export default function View() {
  /* 查找列表开始 */

  // 搜索框
  const [showSearch, setShowSearch] = useState(true);
  // 查到的数据
  const [tableList, setTableList] = useState<QueryAPIRes>();
  // 加载状态
  const [loading, setLoading] = useState(true);

  // 字段数组
  let options: Array<optionsType> = [
    { value: 'doctor_name', label: '医生姓名' },
    { value: 'doctor_tel', label: '医生电话' },
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
    const tableList = await getDoctorAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])

  // 顶部按钮
  const topBtn = <Button style={{ margin: '6px 0px' }} type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => { setShowSearch(!showSearch) }} />

  /* 查找列表结束 */

  /* 表格开始 */

  // 删除
  const deleteBtn = async (id: number) => {
    const deleteFlag = await delDoctorAPI(id)
    deleteFlag.code === 0 ? message.success(deleteFlag.msg) : message?.success(deleteFlag.msg);
    queryFunc()
  }

  // 表头
  const columns: ColumnsType<DataType> = [
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
      title: '所在科室',
      dataIndex: 'departmentName',
      align: 'center',
    },
    {
      title: '医生性别',
      dataIndex: 'doctorSex',
      align: 'center',
      render: (_, record) => {
        return (
          <div>{record.doctorSex === 1 ? '男' : '女'}</div>
        )
      }
    },
    {
      title: '医生年龄',
      dataIndex: 'doctorAge',
      align: 'center',
    },
    {
      title: '医生电话',
      dataIndex: 'doctorTel',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 200,
      render: (_, record) => {
        return (
          <Space>
            <ModifyForm title={'修改医生：'+record.doctorName} doctorId={record.doctorId as number} columns={columns} queryFunc={queryFunc}/>
            <Popconfirm
              placement="bottomRight"
              title={'删除'}
              description={'确认删除医生 ' + record.doctorName + ' 吗？'}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okText="确认删除"
              cancelText="取消"
              onConfirm={() => deleteBtn(record.doctorId as number)}
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
  /* 表格结束 */

  return (
    <Card className={style.allPage} size='small' title="医生信息管理" extra={topBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      <div style={showSearch ? { display: 'none' } : { display: 'block' }}>
        <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} />
      </div>
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='doctorId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        scroll={{ x: 600, }}
      />
    </Card>
  )
}
