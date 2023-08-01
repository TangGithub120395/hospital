import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import { Card, Descriptions, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { findPrescriptionDrugAPI } from "../../../apis/api";

interface PropsType {
  registerId: number;
}

interface DrugDataType {
  medicineId: number;
  registerId: number;
  drugsName: string;
  medicineNum: number;
  medicineNotes: string;
}

interface PrescriptionDrugType {
  patientName: string;
  patientSex: number;
  patientAge: number;
  patientNumber: number;
  patientTel: string;
  prescriptionDiagnosis: string;
  prescriptionTime: string;
  children: DrugDataType[];
}

const columns: ColumnsType<DrugDataType> = [
  {
    title: '序号',
    align: 'center',
    render: (checked, record, index) => <p>{index + 1}</p>,
    width: 80
  },
  {
    title: '药品名称',
    dataIndex: 'drugsName',
    key: 'drugsName',
    align: 'center',
    width: 200
  },
  {
    title: '药品数量',
    dataIndex: 'medicineNum',
    key: 'medicineNum',
    align: 'center',
    width: 200
  },
  {
    title: '使用方法',
    dataIndex: 'medicineNotes',
    key: 'medicineNotes',
    align: 'center',
  },
];


const View: React.FC<PropsType> = ({ registerId }) => {

  const [prescriptionDrug, setPrescriptionDrug] = useState<PrescriptionDrugType>();

  const findPrescriptionDrug = async () => {
    const { data } = await findPrescriptionDrugAPI(registerId)
    setPrescriptionDrug(data as PrescriptionDrugType);
  }

  useEffect(() => { findPrescriptionDrug() }, [])

  return (

    <Card className={style.allPage}>
      <Descriptions layout="vertical" bordered size='small'>
        <Descriptions.Item label="患者姓名">{prescriptionDrug?.patientName}</Descriptions.Item>
        <Descriptions.Item label="患者性别">{prescriptionDrug?.patientSex == 1 ? '男' : '女'}</Descriptions.Item>
        <Descriptions.Item label="患者年龄">{prescriptionDrug?.patientAge}</Descriptions.Item>
        <Descriptions.Item label="电话号码">{prescriptionDrug?.patientTel}</Descriptions.Item>
        <Descriptions.Item label="身份证号">{prescriptionDrug?.patientNumber}</Descriptions.Item>
        <Descriptions.Item label="处方开具时间">{prescriptionDrug?.prescriptionTime}</Descriptions.Item>
        <Descriptions.Item label="病理诊断">{prescriptionDrug?.prescriptionDiagnosis}</Descriptions.Item>
      </Descriptions>
      <Table style={{ marginTop: '15px' }} rowKey='medicineId' pagination={false} bordered size='small' columns={columns} dataSource={prescriptionDrug?.children} />
    </Card>
  )
}

export default View;