import { Component } from "react";
import "./homhres.css";
import WithRoute from "../../../router/WithRouter";

class Homhres extends Component {
  render() {
    // console.log(this.props);
    let { searesult } = this.props;
    return (
      <div style={{ boxSizing: "border-box" }}>
        {searesult &&
          searesult.map((item, index) => {
            return (
              <div
                key={index}
                className="searcgood"
                onClick={() => this.seargoinfo(item.id)}
              >
                <div className="searcgood_pic">
                  <img src={item.image} alt="" />
                </div>
                <div className="searcgood_messa">
                  <div className="searcgd_name">{item.storeName}</div>
                  <div className="searcgd_price">￥{item.price}</div>
                  <div className="searcgd_stock">已售{item.sales}件</div>
                  <div className="seargo">＞</div>
                </div>
              </div>
            );
          })}
        <div style={{ textAlign: "center" }}>😕人家是有底线的~~</div>
      </div>
    );
  }
  seargoinfo = (id) => {
    // console.log(id);
    this.props.router.navigate("/info", { state: { id: id } });
  };
}

export default WithRoute(Homhres);
