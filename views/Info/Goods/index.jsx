import React, { PureComponent, createRef } from "react";
import "./goods.css";
import { Popup, ActionBar, Stepper } from "react-vant";
import { CartO, StarO } from "@react-vant/icons";
class Goods extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 控制弹出层
      selegood: "", // 商品名称
      price: "", // 价格
      stock: 0, // 库存
      amount: 1, //商品数量
      sales: 0, // 价格
      productid: 0, // 商品id
      specsid: 0, // 商品规格 id
      shopcar: false, // 与父组件通信
      color: "", // 商品颜色
      size: "", // 商品尺码
      checkval: {}, // 定义商品规格的选项卡操作
    };
  }
  //  组件渲染后可以进行发送请求
  componentDidMount() {
    // console.log(this.props);
    let mont = "";
    let color = "";
    let size = "";
    let strarr = this.props.attr.map((item) => item.attrValues.split(",")[0]);
    this.props.attr.forEach((item, index) => {
      if (index !== 0) {
        color = strarr[0];
        size = strarr[1];
        mont = strarr.join(",");
      } else {
        mont = item.attrValues.split(",")[0];
      }
    });
    let checkval = {};
    for (let i = 0; i < this.props.attr.length; i++) {
      checkval[i] = 0;
    }
    // let showtext = this.props.attr[0].attrValues.split(",")[0];
    // console.log(showtext);
    let index = this.props.goodsInfo.productValue[mont];
    // console.log(index); // 获取初始值
    // console.log(showtext);
    this.setState({
      selegood: mont,
      price: index.price,
      stock: index.stock,
      sales: index.sales,
      productid: index.productId,
      specsid: index.id,
      color,
      size,
      checkval,
    });
  }
  componentDidUpdate() {
    let { specsid, productid, amount, shopcar } = this.state;
    this.props.getaddmsg({ specsid, productid, amount, shopcar });
    if (this.props.shopcar === true) {
      this.setState({
        shopcar: true,
      });
    } else if (this.props.shopcar === false) {
      // console.log("成功了");
      this.setState({
        shopcar: false,
      });
    }
  }
  render() {
    let { goodsInfo } = this.props;
    let { selegood, price, stock, amount, sales, checkval } = this.state;
    // console.log(this.props.goodsInfo.productValue[selegood]);// 用来获取商品规格id

    return (
      <>
        {goodsInfo && (
          <div>
            <div className="goodsinfo">
              <div className="godprice">￥ {goodsInfo.productInfo.price}</div>
              <div className="godname">{goodsInfo.productInfo.storeName}</div>
              <div className="godsale">
                <span>￥ {price}</span>
                <span>库存：{stock}</span>
                <span>销量：{sales}</span>
              </div>
            </div>
            <div
              className="goodsinfo selegod"
              onClick={() => {
                this.setState({
                  visible: true,
                });
              }}
            >
              已选择：<span>{selegood}</span>
              <Popup
                visible={
                  this.props.shopcar ? this.state.shopcar : this.state.visible
                }
                position="bottom"
                round={true}
                closeable={true}
                style={{ height: "75%" }}
                onClose={() => {
                  this.props.getclose(false);
                  this.setState({
                    visible: false,
                    // shopcar:false,
                  });
                }}
              >
                <div className="seleinfo">
                  <div className="selepic">
                    <img
                      src={JSON.parse(goodsInfo.productInfo.sliderImage)[0]}
                      alt=""
                    />
                  </div>
                  <div className="selemsg">
                    <p className="s1">{goodsInfo.productInfo.storeInfo}</p>
                    <p className="s2">￥ {price}</p>
                    <p className="s3">库存：{stock}</p>
                  </div>
                </div>
                <div className="selesort">
                  {/* 进行判断，有一条数据和多条数据 */}
                  {goodsInfo.productAttr.map((item, idx) => {
                    return (
                      <div key={idx}>
                        <div style={{ color: "#b4b4b4" }}>{item.attrName}:</div>
                        <div className="selelist">
                          {item.attrValues.split(",").map((item1, index) => {
                            let isselected = checkval[idx] === index;
                            return (
                              <div
                                className={[
                                  "listitem",
                                  isselected ? "sele_active" : "",
                                ].join(" ")}
                                key={index}
                                onClick={(e) =>
                                  this.changeActive(index, e, item, idx)
                                }
                              >
                                {item1}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="godnum">
                  <div>数量</div>
                  <div>
                    <Stepper
                      value={amount}
                      step={1}
                      min={1}
                      onChange={(val) => {
                        this.setState({
                          amount: val,
                        });
                      }}
                    />
                  </div>
                </div>
                <div style={{ width: "100%", height: "50px" }}></div>
              </Popup>
            </div>
            <div className="coment">
              <div style={{ color: "#b4b4b4", fontSize: "14px" }}>
                用户评价(1)
              </div>
              <div className="usercontent"></div>
            </div>
          </div>
        )}
      </>
    );
  }
  changeActive(index, e, item, idx) {
    // console.log(idx);
    let { color, size, checkval } = this.state;

    // 用来修改选项卡数据
    let newval = { ...checkval };
    newval[idx] = index;
    // console.log(newval);

    if (item.attrName === "颜色") {
      color = e.target.innerHTML;
    } else if (item.attrName === "尺码") {
      size = e.target.innerHTML;
    } else {
      return;
    }
    let getvalue;
    if (size === "") {
      getvalue = this.props.goodsInfo.productValue[color + size];
    } else {
      getvalue = this.props.goodsInfo.productValue[color + "," + size];
    }
    this.setState({
      selegood: color + "," + size,
      price: getvalue.price,
      stock: getvalue.stock,
      amount: 1,
      specsid: getvalue.id,
      checkval: newval,
    });
  }
}

export default Goods;
