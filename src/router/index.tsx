import React, { lazy } from 'react'
// 加载组件
import LoadingPage from '../components/LoadingPage'

// 懒加载
const Home = lazy(() => import("../views/Home"))
const Login = lazy(() => import("../views/Login"))

// 重定向组件
import { Navigate } from 'react-router-dom'
// 写法简化
const withLoadingComponent = (comp: JSX.Element) => (
    // 懒加载
    <React.Suspense fallback={<LoadingPage/>}>
        {comp}
    </React.Suspense>
)

const routes = [
    {
        path: "/",
        element: <Navigate to="/login"></Navigate>
    },
    {
        path: "/login",
        element: withLoadingComponent(<Login />)
    },
    {
        path: "/home",
        element: withLoadingComponent(<Home />)
    },
]

export default routes