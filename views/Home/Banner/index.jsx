import { Component } from "react";
import sendAxios from "../../../router/sendAxios";
import { Swiper, Image, Grid,Loading } from "react-vant";
import bannerCss from "./banner.module.css";
import loadungpng from "../../../assets/loading.png"
class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerList: [],
      menuList: [],
    };
  }

  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    let res = await sendAxios("/index", "get");
    // console.log(res.data.data.banner);
    this.setState(
      {
        bannerList: res.data.data.banner,
        menuList: res.data.data.menus,
      }
    );
  }
  render() {
    let { bannerList, menuList } = this.state;
    return (
      <>
        <div className={bannerCss.bane}>
          <div className={bannerCss.gradient}>
            {bannerList.length && <Swiper autoplay>
              {bannerList.map((item) => (
                <Swiper.Item key={item.id}>
                  <Image lazyload src={item.pic} style={{ height: "160px",width:"100%" }}  loadingIcon={<Loading type='spinner' />} />
                </Swiper.Item>
              ))}
            </Swiper>}
            {bannerList.length ===0 && <Image width='100%' height='24vw' />}
          </div>
        </div>
        <div className={bannerCss.menu}>
          <div className={bannerCss.list}>
            <Grid border={false} columnNum={5}>
              {menuList.length !==0 && menuList.map((item, index) => {
                return (
                  <Grid.Item key={item.id} text={item.name}>
                    <Image
                      src={item.pic}
                      style={{ width: "40px", height: "40px" }}
                    />
                    <span className={bannerCss.menuName}>{item.name}</span>
                  </Grid.Item>
                );
              })}
              {/* 数组为空时渲染，防止页面上下跳动 */}
              {menuList.length ===0 &&  Array.from({ length: 10 }).map((item,index)=>{
                return  <Grid.Item key={index} >
                <Image
                  src={loadungpng}
                  style={{ width: "40px", height: "40px" }}
                />
              </Grid.Item>
              })}
            </Grid>
          </div>
        </div>
      </>
    );
  }
}

export default Banner;
