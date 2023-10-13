import { Component } from "react";
import sendAxios from "../../router/sendAxios";
import "./minemsg.css";
import WithRoute from "../../router/WithRouter";
import { NavBar, Toast, Button } from "react-vant";

class MineMsg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userimg: "", //用户头像
      username: "", //用户名字
      userphone: "", //用户电话
    };
  }

  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    let res = await sendAxios("/user", "get");
    // console.log(res.data.data);
    let { nickname, phone, avatar } = res.data.data;
    this.setState({
      userimg: avatar,
      username: nickname,
      userphone: phone,
    });
  }
  render() {
    let { userimg, username, userphone } = this.state;
    return (
      <div style={{ backgroundColor: "#f1f1f1",height:"100vh" }}>
        <div>
          <NavBar
            title="用户信息"
            leftText="返回"
            onClickLeft={() => {
              this.props.router.navigate(-1);
            }}
          />
        </div>
        <div className="minemsg_info">
          <div className="minemsg_item">
            <div>头像</div>
            <div>
              <input
                type="file"
                onChange={async (e) => {
                  //   console.log(e.target.files[0]);
                  // 数据流上传
                  let data = new FormData();
                  // 将文件对象信息添加到formData实例中
                  data.append("multipart", e.target.files[0]);
                  let res = await sendAxios(
                    "/upload/image?model=maintain&pid=0",
                    "post",
                    data,
                    "multipart/form-data"
                  );
                  //   console.log(res.data);
                  if (res.data.code === 500) {
                    Toast.fail("上传格式不支持");
                  } else if (res.data.code === 200) {
                    this.setState({
                      userimg: res.data.data.url,
                    });
                  } else {
                    Toast.fail("你干嘛~诶呦");
                  }
                }}
              />
              <img src={userimg} alt="" />
            </div>
          </div>
          <div className="myinfocell">
            <div>昵称</div>
            <div className="mineitem_userinfo">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  this.setState({
                    username: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="myinfocell">
            <div>手机号码</div>
            <div className="mineitem_userinfo">
              <input
                type="text"
                value={userphone}
                onChange={(e) => {
                  this.setState({
                    userphone: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="myinfocell">
            <div>ID号</div>
            <div className="mineitem_userinfo mineuserid">666666</div>
          </div>
        </div>
        <div style={{ padding: "10px", width: "90%",margin:"0 auto" }}>
          <Button type="primary" block round onClick={()=>this.gosave()}>
            保存修改
          </Button>
        </div>
        <div className="myinfocell  minemsgexit">
          退出登录
        </div>
        {/* <h1>MineMsg一级路由</h1> */}
      </div>
    );
  }
  gosave=async ()=>{
    let {userimg,username,userphone}=this.state
      let res =await sendAxios("/user/edit","post",{"avatar": userimg, 
      "nickname": username, 
      "phone": userphone });
    //   console.log(res.data.code);
       if(res.data.code===200){
         Toast.success("保存成功")
       }else{
        Toast.fail("保存失败")
       }
  }
}

export default WithRoute(MineMsg);
