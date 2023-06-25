import React, { lazy } from 'react'
// 加载组件
import LoadingPage from '../components/LoadingPage'

// 懒加载
const Home = lazy(() => import("../views/Home"))
const Login = lazy(() => import("../views/Login"))
const Index = lazy(() => import("../views/Index"))
const InformationManagement = lazy(() => import("../views/departmentManagement/InformationManagement"))
const PatientInformationManagement = lazy(() => import("../views/PatientInformationManagement"))
const DoctorJobTransfer = lazy(() => import("../views/departmentManagement/DoctorJobTransfer"))
const DoctorRegistration = lazy(() => import("../views/doctorManagement/DoctorRegistration"))
const DoctorInformationManagement = lazy(() => import("../views/doctorManagement/DoctorInformationManagement"))
const PersonalInformationManagement = lazy(() => import("../views/systemSettings/PersonalInformationManagement"))

// 重定向组件
import { Navigate, RouteObject } from 'react-router-dom'
// 写法简化
const withLoadingComponent = (comp: JSX.Element) => (
    // 懒加载
    <React.Suspense fallback={<LoadingPage />}>
        {comp}
    </React.Suspense>
)


// 医生路由
const adminRouter: RouteObject[] = [
    {
        // 首页
        id:"1",
        path: "/index",
        element: withLoadingComponent(<Index />)
    },
    {
        // 科室信息管理
        id:"1",
        path: "/informationManagement",
        element: withLoadingComponent(<InformationManagement />)
    },
    {
        // 医生岗位迁移
        id:"1",
        path: "/doctorJobTransfer",
        element: withLoadingComponent(<DoctorJobTransfer />)
    },
    {
        // 医生注册登记
        id:"1",
        path: "/doctorRegistration",
        element: withLoadingComponent(<DoctorRegistration />)
    },
    {
        // 医生信息管理
        id:"1",
        path: "/doctorInformationManagement",
        element: withLoadingComponent(<DoctorInformationManagement />)
    },
    {
        // 患者信息管理
        id:"1",
        path: "/patientInformationManagement",
        element: withLoadingComponent(<PatientInformationManagement />)
    },
    {
        // 个人信息管理
        id:"1",
        path: "/personalInformationManagement",
        element: withLoadingComponent(<PersonalInformationManagement />)
    },
]

const routes = [
    // 嵌套路由
    {
        path: "/",
        element: <Navigate to="/login" />
    },
    {
        path: "/",
        element: <Home />,
        children: [{}]
    },
    {
        path: "/login",
        element: withLoadingComponent(<Login />)
    },
]

routes[1].children = adminRouter


export default routes


