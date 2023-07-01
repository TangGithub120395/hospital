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

/* 医生管理开始 */
// 医生注册
export const addDoctorAPI = (params: object): Promise<CurrentAPIRes> => request.post("/doctor", params);
//查全部科室
export const queryAllDepartmentAPI = (): Promise<QueryAPIRes> => request.get("/department/queryAllDepartment");
// 根据id查科室
export const queryOneDepartmentAPI = (params: number): Promise<CurrentAPIRes> => request.get("/department/queryOneDepartment/" + params);
// 根据id查医生
export const queryOneDoctorAPI = (params: number): Promise<CurrentAPIRes> => request.get("doctor/queryOneDoctor/" + params);
// 删
export const delDoctorAPI = (params: number): Promise<CurrentAPIRes> => request.delete("/doctor/" + params);
// 改
export const updateDoctorAPI = (params: object): Promise<CurrentAPIRes> => request.put("/doctor", params);
// 查
export const getDoctorAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/doctor", {params});
/* 医生管理结束 */

