import { Button, Space, message, Avatar, Upload } from 'antd';
import { RedoOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import styles from './index.module.scss'
// 引入cookie
import cookie from 'react-cookies'
// 拿cookie
let userData = cookie.load("userData")

interface PropsType {
  headImgUrl?: string | null;
  refresh: Function;
}

const uploadHeadImg: React.FC<PropsType> = (props) => {

  const { headImgUrl, refresh } = props;

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // 文件上传
  const uploadProps: UploadProps = {
    name: 'file',
    accept: "image/png, image/jpeg",
    maxCount: 1,
    headers: {
      userId: userData.adminId || userData.patientId || userData.doctorId,
      userIdentity: userData.userIdentity,
    },
    action: `${baseUrl}/file/upload`,
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传png/jpg格式');
      }
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        message.error('文件大小必须小于20MB');
      }
      return isJpgOrPng && isLt2M;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
        refresh();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    }
  };

  return (
    <Space align="end" className={styles.changeHead}>
      <Avatar src={headImgUrl ? baseUrl + headImgUrl : null} shape="square" size={64} icon={<UserOutlined />} />
      <Avatar src={headImgUrl ? baseUrl + headImgUrl : null} shape="square" size="large" icon={<UserOutlined />} />
      <Avatar src={headImgUrl ? baseUrl + headImgUrl : null} size={64} icon={<UserOutlined />} />
      <Avatar src={headImgUrl ? baseUrl + headImgUrl : null} size="large" icon={<UserOutlined />} />
      <Space direction="vertical">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} type="primary">上传更新头像</Button>
        </Upload>
        <Button icon={<RedoOutlined />}>恢复默认头像</Button>
      </Space>
    </Space>
  )
}

export default uploadHeadImg;