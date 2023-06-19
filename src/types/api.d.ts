// 定义参数、响应类型

// 注册接口
// 参数
interface RegisterAPIReq {
  patientTel: string;
  patientPassword: string;
}
// 响应
interface RegisterAPIRes {
  code: number;
  data: object;
  msg: string;
}

// 登录接口
// 参数
interface LoginAPIReq {
  tel: string;
  password: string;
}
// 响应
interface LoginAPIRes {
  code: number;
  data: object;
  msg: string;
}