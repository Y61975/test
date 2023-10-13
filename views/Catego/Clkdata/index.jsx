import { useNavigate } from "react-router-dom";
import "./clk.css";

function Clkdata(props) {
  // console.log(props);
  const navigate = useNavigate();
  return (
    <div style={{ boxSizing: "border-box" }}>
      {props.goodlist &&
        props.goodlist.map((item, index) => {
          return (
            <div
              key={index}
              className="searcgood"
              onClick={() =>seargoinfo(item.id)}
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
  function seargoinfo(id){
    navigate("/info", { state: { id: id } });
  }
}

export default Clkdata;
