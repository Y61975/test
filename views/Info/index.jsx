import { PureComponent } from "react";
import "./Info.css";
import WithRoute from "../../router/WithRouter";
import {
  Swiper,
  Image,
  ActionBar,
  ShareSheet,
  Toast,
  Tabs,
  Skeleton,
} from "react-vant";
import sendAxios from "../../router/sendAxios";
import { CartO, StarO, Ellipsis, ArrowLeft } from "@react-vant/icons";
import Goods from "./Goods";
import Recom from "./Recommend";

class Info extends PureComponent {
  constructor(props) {
    super(props);
    // 更改this.指向
    this.getaddmsg = this.getaddmsg.bind(this);
    this.getclose = this.getclose.bind(this);
    this.state = {
      goodsInfo: null, // 商品信息
      bannerList: [], // 轮播图列表
      attr: [], // 定义子组件的初始数据
      visible: false, // 定义分享按钮的状态
      shopcar: false, // 定义弹出框的控制
      options: [
        [
          { name: "微信", icon: "wechat", type: "weixin" },
          { name: "朋友圈", icon: "wechat-moments", type: "weixin" },
          { name: "微博", icon: "weibo", type: "sinaweibo" },
          { name: "QQ", icon: "qq", type: "qq" },
        ],
        [
          { name: "复制链接", icon: "link" },
          { name: "分享海报", icon: "poster" },
          { name: "二维码", icon: "qrcode" },
          { name: "小程序码", icon: "weapp-qrcode" },
        ],
      ],
      specsid: 0, // 选中商品规格 id
      productid: 0, // 选中商品id
      amount: 1, //选中商品数量

      //  定义点击收藏时的状态·
      collect: false,

      //  骨架屏
      isShow: true,
      //  定义分享服务商
      shareList: {},
    };
  }
  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    // 更改导航栏背景颜色
    this.$plusReady(() => {
      // 保证this指向正常
      let that = this;
      plus.navigator.setStatusBarBackground("#FFFFFF");
      plus.navigator.setStatusBarStyle("dark");

      //  分享功能
      plus.share.getServices((val) => {
        // console.log(JSON.stringify(val));
        val.forEach((item) => {
          that.state.shareList[item.id] = item;
        });
        that.setState({
          shareList: that.state.shareList,
        });
      });
    });

    // console.log(this.props.router.location.state.id);
    let id = this.props.router.location.state.id;
    let res = await sendAxios(`/product/detail/${id}?type=normal`, "get");
    // console.log(res.data.data);

