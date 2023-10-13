import { Component } from "react";
import "./starhot.css";
import WithRoute from "../../../router/WithRouter";

class Starhot extends Component {
  render() {
    let { hotrecomd } = this.props;
    return (
      <div>
        <div className="starhot">
          <div className="starhot1">------⭐</div>
          <div className="starhot2">热门推荐</div>
          <div className="starhot3">⭐------</div>
        </div>
        <div className="starrecgoods">
          {hotrecomd &&
            hotrecomd.map((item, index) => {
              return (
                <div
                  key={index}
                  className="stargoods"
                  onClick={() => this.stargoinfo(item.id)}
                >
                  <div className="stargood_pic">
                    <img src={item.image} alt="" />
                  </div>
                  <p className="stargood_name">{item.storeName}</p>
                  <p className="stargood_price">￥{item.price}</p>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
  stargoinfo = (id) => {
    this.props.router.navigate("/info", { state: { id: id } });
  };
}

export default WithRoute(Starhot);
