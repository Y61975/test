import { Component } from "react";
import SearVal from "./Search";
import Banner from "./Banner";
import Rank from "./Rank";
import Sort from "./Sort";
class Home extends Component {
  componentDidMount() {
    // 更改导航栏背景颜色
    this.$plusReady(() => {
        plus.navigator.setStatusBarBackground("#FF0000");
		plus.navigator.setStatusBarStyle("light");
    });
  }
  render() {
    return (
      <div>
        <SearVal></SearVal>
        <Banner></Banner>
        <Rank></Rank>
        <Sort></Sort>
        {/* <h1>Home二级路由</h1> */}
      </div>
    );
  }
}

export default Home;
