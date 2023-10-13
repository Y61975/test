import { PureComponent } from "react";
import "./recommend.css";
import sendAxios from "../../../router/sendAxios";
import { Swiper, ActionBar, ImagePreview } from "react-vant";

class Recom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      goods: [],
      content: "",
      isShow: false,
      // 存储点击查看图片中的图片的数组
      viewPic: [],
    };
  }

  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    let viewPic=[]
    this.props.productInfo.content.replace(
      /<img [^>]*src=['"]([^'"]+)[^>]*>/g,
      function (match, capture) {
        viewPic.push(capture);
      }
    );
    
    let res = await sendAxios("/product/good", "get");
    let list = res.data.data.list;
    //  处理数据 将一维数组转化为二维数组
    //  计算二维数组的个数
    let num = Math.ceil(list.length / 6);
    let likeList = [];
    for (let i = 0; i < num; i++) {
      if (i === num - 1) {
        likeList[i] = list.slice(i * 6);
      } else {
        likeList[i] = list.slice(i * 6, 6);
      }
    }
    this.setState({
      goods: likeList,
      content: this.props.productInfo.content,
      isShow: false,
      viewPic
    });
  }
  render() {
    let { goods } = this.state;
    return (
      <>
        <div className="swip">
          <div className="recom_title">优品推荐</div>
          {goods.length && (
            <Swiper>
              {goods.map((item, index) => {
                return (
                  <Swiper.Item key={index}>
                    <div className="banlist">
                      {item.map((item1, index1) => {
                        return (
                          <div className="bangood" key={index1}>
                            <img src={item1.image} alt="" />
                            <p className="recomname">{item1.storeName}</p>
                            <p className="recomprice">￥ {item1.price}</p>
                          </div>
                        );
                      })}
                    </div>
                  </Swiper.Item>
                );
              })}
            </Swiper>
          )}
        </div>
        <div>
          <div className="detail_title">商品详情</div>
          <div
            dangerouslySetInnerHTML={{ __html: this.state.content }}
            className="detaillist"
            onClick={(e) => this.lookImg(e)}
          ></div>
        </div>
      </>
    );
  }
  lookImg = (e) => {
    let {viewPic}=this.state;
    let index=viewPic.findIndex((item)=>{return item===e.target.currentSrc})
    ImagePreview.open({images:viewPic,startPosition:index})
  };
}

export default Recom;
