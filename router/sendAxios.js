import axios from "axios";
import { Toast } from "react-vant";

// 设置默认公用的请求路径
axios.defaults.baseURL = "https://apif.java.crmeb.net/api/front";

// 设置延迟时间
axios.defaults.timeout = 5000;

//  请求拦截--两个参数分别为拦截成功的参数和拦截失败的参数
axios.interceptors.request.use(
  (config) => {
    // console.log(config);
    // 向请求头中添加 授权字段（token）
    // localStorage.getItem("token") 从本地存储中取出token
    config.headers["Authori-Zation"] = localStorage.getItem("token");

    //  设置请求时的加载提示
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0,
    });

    // 设置好请求头后将请求 return（返回）出去
    return config;
  },
  (err) => {
    console.log("拦截失败" + err);
  }
);

//  响应拦截---拦截服务器端返回的数据，然后进行处理，处理过后再返回给客户端
// 和请求拦截一样有两个参数
axios.interceptors.response.use((data) => {
  // console.log(data);

  // 消除加载提示
  Toast.clear();
  //  处理token失效的问题
  if (data.data.code === 401) {
      Toast(data.data.message);
    localStorage.removeItem("token");
    window.location.href = "/#/login";
    return;
  } else {
    return data;
  }
});

//  参数一：请求地址   参数二：请求方式  参数三：请求参数
// method="get" 设置默认请求参数为 get
//  headers="application/json"  设置默认的请求头
function sendAxios(
  url,
  method = "get",
  data = null,
  headers = "application/json"
) {
  //  因为 axios是基于promise进行封装的，所以直接return一个axios
  return axios({
    url,
    method,
    data: method !== "get" ? data : null,
    params: method === "get" ? data : null,

    // 设置请求头
    headers: {
      "Content-Type": headers,
    },
  });
}

export default sendAxios;
