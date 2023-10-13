import { Component } from "react";
import WithRoute from "../../../router/WithRouter";
import sendAxios from "../../../router/sendAxios";
import rankCss from "./rank.module.css";
import { Fire, Arrow } from "@react-vant/icons";
import loadungpng from "../../../assets/loading.png";
import Lazyimg from "react-lazyimg-component";
import { Image, Skeleton } from "react-vant";

class Rank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rankList: [],
    };
  }

  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    let res = await sendAxios("/product/leaderboard", "get");
    this.setState({
      rankList: res.data.data,
    });
  }
  render() {
    let { rankList } = this.state;
    return (
      <Skeleton
        row={3}
        loading={rankList.length === 0}
        rowWidth={["100%", "100%", "100%"]}
        rowHeight={[80, 80, 80]}
        round={false}
      >
        <div className={rankCss.rank}>
          <div className={rankCss.title}>
            <Fire color="red" /> 商品排行榜
            <span className={rankCss.more}>
              更多 <Arrow color="#999" />
            </span>
          </div>
          <div className={rankCss.goods}>
            {rankList.map((item, index) => {
              if (index > 2) {
                return;
              } else {
                return (
                  <div
                    className={rankCss.goodsItem}
                    key={item.id}
                    onClick={() => this.goInfo(item)}
                  >
                    <div className={rankCss.item_img}>
                      <Lazyimg
                        className="lazy"
                        src={item.image}
                        placeholder={<Image width="101px" height="101px" />}
                      />
                    </div>
                    <div className={rankCss.item_info}>
                      <div className={rankCss.name}>{item.storeName}</div>
                      <div>
                        <span className={rankCss.price}>￥{item.price}</span>
                        <span className={rankCss.sale}>销量{item.sales}件</span>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            {rankList.length === 0 &&
              Array.from({ length: 3 }).map((item, index) => {
                return (
                  <Image
                    key={index}
                    src={loadungpng}
                    style={{ width: "101px", height: "101px" }}
                  />
                );
              })}
          </div>
        </div>
      </Skeleton>
    );
  }
  goInfo(item) {
    this.props.router.navigate("/info", { state: { id: item.id } });
  }
}

export default WithRoute(Rank);
