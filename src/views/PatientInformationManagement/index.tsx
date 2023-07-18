import { Button, Card, Popconfirm, Space, message } from 'antd'
import style from './index.module.scss'
import { SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { delPatientAPI, quertPatientAPI } from '../../apis/api';
import SearchForm from '../../components/SearchForm';
import Table, { ColumnsType } from 'antd/es/table';
import ModifyPatientForm from '../../components/PatientInformationManagement/ModifyPatientForm';
interface PatientDataType {
  patientId: number;
  patientName: string;
  patientSex: number;
  patientAge: number;
  patientNumber: number;
  patientTel: string;
  patientPassword: string;
  userIdentity: number;
}

type ColumnsDataType = {
  title: string;
  dataIndex: string;
  align: string;
}

export default function View() {
  // 搜索框
  const [open, setOpen] = useState<boolean|null>(null);
  
  // 字段下拉
  let options: Array<optionsType> = [
    { value: 'patient_name', label: '患者姓名' },
    { value: 'patient_tel', label: '患者手机号' },
    { value: 'patient_number', label: '患者身份证号' },
  ]
  // 搜索表单
  let searchForm = {
    key: options[0].value,
    value: "",
    pageNum: 1,
    pageSize: 10
  }
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
  // 查到的数据
  const [tableList, setTableList] = useState<QueryAPIRes>();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 查找接口
  const queryAPI = async (searchForm: AxiosRequestConfig<QueryAPIReq>) => {
    // 发起查找请求
    const tableList = await quertPatientAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  /* 表格开始 */

  // 删除
  const deleteBtn = async (id: number) => {
    const deleteFlag = await delPatientAPI(id)
    deleteFlag.code === 0 ? message.success(deleteFlag.msg) : message?.success(deleteFlag.msg);
    queryFunc()
  }

  // 表头
  const columns: ColumnsType<PatientDataType> = [
    {
      title: 'ID',
      dataIndex: 'patientId',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 80,
    },
    {
      title: '患者姓名',
      dataIndex: 'patientName',
      align: 'center',
    },
    {
      title: '患者性别',
      dataIndex: 'patientSex',
      align: 'center',
      render: (record) => {
        return (
          <div>{record == 1 ? '男' : '女'}</div>
        )
      }
    },
    {
      title: '患者年龄',
      dataIndex: 'patientAge',
      align: 'center',
    },
    {
      title: '患者身份证号',
      dataIndex: 'patientNumber',
      align: 'center',
    },
    {
      title: '患者电话',
      dataIndex: 'patientTel',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 200,
      render: (record:PatientDataType) => {
        return (
          <Space>
            <ModifyPatientForm title={'修改患者：' + record.patientName} patientData={record} columns={columns as Array<ColumnsDataType>} queryFunc={queryFunc} />
            <Popconfirm
              placement="bottomRight"
              title={'删除'}
              description={'确认删除患者 ' + record.patientName + ' 吗？'}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okText="确认删除"
              cancelText="取消"
              onConfirm={() => deleteBtn(record.patientId as number)}
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

  // 顶部按钮
  // pc端
  const pcTopBtn =
    <Space>
      <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={()=>open === null ? setOpen(true) : setOpen(!open)} />
    </Space>

  return (
    <Card className={style.allPage} size='small' title="患者信息管理" extra={pcTopBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* 搜索组件 */}
      <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} open={open} />
      {/* 表格组件 */}
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='patientId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        scroll={{ x: 600, }}
      />
    </Card>
  )
}
