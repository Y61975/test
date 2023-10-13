import { useNavigate } from "react-router-dom";
import "./or.css";

function Orlist(props) {
  const navigate = useNavigate();
  // console.log(props);
  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className="starhot">
        <div className="starhot1">------⭐</div>
        <div className="starhot2">热门推荐</div>
        <div className="starhot3">⭐------</div>
      </div>
      <div className="starrecgoods">
        {props.orlist &&
          props.orlist.map((item, index) => {
            return (
              <div
                key={index}
                className="stargoods"
                onClick={() => stargoinfo(item.id)}
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
  function stargoinfo(id) {
    console.log(id);
    navigate("/info", { state: { id: id } });
  }
}

export default Orlist;
