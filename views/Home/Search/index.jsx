import { Component } from "react";
import { Search } from "react-vant";
import WithRoute from "../../../router/WithRouter";
class SearVal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
    };
  }
  render() {
    return (
      <div>
        <Search
          value={this.state.searchValue}
          onFocus={()=>{
            this.props.router.navigate("/hosearch")
          }}
          placeholder="请输入搜索关键词"
          shape="round"
          background="#E93323"
        />
      </div>
    );
  }
}

export default WithRoute( SearVal);
