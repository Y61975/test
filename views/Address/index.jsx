import { Component } from "react";
import { NavBar, Radio, Button, Toast, Empty, Dialog } from "react-vant";
import "./address.css";
import WithRoute from "../../router/WithRouter";
import sendAxios from "../../router/sendAxios";
import { Edit, Delete } from "@react-vant/icons";

class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      defaultitem: null,
      type:null
    };
  }

  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    // 获取路径传递得type
    if(this.props.router.location.state){
      this.setState({
        type: 0,
      });
    } else {
      this.setState({
        type: null,
      });
    }
    let res = await sendAxios("/address/list?page=1&limit=20");
    // console.log(res);
    res.data.data.list.forEach((item) => {
      if (item.isDefault) {
        this.setState({
          defaultitem: item,
        });
      }
    });
    this.setState({
      list: res.data.data.list,
    });
  }
  render() {
    let { list, defaultitem } = this.state;
    return (
      <div id="address">
        <NavBar
          title="收货地址"
          onClickLeft={() => this.props.router.navigate(-1)}
        />
        <div>
          <Radio.Group
            value={defaultitem}
            onChange={async (val) => this.setdefaul(val)}
          >
            {list.map((item, index) => {
              return (
                <div className="list" key={index}>
                  <div className="username">
                    收货人：{item.realName} {item.phone}
                  </div>
                  <div className="addressinfo">
                    收货地址：{item.province}
                    {item.city}
                    {item.district}
                    {item.detail}
                  </div>
                  <div className="actions">
                    <div>
                      <Radio name={item}>设为默认</Radio>
                    </div>
                    <div className="edit">
                      <span onClick={()=>{
                        // 编辑地址
                        this.props.router.navigate(`/add?addressId=${item.id}`)
                      }}>
                        <Edit color="#444"></Edit> 编辑
                      </span>
                      <span onClick={() => this.remove(item.id)}>
                        <Delete color="#444"></Delete>删除
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </Radio.Group>
        </div>
        {/* 地址为空时显示 */}
        {list.length === 0 && <Empty description="暂无收货地址" />}
        <div className="btn">
          <Button
            block
            type="danger"
            round
            onClick={() => {
              this.props.router.navigate("/add");
            }}
          >
            添加收货地址
          </Button>
        </div>
      </div>
    );
  }
  // 删除地址功能
  remove =  (id) => {
    Dialog.confirm({
      title: "删除收货地址",
      message: "你确定删除该收货地址吗",
    })
      .then(async () => {
        let { list } = this.state;
        let res = await sendAxios("/address/del", "post", { id: id });
        if (res.data.code === 200) {
          Toast.success("删除成功");
          let index = list.findIndex((item) => {
            return item.id === id;
          });
          list.splice(index, 1);
          this.setState({
            list,
          });
        } else {
          Toast.fail("删除失败");
        }
        // console.log(res);
      })
      .catch(() => {
        return;
      });
  };

  // 设置默认地址功能
  setdefaul = async (val) => {
    console.log();
    let {type}=this.state
    this.setState({
      defaultitem: val,
    });
    let res = await sendAxios("/address/default/set", "post", { id: val.id });
    if(type===0){
      localStorage.setItem("address",JSON.stringify(val))
      this.props.router.navigate(-1);
    }
  };
}

export default WithRoute(Address);
