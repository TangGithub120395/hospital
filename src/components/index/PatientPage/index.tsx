import type { CollapseProps } from 'antd';
import { Card, Collapse } from 'antd'
import style from './index.module.scss'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
  },
];
export default function View() {
  return (
    <div className={style.allPage}>
    <div className={style.topBox}>
      <Card size='small' title="通知栏" bordered={false} style={window.innerWidth < 700 ? { marginTop: '15px' } : { width: '49.5%' }}>
      <Collapse accordion items={items} />
      </Card>
        <Card size='small' title="通知栏" bordered={false} style={window.innerWidth < 700 ? { marginTop: '15px' } : { width: '49.5%' }}>
        </Card>
    </div>
    </div>
  )
}