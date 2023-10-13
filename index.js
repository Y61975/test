import React from "react";
import  ReactDOM  from "react-dom/client";
import App from "./App";
import {HashRouter} from "react-router-dom";
import back from "./utils/back";
import plusReady from "./utils/plusReady";

//  将plusReady 挂载到组件实例对象原型属性上
React.Component.prototype.$plusReady = plusReady;
React.PureComponent.prototype.$plusReady = plusReady;

back();
// 引入路由缓存插件
// import {AliveScope} from "react-activation";

let root=ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <HashRouter>
            <App></App>
    </HashRouter>
)