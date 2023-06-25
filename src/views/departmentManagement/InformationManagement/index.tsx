import React, { useEffect, useState } from 'react'
import { Card, Button, Space } from 'antd';
import {
  SearchOutlined,
  PlusOutlined
} from '@ant-design/icons';

// 拿搜索表单
import SearchForm from '../../../components/SearchForm'

// 拿接口
import { addInformationManagementAPI, delInformationManagementAPI, updateInformationManagementAPI, getInformationManagementAPI } from "../../../apis/api.ts";
import { AxiosRequestConfig } from 'axios';

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
  const [tableList, setTableList] = useState({});

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
    // 发起登录请求
    const tableList = await getInformationManagementAPI(searchForm)
    setTableList(tableList)
  };

  console.log(tableList);



  // 顶部按钮
  // pc端
  const pcTopBtn =
    <Space>
      <Button type="primary" shape="circle" icon={<SearchOutlined />} />
      <Button type="primary" shape="circle" icon={<PlusOutlined />} />
    </Space>

  return (
    <Card title="科室信息管理" extra={pcTopBtn} bordered={false} style={{ width: '100%', height: '100%' }}>
      <SearchForm options={options} queryFunc={queryFunc} />
    </Card>
  )
}
