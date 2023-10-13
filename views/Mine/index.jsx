import { Component } from "react";
import "./mine.css";
import sendAxios from "../../router/sendAxios";
import { Grid, Toast } from "react-vant";
import {
  TodoList,
  BalanceList,
  Underway,
  GoodJob,
  Question,
  Location,
  Service,
} from "@react-vant/icons";
import WithRoute from "../../router/WithRouter";

class Mine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "", //用户名字
      userphone: "", //用户电话
      money: "", // 用户剩余余额
      integral: 0, // 积分
      coupon: 0, // 优惠卷
      collect: 0, //用户收藏
      userimg: "", //用户头像
      orderlist: [
        {
          icon: <TodoList />,
          text: "待付款",
        },
        {
          icon: <BalanceList />,
          text: "待发货",
        },
        {
          icon: <Underway />,
          text: "待收货",
        },
        {
          icon: <GoodJob />,
          text: "待评价",
        },
        {
          icon: <Question />,
          text: "售后",
        },
      ],
    };
  }

  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    let res = await sendAxios("/user", "get");
    // console.log(res);
    if (res.data.code !== 200) {
      Toast(res.data.message);
      return;
    }
    let {
      nickname,
      phone,
      avatar,
      nowMoney,
      integral,
      couponCount,
      collectCount,
    } = res.data.data;
    this.setState({
      username: nickname,
      userphone: phone,
      money: nowMoney,
      integral: integral,
      coupon: couponCount,
      collect: collectCount,
      userimg: avatar,
    });
  }
  render() {
    let {
      userimg,
      username,
      userphone,
      coupon,
      collect,
      integral,
      money,
      orderlist,
    } = this.state;
    return (
      <div className="allmine">
        <div className="mine_bg">
          <div className="mine_userinfo">
            {/* 用户头像和昵称 */}
            <div className="mine_usemsg">
              <div className="user_img" onClick={() => this.gouserinfo()}>
                <img src={userimg} alt="" />
              </div>
              <div className="mine_userin">
                <p>{username}</p>
                <p>{userphone}</p>
              </div>
            </div>
            {/* 用户资产 */}
            <div className="user_property">
              <div className="property_item">
                <div className="property_one">{money}</div>
                <div className="property_two">余额</div>
              </div>
              <div className="property_item">
                <div className="property_one">{integral}</div>
                <div className="property_two">积分</div>
              </div>
              <div className="property_item">
                <div className="property_one">{coupon}</div>
                <div className="property_two">优惠卷</div>
              </div>
              <div className="property_item">
                <div className="property_one">{collect}</div>
                <div className="property_two">收藏</div>
              </div>
            </div>
          </div>
          {/* 订单中心 */}
          <div className="mine_order">
            <div className="order_center">
              订单中心<span onClick={()=>this.lookAll()}>查看全部＞</span>
            </div>
            <div>
              <Grid columnNum={5} border={false} style={{ padding: "0" }}>
                {orderlist.map((item, index) => {
                  return (
                    <Grid.Item
                      icon={item.icon}
                      text={item.text}
                      key={index}
                      iconColor="#E93323"
                    />
                  );
                })}
              </Grid>
            </div>
          </div>

          {/* 我的服务 */}
          <div className="mine_order mine_myserve">
            <div className="order_center">我的服务</div>
            <div>
              <Grid columnNum={5} border={false} style={{ padding: "0" }}>
                <Grid.Item
                  icon={<Location />}
                  text="收获地址"
                  iconColor="#E93323"
                  onClick={() => {
                    this.props.router.navigate("/address");
                  }}
                />
                <Grid.Item
                  icon={<Service />}
                  iconColor="#E93323"
                  text="联系客服"
                  onClick={() => {
                    window.location.href =
                      "https://www14.53kf.com/m.php?cid=72731211&arg=10731211&kf_sign=jc4NjMTY2NI1MTUwMDk4OTk0ODAwMTQ3MjczMTIxMQ%253D%253D&style=1&timeStamp=1677465666438&ucust_id=";
                  }}
                />
              </Grid>
            </div>
          </div>
        </div>

        {/* <h1>Mine二级路由</h1> */}
      </div>
    );
  }
  gouserinfo = () => {
    // console.log(this.props);
    this.props.router.navigate("/mineMsg");
  };

  //  查看全部订单
  lookAll=()=>{
    this.props.router.navigate("/order");
  }
}
export default WithRoute(Mine);
