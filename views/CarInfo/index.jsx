import { Component } from "react";
import { HomeO, Ellipsis } from "@react-vant/icons";
import sendAxios from "../../router/sendAxios";
import WithRoute from "../../router/WithRouter";
import { NavBar, SubmitBar, Toast, Input, Radio, Cell } from "react-vant";
import { WechatPay, Alipay, Arrow } from "@react-vant/icons";
import "./carinfo.css";
import MyLoading from "../../component/Loading";
class CarInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderlist: [], // 订单列表
      cellValue: "0", // 支付选择
      allPrice: 0, // 金额总和
      province: "", // 省
      city: "", // 市
      district: "", // 区
      detail: "", // 详细地址
      name: "", //  姓名
      phone: "", // 电话号码
      addressId: null, // 用来判断用户是否有收货地址
      mark: "", // 留言信息
      id: 0, //
      preOrderNo:"", // 订单号
      payhtml:"", // 支付宝返回的 form 表单
      payList: [
        {
          name: "微信支付",
          type: "weixin",
          icon: <WechatPay fontSize={40} color="skyblue" />,
        },
        {
          name: "支付宝支付",
          type: "alipay",
          icon: <Alipay fontSize={40} color="skyblue" />,
        },
      ],
    };
  }

  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    // 判断是购物车跳转的还是立即购买跳转的
    let orderno = "";
    if (this.props.router.location.state.isNow) {
      let res = await sendAxios("/order/pre/order", "post", {
        orderDetails: this.props.router.location.state.order,
        preOrderType: "buyNow",
      });
      orderno = res.data.data.preOrderNo;
    } else {
      let res = await sendAxios("/order/pre/order", "post", {
        orderDetails: this.props.router.location.state.order,
        preOrderType: "shoppingCart",
      });
      if (res.data.code !== 200) {
        Toast(res.data.message);
        return;
      }
      orderno = res.data.data.preOrderNo;
      // console.log(orderno);
    }
    //  根据订单号来请求数据
    let res1 = await sendAxios(`/order/load/pre/${orderno}`);
    // console.log(res1.data.data.orderInfoVo);
    let {
      orderDetailList,
      addressId,
      province,
      city,
      district,
      phone,
      realName,
      proTotalFee,
      detail,
    } = res1.data.data.orderInfoVo;
    if (res1.data.code !== 200) {
      Toast(res1.data.message);
      this.props.router.navigate(-1);
      return;
    }
    // // 计算总额
    // let all = 0;
    // res1.data.data.orderInfoVo.orderDetailList.map((item) => {
    //   let num = Number(item.price) * item.payNum;
    //   all += num;
    // });

    //  更新数据
    this.setState({
      orderlist: orderDetailList,
      allPrice: proTotalFee,
      province,
      city,
      district,
      name: realName,
      phone,
      addressId,
      detail,
      preOrderNo:orderno
    });
    // //  获取本地地址
    let address = JSON.parse(localStorage.getItem("address"));
    // console.log(address);
    if (!address) {
      return;
    }

    //  更新数据
    this.setState({
      province: address.province,
      city: address.city,
      district: address.district,
      phone: address.phone,
      detail: address.detail,
    });
  }

  componentWillUnmount() {
    // 删除本地收货地址
    localStorage.removeItem("address");
  }
  render() {
    let {
      orderlist,
      cellValue,
      allPrice,
      province,
      city,
      district,
      phone,
      name,
      addressId,
      detail,
      payList,
      payhtml
    } = this.state;
    return (
      <div style={{ backgroundColor: "#F1F1F1" }}>
        <div>
          <NavBar
            title="确认订单"
            leftText={<HomeO fontSize={20} />}
            onClickLeft={() => this.goback()}
            rightText={<Ellipsis fontSize={20} />}
            onClickRight={() => Toast("什么都没有哦")}
            className="carinfonav"
          />
        </div>
        {addressId && (
          <div className="carinfoaddres" onClick={() => this.goad()}>
            <div className="addrescont">
              <div className="adreslf">
                <p className="adres1">收货地址</p>
                <div className="adduser">
                  {name} {phone}
                </div>
                <p className="adres2">
                  [默认]
                  <span className="adddetail">
                    {province}
                    {city}
                    {district}
                    {detail}
                  </span>
                </p>
              </div>
              <div className="adresrg">
                <Arrow />
              </div>
            </div>
          </div>
        )}
        {!addressId && (
          <div className="carinfoaddres" onClick={() => this.goad()}>
            <div className="addrescont">
              <div className="adreslf">
                <p className="adres1">选择收货地址</p>
              </div>
              <div className="adresrg">
                <Arrow />
              </div>
            </div>
          </div>
        )}
        <div className="carinfolist">
          {orderlist.map((item, index) => {
            return (
              <div key={index}>
                <div className="carinfo_tit">共{orderlist.length}件商品</div>
                <div className="carinfo_msg">
                  <div className="carinfo_img">
                    <img src={item.image} alt="" />
                  </div>
                  <div className="carinfo_inf">
                    <p className="carinfo-nam">{item.productName}</p>
                    <p className="carinfo-ms">{item.sku}</p>
                    <p className="carinfo-pri">
                      <span>￥{item.price}</span>
                      <span>x{item.payNum}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="carinfolist order_messg">
          <div className="carprompt">
            <span>快递费用</span>
            <span>免运费</span>
          </div>
          <div className="carprompt">备注信息</div>
          <Input.TextArea
            placeholder="请添加备注150字以内"
            maxLength={150}
            showWordLimit
            className="carlimit"
            onChange={(val)=>{this.setState({
              mark:val
            })}}
          />
        </div>
        <div className="carinfolist order_messg">
          <div className="carprompt">支付方式</div>
          <div>
            <Radio.Group value={cellValue} defaultValue="1">
              <Cell.Group>
                {payList.map((item, index) => {
                  return (
                    <Cell
                    key={index}
                      clickable
                      title={item.name}
                      icon={item.icon}
                      onClick={() => {
                        this.setState({
                          cellValue: `${index}`,
                        });
                      }}
                      rightIcon={<Radio name={`${index}`} />}
                    />
                  );
                })}
              </Cell.Group>
            </Radio.Group>
          </div>
        </div>
        <div className="carinfolist allprice">
          <span>商品总价</span>
          <span>￥{allPrice}</span>
        </div>
        <div style={{ height: "50px" }}></div>
        <SubmitBar
          price={allPrice * 100}
          buttonText="提交订单"
          onSubmit={() => this.goPayNow()}
        />
        {/* <h1>订单一级路由</h1> */}
        {orderlist.length === 0 && <MyLoading></MyLoading>}
        <div dangerouslySetInnerHTML={{__html:payhtml}}></div>
      </div>
    );
  }
  goback = () => {
    this.props.router.navigate(-1);
  };
  goad = () => {
    // 选择收货地址去
    this.props.router.navigate("/address", {
      // type 0表示从确认订单跳转到收货地址页面
      state: {
        type: 0,
      },
    });
  };
  //  立即结算
  async goPayNow() {
    let { cellValue, payList,mark,name,phone,addressId,preOrderNo } = this.state;
    let data={
      addressId, // 收货地址id
      couponId: 0, // 优惠卷id
      mark,  // 备注
      payChannel: "weixinh5",  // 支付途径
      payType:payList[cellValue].type, // 支付类型
      phone,  // 手机号码
      preOrderNo,  // 订单号
      realName:name,  // 收货人
      shippingType: 1,   // 固定值
      storeId: 0,  // ---
      useIntegral: false, // ---
    }

     // 发送请求
     let res=await sendAxios("/order/create","post",data)
     console.log(res);
     if(res.data.code!==200){
      Toast(res.data.message)
      return;
     }
     let orderNo=res.data.data.orderNo

     // 获取支付参数
     let paydata={
      orderNo: orderNo,
      payChannel: "weixinh5",
      payType: payList[cellValue].type,
      scene: 0,
     };
     //  请求服务器拉起支付进行支付
     let res1=await sendAxios("/pay/payment","post",paydata)
     console.log(res1);
     if(res1.data.code!==200){
      Toast(res1.data.message);
      return;
     }
     
     // 如果支付方式为微信支付，服务端会返回微信h5支付链接，前端只需要通过 window.location.href 进行跳转，跳转到该链接即可拉起微信app 进行支付
     if(payList[cellValue].type === "weixin"){
      // window.location.href="微信h5支付链接地址"
     }
     // 若支付方式为支付宝 则服务端会返回一个form表单 前端只需要将该 from 表单提交即可拉起 支付宝app进行支付
     if(payList[cellValue].type==="alipay"){
      let from = res1.data.data.alipayRequest;
      console.log(from);
      this.setState({
        payhtml:from
      },()=>{
        document.forms[0].submit();
      })
     }
  }
}

export default WithRoute(CarInfo);
