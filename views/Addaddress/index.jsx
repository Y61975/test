import { Component } from "react";
import "./Addaddress.css";
import { Field, NavBar, Area, Checkbox, Button, Toast } from "react-vant";
import WithRoute from "../../router/WithRouter";
import { areaList } from "@vant/area-data";
import { Arrow } from "@react-vant/icons";
import sendAxios from "../../router/sendAxios";

class Addaddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: [],
      name: "",
      phone: "",
      detail: "",
      isDefault: false,
      province: "",
      city: "",
      district: "",
      id: 0,
    };
  }

  //  组件渲染后可以进行发送请求
  async componentDidMount() {
    // 获取路径传递得参数 收货地址id;
    let [searchParams] = this.props.router.search;
    let id = searchParams.get("addressId");
    // console.log(id);
    if (!id) {
      id = 0;
    }
    this.setState({
      id,
    });
    if (id !== 0) {
      let res = await sendAxios(`/address/detail/${id}`);
      let { realName, phone, detail, isDefault, province, city, district } =
        res.data.data;
      let { city_list, county_list, province_list } = areaList;
      let list = [];
      for (let key in province_list) {
        if (province_list[key] === province) {
          list.push(`${key}`);
        }
      }
      for (let key in city_list) {
        if (city_list[key] === city) {
          list.push(`${key}`);
        }
      }
      for (let key in county_list) {
        if (county_list[key] === district) {
          list.push(`${key}`);
        }
      }
      this.setState({
        name: realName,
        phone,
        detail,
        isDefault,
        cityList: list,
        province,
        city,
        district
      });
    }
  }
  render() {
    let { cityList, name, phone, detail, isDefault, id } = this.state;
    return (
      <div id="addaddress">
        <NavBar
          title={id === 0 ? "添加收货地址" : "修改收货地址"}
          onClickLeft={() => {
            this.props.router.navigate(-1);
          }}
        />
        <div className="field">
          <Field
            label="姓名:"
            placeholder="请输入姓名"
            value={name}
            onChange={(val) => {
              this.setState({
                name: val,
              });
            }}
          />
          <Field
            label="联系电话:"
            placeholder="请输入联系电话"
            value={phone}
            onChange={(val) => {
              this.setState({
                phone: val,
              });
            }}
          />
          <Area
            popup={{
              round: true,
            }}
            title="选择地区"
            value={cityList}
            areaList={areaList}
            onConfirm={(e, option) => {
              // console.log(e, option);
              this.setState({
                cityList: e,
                province: option[0].text,
                city: option[1].text,
                district: option[2].text,
              });
            }}
          >
            {(_, selectRows, actions) => {
              return (
                <Field
                  label="所在地区"
                  placeholder="省，市，区"
                  value={selectRows.map((row) => row?.text).join(",")}
                  onClick={() => actions.open()}
                  rightIcon={<Arrow />}
                />
              );
            }}
          </Area>
          <Field
            label="详细地址"
            placeholder="请输入详细地址"
            value={detail}
            onChange={(val) => {
              this.setState({
                detail: val,
              });
            }}
          />
        </div>
        <div className="defaultAddress field">
          <Checkbox
            checked={isDefault}
            onChange={(val) => {
              this.setState({
                isDefault: val,
              });
            }}
          >
            设置为默认收货地址
          </Checkbox>
        </div>
        <div className="mybtn">
          <Button block type="danger" round onClick={() => this.add()}>
            {id === 0 ? "确认添加" : "确认修改"}
          </Button>
        </div>
      </div>
    );
  }
  add = async () => {
    let { province, city, district, detail, isDefault, phone, name, id} =
      this.state;
    let res = await sendAxios("/address/edit", "post", {
      address: { province, city, district, cityId: 26779 },
      detail,
      id,
      isDefault,
      phone,
      realName: name,
    });
    // console.log(res);
    if (res.data.code === 200) {
      Toast.success("操作成功");
      this.props.router.navigate(-1);
    } else {
      Toast(res.data.message);
    }
  };
}

export default WithRoute(Addaddress);
