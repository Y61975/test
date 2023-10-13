import React, { Component } from "react";
import "./car.css";
import WithRoute from "../../router/WithRouter";
import {
  Toast,
  NavBar,
  ProductCard,
  Checkbox,
  Stepper,
  Button,
} from "react-vant";
import { HomeO, Ellipsis } from "@react-vant/icons";
import sendAxios from "../../router/sendAxios";
class Car extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      check: [],
      num: 1,
      goodsList: [],
      sumMoney: 0,
      compare: 1,
      orderlist: [], // 定义传给订单页面的数组
    };
  }

  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    let res = await sendAxios("/cart/list?page=1&limit=20&isValid=true", "get");
    // console.log(res.data.data.list);

    this.setState({
      goodsList: res.data.data.list,
    });
  }
  render() {
    let { check, goodsList, sumMoney} = this.state;
    return (
      <div>
        <NavBar
          title="购物车"
          leftText={<HomeO fontSize={20} />}
          onClickLeft={() => this.gohome()}
          rightText={<Ellipsis fontSize={20} />}
          onClickRight={() => Toast("什么都没有哦")}
          className="carnav"
        />
        <Checkbox.Group
          ref={this.ref}
          value={check}
          onChange={(val) => {
            this.setState({
              check: val,
            });
          }}
        >
          {goodsList &&
            goodsList.map((item, index) => {
              return (
                <div key={index}>
                  <Checkbox name={item}>
                    <ProductCard
                      num={item.cartNum}
                      price={item.price}
                      desc={item.suk}
                      title={item.storeName}
                      thumb={item.image}
                    />
                  </Checkbox>
                  <div className="carstep">
                    <Stepper
                      min={1}
                      value={item.cartNum}
                      onChange={(num) => this.changequanty(index, item.id, num)}
                      theme="round"
                      buttonSize="18"
                    />
                    <Button
                      plain
                      type="primary"
                      size="small"
                      onClick={() => this.delgoods(item.id)}
                    >
                      删除商品
                    </Button>
                  </div>
                </div>
              );
            })}
        </Checkbox.Group>
        <div className="submitbtn">
          <Checkbox
            checked={check.length === goodsList.length}
            onClick={() => this.changechild()}
          >
            全选
          </Checkbox>
          <div className="total">
            <span className="total_one">合计：</span>
            <span className="total_two">￥ {this.getGoodsPrice()}</span>
          </div>
          <Button
            color="linear-gradient(to right, #ff6034, #ee0a24)"
            round={true}
            onClick={() => this.gocarinfo()}
            disabled={check.length===0?true:false}
          >
            提交订单
          </Button>
        </div>
        {/* <h1>Car子组件</h1> */}
      </div>
    );
  }

  // 计算商品总价
  getGoodsPrice() {
    //  获取选中的购物车数据
    let { check } = this.state;
    let sum = 0;
    check.forEach((item) => {
      // 计算单个商品的总价
      let goodsPrice = item.price * item.cartNum;
      sum += goodsPrice;
    });
    return sum;
  }

  // 返回上一级
  gohome() {
    this.props.router.navigate(-1);
    // console.log(this.props.router);
  }

  // 增加或减少商品的函数
  async changequanty(index, id, num) {
    // console.log(id,v);
    let { goodsList } = this.state;
    let newList = [...goodsList];
    // let control = newList[index].attrStatus;
    newList[index].cartNum = num;
    let res = await sendAxios(
      "/cart/num",
      "post",
      { id: `${id}`, number: `${num}` },
      "application/x-www-form-urlencoded"
    );

    // let price = 0;
    // {
    //   this.state.goodsList.map((item) => {
    //     let num = Number(item.price) * item.cartNum;
    //     if (!item.attrStatus) {
    //       price += num;
    //     }
    //   });
    // }
    this.setState({
      goodsList,
    });
  }

  //  金额总结
  // sum(item) {
  //   let { goodsList, sumMoney,check } = this.state;
  //   console.log(item);
  //   check.push(item)
  //   console.log(check);
  //   // let addmon;
  //   // let remon;
  //   // let newList = [...this.state.goodsList];
  //   // let control = newList[index].attrStatus;
  //   // newList[index].attrStatus = !control;
  //   // // console.log(control);
  //   // this.setState({
  //   //   goodsList: newList,
  //   // });
  //   // if (control === true) {
  //   //   addmon = goodsList[index].cartNum * goodsList[index].price;
  //   //   //   console.log(addmon);
  //   //   this.setState({
  //   //     sumMoney: sumMoney + addmon,
  //   //   });
  //   // } else {
  //   //   remon = goodsList[index].cartNum * goodsList[index].price;
  //   //   this.setState({
  //   //     sumMoney: sumMoney - remon,
  //   //   });
  //   // }
  //   let price=0;
  //   check.forEach(item=>{
  //     let num=Number(item.price) * item.cartNum;
  //     price+=num
  //   })
  //   this.setState({
  //     sumMoney:price
  //   })
  // }

  //  控制全选
  changechild() {

    let {  goodsList, check } = this.state;
    if (check.length === goodsList.length) {
      this.setState({
        check: [],
      });
    } else {
      this.setState({
        check: goodsList,
      });
    }
    // check.map((item) => {
    //   let num = Number(item.price) * item.cartNum;
    //   allprice += num;
    // });
  }

  //  跳转到订单详情页
  gocarinfo() {
    let {check } = this.state;
    // 遍历将id推进新的数组
    let order = [];
    check.map((item) => order.push({ shoppingCartId: item.id }));
    this.props.router.navigate("/carInfo", {
      state: { order, isNow: false },
    });
  }

  //  删除商品的函数
  delgoods = async (id) => {
    let { goodsList } = this.state;
    let res = await sendAxios(
      "/cart/delete",
      "post",
      { ids: id },
      "application/x-www-form-urlencoded"
    );
    // console.log(res);
    let index = goodsList.findIndex((item) => {
      return item.id === id;
    });
    goodsList.splice(index, 1);

    this.setState({
      goodsList,
    });
  };

}
export default WithRoute(Car);
