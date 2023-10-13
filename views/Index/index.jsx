import { Component } from "react";
import { Outlet,NavLink } from "react-router-dom";
import { Tabbar } from "react-vant";
import { ShoppingCartO, HomeO, UserO,AppsO } from "@react-vant/icons";
import WithRoute from "../../router/WithRouter";

class Index extends Component {
  render() {
    return (
      <div style={{backgroundColor:"#f1f1f1",overflow:"hidden"}}>  
        {/* <h1>Index一级路由</h1> */}
        {<Outlet></Outlet>}
        <div style={{width:"100%",height:"50px"}}></div>
        <div>
        <Tabbar activeColor='red' inactiveColor='#000' value={this.props.active}>
          <Tabbar.Item icon={<HomeO />}><NavLink to="home">首页</NavLink></Tabbar.Item>
          <Tabbar.Item icon={<AppsO />}><NavLink to="catego">分类</NavLink></Tabbar.Item>
          <Tabbar.Item icon={<ShoppingCartO />}> <NavLink to="car" >购物车</NavLink></Tabbar.Item>
          <Tabbar.Item icon={<UserO />}> <NavLink to="mine">我的</NavLink></Tabbar.Item>
        </Tabbar>
        </div>
      </div>
    );
  }
}

export default WithRoute(Index);