    //  监听页面滚动
    window.onscroll = () => {
      // 获取屏幕的宽
      let wid = document.documentElement.clientWidth;

      // 获取滚动的距离
      let top = document.documentElement.scrollTop;

      let view = document.querySelector(".rv-sticky");
      if (top >= wid) {
        view.style.display = "block";
      } else {
        view.style.display = "none";
      }
    };
    this.setState({
      bannerList: JSON.parse(res.data.data.productInfo.sliderImage),
      goodsInfo: res.data.data,
      attr: res.data.data.productAttr,
      isShow: false,
    });
  }

  // 组件卸载时
  componentWillUnmount() {
    // 清除滚动监听事件
    window.onscroll = null;
  }

  render() {
    let { bannerList, goodsInfo, options, attr, isShow } = this.state;
    return (
      <Skeleton
        rowHeight={[70, 20, 20, 20, 20, 20]}
        rowWidth={["100%", "100%", "100%", "100%", "100%", "100%"]}
        row={6}
        loading={isShow}
        animate={true}
        title={true}
        titleWidth="100%"
        round={false}
      >
        <div style={{ backgroundColor: "#F1F1F1" }}>
          <div className="topNav">
            <div
              className=" topbtn topLeft"
              onClick={() => {
                this.props.router.navigate(-1);
              }}
            >
              <ArrowLeft color="#3F45FF" />
            </div>
            <div
              className=" topbtn topRight"
              onClick={() => {
                this.setState({
                  visible: true,
                });
              }}
            >
              <Ellipsis />
            </div>
            <ShareSheet
              visible={this.state.visible}
              options={options}
              title="分享给好友"
              onCancel={() => {
                this.setState({ visible: false });
              }}
              onSelect={(val, index) => this.share(val)}
            />
          </div>
          <Tabs
            sticky
            scrollspy={{ autoFocusLast: true, reachBottomThreshold: 50 }}
            defaultActive="goods"
          >
            <Tabs.TabPane name={"goods"} title={`商品`}>
              {bannerList.length !== 0 && (
                <Swiper autoplay={2000}>
                  {bannerList.map((item, index) => (
                    <Swiper.Item key={index}>
                      <Image lazyload src={item} />
                    </Swiper.Item>
                  ))}
                </Swiper>
              )}
              {bannerList.length === 0 && <Image width="100%" height="50vh" />}
              <ActionBar style={{ zIndex: "4000" }}>
                <ActionBar.Icon
                  icon={<CartO />}
                  badge={{ content: 0 }}
                  text="购物车"
                  onClick={() => {
                    // 跳转到购物车界面
                    this.props.router.navigate("/index/car");
                  }}
                />
                <ActionBar.Icon
                  icon={<StarO />}
                  badge={{ dot: true }}
                  text="收藏"
                  onClick={() => this.changecollect()}
                />
                <ActionBar.Button
                  type="warning"
                  text="加入购物车"
                  onClick={() => this.setshopcar()}
                />
                <ActionBar.Button
                  type="danger"
                  text="立即购买"
                  onClick={() => this.buygoods()}
                />
              </ActionBar>
              {/* 子组件 */}

              {attr.length !== 0 && (
                <Goods
                  goodsInfo={goodsInfo}
                  attr={attr}
                  getaddmsg={this.getaddmsg}
                  shopcar={this.state.shopcar}
                  getclose={this.getclose}
                ></Goods>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane name={"goods"} title={`推荐`}>
              {attr.length !== 0 && (
                <Recom productInfo={goodsInfo.productInfo}></Recom>
              )}
            </Tabs.TabPane>
          </Tabs>
          {/* <h1>Info一级路由</h1> */}
        </div>
      </Skeleton>
    );
  }

  //  分享功能
  share = (val) => {
    if (!this.$plusReady) {
      return;
    }
    // console.log(val,index);
    let find = val.type;
    console.log(this.state.shareList);
    let serve = this.state.shareList[find];
    console.log(serve);
    serve.send({
      type: "web",
      title: "测试",
      content: "我做的APP分享功能，现在在进行测试",
      thumbs: "https://w.wallhaven.cc/full/85/wallhaven-85gl1o.jpg", //  封面图
      href: "https://www.aplaybox.com/", // 分享地址
      extra:
        find === "weixin"
          ? {
              //  分享到朋友圈
              scene: "WXSceneSession",
            }
          : null,
      interface: find === "sinaweibo" ? "auto" : null,
    });
  };

  getclose(con) {
    // console.log(con);
    this.setState({
      shopcar: con,
    });
  }

  getaddmsg(msg) {
    // console.log(msg);
    let { specsid, productid, amount, shopcar } = msg;
    // console.log(shopcar);
    this.setState({
      specsid,
      productid,
      amount,
    });
  }

  async setshopcar() {
    let { shopcar } = this.state;
    if (shopcar === false) {
      this.setState({
        shopcar: true,
      });
    } else {
      let token = localStorage.getItem("token");
      if (!token) {
        this.props.router.navigate("/login");
      } else {
        // console.log("调用添加商品的接口并且弹出一个轻提示框");
        let { specsid, productid, amount } = this.state;
        let res = await sendAxios("/cart/save", "post", {
          cartNum: `${amount}`,
          isNew: false,
          productAttrUnique: `${specsid}`,
          productId: `${productid}`,
        });
        // console.log(res);
        Toast.success("添加成功");
        this.setState({
          shopcar: false,
        });
      }
    }
  }

  // 立即购买
  async buygoods() {
    let { shopcar, specsid, productid, amount } = this.state;
    if (shopcar === false) {
      this.setState({
        shopcar: true,
      });
    } else {
      let token = localStorage.getItem("token");
      if (!token) {
        this.props.router.navigate("/login");
        return;
      }
      Toast.success("跳转成功");
      let order = [];
      order.push({
        attrValueId: specsid,
        productId: productid,
        productNum: amount,
      });
      this.props.router.navigate("/carInfo", {
        state: { order, isNow: true },
      });
      this.setState({
        shopcar: false,
      });
    }
  }

  //  收藏
  async changecollect() {
    let { goodsInfo, collect } = this.state;
    let id = goodsInfo.productInfo.id;
    if (collect === true) {
      let res = await sendAxios(`/collect/cancel/${id}`, "post");
      // console.log(res);
      Toast.success("取消收藏成功");
      this.setState({
        collect: false,
      });
    } else {
      let res1 = await sendAxios(
        "/collect/add",
        "post",
        {
          category: "product",
          id: `${id}`,
        },
        "application/json"
      );
      // console.log(res1);
      Toast.success("收藏成功");
      this.setState({
        collect: true,
      });
    }
  }
}

export default WithRoute(Info);
