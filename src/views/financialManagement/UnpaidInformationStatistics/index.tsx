import { Card } from 'antd'
import style from './index.module.scss'
import { useState } from 'react'
export default function View() {
  const [fanzhuan, setFanzhuan] = useState(false);
  return (
    <Card className={style.allPage} size='small' title="未缴费信息统计" bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      <div className={`${style.fanzhuan} ${fanzhuan? style.fanzhuan_dh:style.fanzhuan_out}`} onClick={()=>setFanzhuan(!fanzhuan)}></div>
    </Card>
  )
}