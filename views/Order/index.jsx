import { Component } from "react";
import "./order.css";
import sendAxios from "../../router/sendAxios";
import Keli from "../../assets/keli.png";
import Load from "../../component/Loading";
import { Toast, Dialog } from "react-vant";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0, // 选项卡
      // type: 0, // 选择的选项
      balance: null, // 余额等信息
      orderdetail: [], // 订单详情
      // textlist: ["待付款", "待发货", "待收货", "待评价", "已完成"],
      textlist: [
        // 订单文本
        { text: "待付款", num: 0 },
        { text: "待发货", num: 0 },
        { text: "待收货", num: 0 },
        { text: "待评价", num: 0 },
        { text: "已完成", num: 0 },
      ],
    };
  }

  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    let { textlist } = this.state;
    let newlist = [...textlist];

    let res = await sendAxios("/order/data");
    //  console.log(res);
    let res1 = await sendAxios("/order/list?type=0&page=1&limit=20");
    //  console.log(res1);
    newlist[0].num = res.data.data.unPaidCount;
    newlist[1].num = res.data.data.unShippedCount;
    newlist[2].num = res.data.data.receivedCount;
    newlist[3].num = res.data.data.evaluatedCount;
    newlist[4].num = res.data.data.completeCount;
    this.setState({
      balance: res.data.data,
      orderdetail: res1.data.data.list,
      textlist: newlist,
    });
  }
  render() {
    let { textlist, balance, orderdetail, activeIndex } = this.state;
    // console.log(orderdetail);
    return (
      <div className="orderhead">
        {balance === null ? (
          <Load></Load>
        ) : (
          <div className="ordermess">
            <div className="head_mes">
              <div className="head_text">
                <p className="head_p_p1">订单信息</p>
                <p style={{ margin: "0" }}>
                  消费订单：{balance.orderCount} 总消费：￥{balance.sumPrice}
                </p>
              </div>
              <div className="head__pic">
                <img src={Keli} alt="" />
              </div>
            </div>
          </div>
        )}
        <div className="orderitem">
          {textlist.map((item, index) => {
            return (
              <div
                key={index}
                className={[
                  "oit",
                  activeIndex === index ? "odactive" : "",
                ].join(" ")}
                onClick={() => this.changedata(index)}
              >
                <div>{item.text}</div>
                <div style={{ marginTop: "9px" }}>{item.num}</div>
              </div>
            );
          })}
        </div>

        <div className="order-goods">
          {orderdetail.length === 0 ? (
            <div className="odnodat">
              <div className="odnodat1">
                <img
                  src="https://java.crmeb.net/static/images/noOrder.png"
                  alt=""
                />
              </div>
            </div>
          ) : (
            orderdetail.map((item, index) => {
              return (
                <div className="odgod-list" key={index}>
                  <div>
                    <div className="odgod-top">
                      <div>
                        <span className="odgoi1">{item.activityType}</span>
                        <span>{item.createTime}</span>
                      </div>
                      <div className="odgoi2">{item.orderStatus}</div>
                    </div>
                    <div className="odgod-mid">
                      <div className="odgod_ig">
                        <img src={item.orderInfoList[0].image} alt="" />
                      </div>
                      <div className="odgod-ms">
                        <div className="odgod-ms1">
                          {item.orderInfoList[0].storeName}
                        </div>
                        <div className="odgod-ms2">
                          <p>￥{item.orderInfoList[0].price}</p>
                          <p>x{item.orderInfoList[0].cartNum}</p>
                        </div>
                      </div>
                    </div>
                    <div className="odgod-tol">
                      共{item.orderInfoList[0].cartNum}件商品，总金额
                      <span>￥{item.orderInfoList[0].price}</span>
                    </div>
                  </div>
                  <div className="odgod-bot">
                    <div
                      className="bbtnn cence"
                      onClick={() => this.cancelorder(item.id)}
                    >
                      取消订单
                    </div>
                    <div className="bbtnn rgno">立即结算</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* <h1>订单页面</h1> */}
        {orderdetail.length === 0 ? null : (
          <div className="dixian">我也是有底线的</div>
        )}
      </div>
    );
  }

  // 改变订单数据
  changedata = async (index) => {
    let res = await sendAxios(`/order/list?type=${index}&page=1&limit=20`);
    // console.log(res.data.data);
    this.setState({
      orderdetail: res.data.data.list,
      activeIndex: index,
    });
  };

  // 取消订单
  cancelorder = async (id) => {
    let { orderdetail } = this.state;
    let newList = [...orderdetail];
    let index = orderdetail.findIndex((item) => {
      return item.id === id;
    });
    newList.splice(index, 1);
    Dialog.confirm({
      title: "取消订单",
      message: "确定取消订单吗？",
    })
      .then(async () => {
        let res1 = await sendAxios(
          "/order/cancel",
          "post",
          { id },
          "application/x-www-form-urlencoded"
        );
        if (res1.data.code !== 200) {
          Toast(res1.data.message);
          return;
        }
        Toast(res1.data.message);
        this.setState({
          orderdetail: newList,
        });
      })
      .catch(() => {
        Toast.fail("取消失败");
      });
  };
}

export default Order;
