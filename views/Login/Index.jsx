import { Component } from "react";
import "./login.css";
import { Cross } from "@react-vant/icons";
import { Input, Cell, Button, Toast } from "react-vant";
import sendAxios from "../../router/sendAxios";
import WithRoute from "../../router/WithRouter";
import plusReady from "../../utils/plusReady";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      proving: "",
      useBtn: false,
      sendText: "发送验证码",
      loginserve: {}, // 登录服务商对象
    };
  }
  componentDidMount() {
    // 保证this指向正常
    let that = this;
    // 获取登录服务商对象
    plusReady(() => {
      plus.navigator.setStatusBarBackground("#FFFFFF");
      plus.navigator.setStatusBarStyle("dark");
      plus.oauth.getServices((list) => {
        /* console.log(JSON.stringify(list)); */
        list.forEach((item) => {
          that.state.loginserve[item.id] = item;
        });
        that.setState({
          loginserve: that.state.loginserve,
        });
      });
    });
  }

  render() {
    let { phone, sendText, useBtn } = this.state;
    return (
      <div>
        <div className="login_page">
          <div>
            <Cross style={{ width: "20px", height: "20px", color: "#999" }} />
          </div>
          <div className="login">
            <h1>短信登录</h1>
            <Cell>
              <Input
                value={phone}
                placeholder="请输入手机号"
                onChange={(e) => {
                  this.setState({
                    phone: e,
                  });
                }}
              />
            </Cell>
            <Cell>
              <Input
                suffix={
                  <Button
                    color="skyblue"
                    plain
                    onClick={() => this.getTest()}
                    disabled={useBtn}
                  >
                    {sendText}
                  </Button>
                }
                placeholder="请输入短信验证码"
                onChange={(e) => {
                  this.setState({
                    proving: e,
                  });
                }}
              />
            </Cell>
            <Button
              type="primary"
              block
              round
              style={{ marginTop: "20px" }}
              color="linear-gradient(to right, rgb(255, 153, 153), rgb(255, 161, 121))"
              onClick={() => this.login()}
            >
              手机号登录
            </Button>

            <Button
              type="primary"
              block
              round
              style={{ marginTop: "20px" }}
              color="linear-gradient(to right, rgb(255, 153, 153), rgb(255, 161, 121))"
              onClick={() => {
                let that = this;
                plusReady(() => {
                  that.state.loginserve["weixin"].login((res) => {
                    console.log(JSON.stringify(res));
                  });
                });
              }}
            >
              微信登录
            </Button>
            <Button
              type="primary"
              block
              round
              style={{ marginTop: "20px" }}
              color="linear-gradient(to right, rgb(255, 153, 153), rgb(255, 161, 121))"
              onClick={() => {
                let that = this;
                plusReady(() => {
                  that.state.loginserve["qq"].login((res) => {
                    console.log(JSON.stringify(res));
                  });
                });
              }}
            >
              QQ登录
            </Button>
          </div>
        </div>
      </div>
    );
  }
  async getTest() {
    let reg = /^\d{6}$/;
    let reg1 = /^1[3-9]{1}[0-9]{9}$/;
    let num = 60;
    let { phone, proving } = this.state;
    if (phone === "") {
      Toast.fail("请输入正确的手机号");
      return;
    }
    if (!reg1.test(phone)) {
      Toast.fail("请输入正确的手机号");
      return;
    }
    let res = await sendAxios(
      "/sendCode",
      "post",
      {
        phone,
      },
      "application/x-www-form-urlencoded"
    );
    // console.log(res);
    if (res.data.code !== 200) {
      Toast(res.data.message);
      return;
    }
    let timer = setInterval(() => {
      //   console.log(num--);
      num--;
      this.setState({
        sendText: `${num}后重新发送`,
        useBtn: true,
      });
      if (num === 0) {
        clearInterval(timer);
        this.setState({
          sendText: "发送验证码",
          useBtn: false,
        });
      }
      //  console.log(num);
    }, 1000);
  }

  async login() {
    // console.log(this.props);
    let oldpath = this.props.router.location.search.split("=")[1];
    // console.log(oldpath);
    // localStorage.setItem("token", "	75d74380dbcd4a8999262117dbc933dd");

    let { phone, proving } = this.state;
    let reg = /^1[3-9]{1}[0-9]{9}$/;
    let reg1 = /^\d{6}$/;
    if (phone !== "" && reg.test(phone)) {
      if (proving !== "" && reg1.test(proving)) {
        let res = await sendAxios(
          "/login/mobile",
          "post",
          { phone: phone, captcha: proving },
          "application/json"
        );
        if (res.data.code !== 200) {
          Toast(res.data.message);
          return;
        }
        // console.log(res);
        localStorage.setItem("token", res.data.data.token);
        this.props.router.navigate(oldpath);
      } else {
        Toast.info("请输入正确的验证码");
      }
    } else {
      Toast.info("请输入正确的手机号");
    }
  }
}

export default WithRoute(Login);
