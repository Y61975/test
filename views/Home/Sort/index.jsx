import { Component } from "react";
import "./Sort.css";
import sendAxios from "../../../router/sendAxios";
import WithRoute from "../../../router/WithRouter";
import Lazyimg from "react-lazyimg-component";
import loadingpng from "../../../assets/loading.png";
import { List } from "react-vant";

class Sort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navList: [],
      activeIndex: 0,
      goodsList: [],
      finished: false,
      type: 1,
      page: 1,
      limit: 10,
      isLoading: false,
    };
  }

  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    let res = await sendAxios("/index", "get");
    let res1 = await sendAxios(
      `/index/product/1/?page=${this.state.activeIndex + 1}&limit=10`
    );
    this.setState({
      navList: res.data.data.explosiveMoney,
      goodsList: res1.data.data.list,
    });
  }
  render() {
    let { navList, activeIndex, goodsList, finished } =
      this.state;
    return (
      <>
        <div className="nav">
          {navList.map((item, index) => {
            return (
              <div
                className="nav_list"
                key={index}
                onClick={() => {
                  this.setState(
                    {
                      activeIndex: index,
                      page: 1,
                      limit: 10,
                      type: index + 1,
                      goodsList: [],
                      finished: false,
                    },
                    () => {
                      this.sendHttp(
                        this.state.type,
                        this.state.page,
                        this.state.limit
                      );
                    }
                  );
                }}
              >
                <p
                  className={[
                    "top",
                    activeIndex === index ? "active_top" : null,
                  ].join(" ")}
                >
                  {item.name}
                </p>
                <p
                  className={[
                    "btom",
                    activeIndex === index ? "active_btom" : null,
                  ].join(" ")}
                >
                  {item.info}
                </p>
              </div>
            );
          })}
        </div>
        <div className="goodsList">
          {goodsList.map((item, index) => {
            return (
              <div
                className="goods_item"
                key={index}
                onClick={() => this.goinfo(item)}
              >
                <Lazyimg
                  className="lazy"
                  src={item.image}
                  placeholder={<img src={loadingpng} alt="加载失败" />}
                />
                <div className="goods_info">
                  <p className="goodsName">{item.storeName}</p>
                  <p className="old_price">￥{item.otPrice}</p>
                  <p className="new_price">￥{item.price}</p>
                </div>
              </div>
            );
          })}
        </div>
        <List
          finished={finished}
          errorText="请求失败，点击重新加载"
          onLoad={() => this.onLoad()}
        ></List>
      </>
    );
  }
  async sendHttp(index, page, limit) {
    // let { page, limit } = this.state;
    let res3 = await sendAxios(
      `/index/product/${index}/?page=${page}&limit=${limit}`
    );
    //  console.log(res3);
    if (res3.data.data.list.length === 0) {
      this.setState({
        finished: true,
      });
    }
    this.setState({
      goodsList: [...this.state.goodsList, ...res3.data.data.list],
      isLoading: false,
    });
  }

  goinfo = (item) => {
    this.props.router.navigate("/info", { state: { id: item.id } });
    // console.log(item);
  };
  onLoad() {
    let { type, page, limit, isLoading } = this.state;
    if (isLoading) {
      return;
    }
    page++;
    this.setState({
      page,
      isLoading: true,
    });
    // console.log(type);
    this.sendHttp(type, page, limit);
  }
}

export default WithRoute(Sort);
