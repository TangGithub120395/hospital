// 统一管理项目中所有的请求路径 api
import request from "./index"

/* 登录页面开始 */

// 登录
export const LoginAPI = (params: LoginAPIReq):Promise<LoginAPIRes> => request.post("/user/login", params);

// 注册
export const RegisterAPI = (params: RegisterAPIReq):Promise<RegisterAPIRes> => request.post("/user/register", params);

/* 登录页面结束 */



export {}