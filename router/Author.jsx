import { Navigate } from "react-router-dom";

// 封装鉴权组件
function Author(props) {
  // 先获取本地的token
  let token = localStorage.getItem("token");
  if (token) {
    // 如果token存在
    return <div>{props.OldComponent}</div>;
  }

  // 若本地token不存在，则跳转到登录页面
  return <Navigate to={`/login?readyUrl=${props.oldPath}`}></Navigate>;
}

export default Author;
