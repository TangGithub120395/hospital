import { Card } from 'antd'
import style from './index.module.scss'
// 引入cookie
import cookie from 'react-cookies'
import AdminPage from '../../../components/systemSettings/AdminPage'
import DoctorPage from '../../../components/systemSettings/DoctorPage'
import PatientPage from '../../../components/systemSettings/PatientPage'
export default function View() {

  // 拿用户信息
  let userData = cookie.load("userData")

  // 判断哪个用户登录
  let showPage
  if (userData.userIdentity === 1) {
    showPage = <AdminPage />
  } else {
    showPage = userData.userIdentity === 2 ? <DoctorPage /> : <PatientPage />
  }

  return (
    <Card className={style.allPage} size='small' title="个人信息管理" bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {showPage}
    </Card>
  )
}