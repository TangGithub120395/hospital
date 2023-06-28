// 统一管理项目中所有的请求路径 api
import { AxiosRequestConfig } from "axios";
import request from "./index"

/* 登录页面开始 */

// 登录
export const LoginAPI = (params: LoginAPIReq): Promise<LoginAPIRes> => request.post("/user/login", params);

// 注册
export const RegisterAPI = (params: RegisterAPIReq): Promise<RegisterAPIRes> => request.post("/user/register", params);

/* 登录页面结束 */

/* 科室管理开始 */

// 科室信息管理
// 增
export const addInformationManagementAPI = (params: object): Promise<CurrentAPIRes> => request.post("/department", params);
// 删
export const delInformationManagementAPI = (params: number): Promise<CurrentAPIRes> => request.delete("/department/" + params);
// 改
export const updateInformationManagementAPI = (params: object): Promise<CurrentAPIRes> => request.put("/department", params);
// 查
export const getInformationManagementAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/department", {params});

/* 科室管理结束 */


export { }