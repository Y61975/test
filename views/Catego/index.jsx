import { useState, useEffect } from "react";
import sendAxios from "../../router/sendAxios";
import { Tabs } from "react-vant";
import Load from "../../component/Loading";
import Nores from "./Nocate";
import Orlist from "./Ordata";
import Clkdata from "./Clkdata";

function catego() {
  //  设置图片是否显示
  let [isShow, setShow] = useState(true);
  //  设置顶部列表
  let [toplist, setToplist] = useState([]);
  //  设置请求结果
  let [goodlist, setGoodlist] = useState([]);
  //  设置初始数据
  let [orlist, setOrlist] = useState([]);
  // 设置 请求初始 cid
  let [cid, setCid] = useState(0);
  // 设置 page的值
  let [page, setPage] = useState(1);
  useEffect(() => {
    async function gettoplist() {
      try {
        let res = await sendAxios("/category");
        // console.log(res);
        let res1 = await sendAxios(
          `/products?page=${page}&limit=10&cid=${cid}`
        );
        // console.log(res1);
        setToplist(res.data.data);
        setOrlist(res1.data.data.list);
      } catch (err) {
        console.log(err);
      }
    }
    gettoplist();
  }, []);
//   console.log(orlist);
  return (
    <div>
      {toplist.length === 0 ? (
        <Load></Load>
      ) : (
        <Tabs onClickTab={(val) => changedata(val)}>
          {toplist.map((item, index) => (
            <Tabs.TabPane key={index} title={item.name}>
              {goodlist.length == 0 && !isShow && <Nores />}
              {goodlist.length === 0 ? (
                <Orlist orlist={orlist} />
              ) : (
                <Clkdata goodlist={goodlist} />
              )}
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}

      {/* <h1>分类</h1> */}
    </div>
  );
  async function changedata(val) {
    //    console.log(val);
    //    console.log(toplist[val.index].id);
    let cid = toplist[val.index].id;
    try {
      let res = await sendAxios(`/products?page=1&limit=10&cid=${cid}`);
    //   console.log(res);
      setGoodlist(res.data.data.list);
      setShow(false);
    } catch (err) {
      console.log(err);
    }
  }
}

export default catego;
