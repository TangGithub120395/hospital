import React, { useRef } from 'react'
import Head from '../../components/Head'
import Menu from '../../components/Menu'
import Content from '../../components/Content'
import home from './index.module.scss'
import { Col, Row, } from 'antd';

export default function index() {
  let headRef: any = useRef();

  const chanegFlag = (e: any) => {
    let flag: boolean
    e.nativeEvent.target.scrollTop >= 50 ? flag = true : flag = false
    headRef.current.func(flag)
  }
  return (
    <div className={home.allPage}>
      <Head onRef={headRef}></Head>
      <Row>
        <Col span={4} offset={0}>
          <Menu ></Menu>
        </Col>
        <Col span={20} offset={0} style={{ height: 'Calc( 100vh - 60px )', overflowX: 'hidden', overflowY: 'auto' }} onScroll={chanegFlag} >
          <div style={{ margin: '10px 100px' }}>
            <Content></Content>
          </div>
        </Col>
      </Row>
    </div>
  )
}
