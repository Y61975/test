import { Component } from "react";
import { Search } from "react-vant";
import sendAxios from "../../router/sendAxios";
import { Toast } from "react-vant";

import "./housearch.css";
import Nofind from "./Noresult/index";
import Starhot from "./Starhot";
import Homhres from "./Hotrecom/index";

class Hosearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "", // 搜索框的值
      hotkey: [], //热门搜索
      hotrecomd: [], // 热门推荐
      searchres: [], // 搜索结果
      isShow: true, //判断图片是否显示
    };
  }

  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    //  获取推荐搜索关键词
    let kwd = await sendAxios("/search/keyword", "get");
    //  console.log(kwd);
    if (kwd.data.code !== 200) {
      Toast(kwd.data.message);
      return;
    }

    //  获取热门推荐
    let hot = await sendAxios("/product/hot?page=2&limit=8");
    if (hot.data.code !== 200) {
      Toast(hot.data.message);
      return;
    }
    // console.log(hot);
    this.setState({
      hotkey: kwd.data.data,
      hotrecomd: hot.data.data.list,
    });
  }
  render() {
    let { hotkey, searchValue, hotrecomd, searchres, isShow } = this.state;
    return (
      <div>
        <Search
          value={searchValue}
          onChange={(val) => {
            this.setState({
              searchValue: val,
            });
          }}
          placeholder="请输入搜索关键词"
          shape="round"
          background="#fff"
          rightIcon={
            <div
              onClick={() => {
                // console.log("点击了");
                this.setState({
                  isShow: false,
                });
                this.getGoods(searchValue);
              }}
            >
              搜索
            </div>
          }
        />
        <h5 style={{ color: "grey", margin: "6px  0", padding: "0 12px" }}>
          热门搜索
        </h5>
        <div className="hourecomlist">
          {hotkey &&
            hotkey.map((item) => (
              <span
                style={{ marginRight: "6px" }}
                key={item.id}
                onClick={(e) => {
                  const val = e.target.innerHTML;
                  // console.log(val);
                  this.setState({
                    searchValue: val,
                  });
                  this.getGoods(val);
                }}
              >
                {item.title}
              </span>
            ))}
        </div>
        <div className="homseline"></div>
        {/* <h1>搜索页面</h1> */}
        {searchres.length == 0 && !isShow && <Nofind />}
        {searchres.length === 0 ? (
          <Starhot hotrecomd={hotrecomd} />
        ) : (
          <Homhres searesult={searchres} />
        )}
      </div>
    );
  }
  getGoods = async (val) => {
    // console.log(val);
    let res = await sendAxios(`/products?keyword=${val}&page=1&limit=8`);
    // console.log(res);
    if (res.data.code !== 200) {
      Toast(res.data.message);
      return;
    }
    this.setState({
      searchres: res.data.data.list,
      isShow: false,
    });
  };
}

export default Hosearch;
