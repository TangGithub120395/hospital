import { useRoutes,useLocation,useNavigate } from 'react-router-dom'
import {useEffect} from 'react'
import router from './router'
// 引入cookie
import cookie from 'react-cookies'

// 去登录页的组件
function ToLogin(){
  const navigateTo = useNavigate();
  useEffect(()=>{
    navigateTo("/login")
  },[])
  return <div></div>
}

// 去首页的组件
function ToHome(){
  const navigateTo = useNavigate();
  useEffect(()=>{
    navigateTo("/home")
  },[])
  return <div></div>
}



// 路由守卫
function BeforeRouterEnter(){
  const outlet = useRoutes(router); 

  // 拿当前路由信息
  const location = useLocation();   
  // 拿cookie
  let nowCookie = cookie.load("userData")

  if (location.pathname !== "/login"  && !nowCookie) {
    return <ToLogin />
  }

  if (location.pathname === "/login"  && nowCookie) {
    return <ToHome />
  }

  return outlet
}

function App() {
  return (
    <div>
      <BeforeRouterEnter />
    </div>
  )
}

export default App
