import { Card } from 'antd'
import style from './index.module.scss'
export default function View() {
  return (
    <Card className={style.allPage} size='small' title="预约挂号" bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
    </Card>
  )
}