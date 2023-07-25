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
export const getInformationManagementAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/department", { params });
/* 科室管理结束 */

/* 医生管理开始 */
// 医生注册
export const addDoctorAPI = (params: object): Promise<CurrentAPIRes> => request.post("/doctor", params);
//查全部科室
export const queryAllDepartmentAPI = (): Promise<QueryAPIRes> => request.get("/department/queryAllDepartment");
// 根据科室id查全部医生
export const queryDepartmentDoctorAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/doctor/queryDepartmentDoctor", { params });
// 根据id查医生
export const queryOneDoctorAPI = (params: number): Promise<CurrentAPIRes> => request.get("doctor/queryOneDoctor/" + params);
// 修改医生科室
export const updateDoctorDepartmentAPI = (params: object): Promise<CurrentAPIRes> => request.put("/doctor/updateDoctorDepartment", params);
// 删
export const delDoctorAPI = (params: number): Promise<CurrentAPIRes> => request.delete("/doctor/" + params);
// 改
export const updateDoctorAPI = (params: object): Promise<CurrentAPIRes> => request.put("/doctor", params);
// 查
export const getDoctorAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/doctor", { params });
/* 医生管理结束 */

/* 患者信息管理开始 */
// 增
export const addPatientAPI = (params: object): Promise<CurrentAPIRes> => request.post("/patient", params);
// 删
export const delPatientAPI = (params: number): Promise<CurrentAPIRes> => request.delete("/patient/" + params);
// 改
export const updatePatientAPI = (params: object): Promise<CurrentAPIRes> => request.put("/patient", params);
// 查
export const quertPatientAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/patient", { params });
/* 患者信息管理结束 */

/* 药品管理开始 */
// 缺货统计
// 查少于一定数量的药品
export const getScarceDrugsAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("drugs/getScarceDrugs", { params });
// 补货
export const drugReplenishment = (params: object): Promise<CurrentAPIRes> => request.put("/drugs/drugReplenishment", params);
// 药品出入库
// 增
export const adddrugsAPI = (params: object): Promise<CurrentAPIRes> => request.post("/drugs", params);
// 删
export const deldrugsAPI = (params: number): Promise<CurrentAPIRes> => request.delete("/drugs/" + params);
// 改
export const updatedrugsAPI = (params: object): Promise<CurrentAPIRes> => request.put("/drugs", params);
// 查
export const quertdrugsAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/drugs", { params });
/* 药品管理结束 */

/* 系统设置开始 */
// 个人信息管理
// 查管理员信息
export const findAdminByIdAPI = (params: number): Promise<CurrentAPIRes> => request.get("/userAdmin/findAdminById/" + params);
// 改管理员信息
export const updateAdminAPI = (params: object): Promise<CurrentAPIRes> => request.put("/userAdmin/", params);
// 查患者
export const findPatientByIdAPI = (params: number): Promise<CurrentAPIRes> => request.get("/patient/findPatientById/" + params);
// 根据科室id查科室
export const queryDepartmentNameAPI = (params: number) => request.get("/department/queryDepartmentName/" + params);
/* 系统设置结束 */

/* 预约挂号-患者 */
// 增
export const addRegisterAPI = (params: object): Promise<CurrentAPIRes> => request.post("/register", params);
// 删
export const delRegisterAPI = (params: number): Promise<CurrentAPIRes> => request.delete("/register/" + params);
// 改
export const updateRegisterAPI = (params: object): Promise<CurrentAPIRes> => request.put("/register", params);
// 查
export const queryRegisterAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/register", { params });
// 根据科室id查医生
export const findDoctorAPI = (params: number): Promise<CurrentAPIRes> => request.get("/register/" + params);
/* 预约挂号-患者 */

/* 预约信息-医生 */
// 查
export const queryDoctorPageAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/register/queryDoctorPage", { params });
// 更改状态
export const stateChangeAPI = (params: number): Promise<CurrentAPIRes> => request.put("/register/stateChange/" + params);
/* 预约信息-医生 */

/* 处方开具-医生 */
// 查
export const queryPrescriptionPageAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/register/queryPrescriptionPage", { params });
// 更改状态
// export const stateChangeAPI = (params: number): Promise<CurrentAPIRes> => request.put("/register/stateChange/" + params);
/* 处方开具-医生 */
