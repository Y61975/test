import { Component } from "react";
import RouterView from "./router/index";

class App extends Component{
      render(){
        return <div>
            {/* <h1>App组件</h1> */}
            {/* 展示路由表导出的模块 */}
            <RouterView></RouterView>
        </div>
    }

    }
  


export default App