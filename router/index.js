import { Navigate,Routes,Route } from "react-router-dom";
import { lazy,Suspense } from "react";
import Loading from "../component/Loading.jsx";
let Car=lazy(()=>import("../views/Car"));
let CarInfo=lazy(()=>import("../views/CarInfo"));
let Home=lazy(()=>import("../views/Home"));
let Index=lazy(()=>import("../views/Index"));
let Info=lazy(()=>import("../views/Info"));
let Login=lazy(()=>import("../views/Login/Index"));
let Mine=lazy(()=>import("../views/Mine"));
let MineMsg=lazy(()=>import("../views/MineMsg"));
let Author=lazy(()=>import("./Author"))
let NoFound=lazy(()=>import("../views/NoFound"))
let Address = lazy(()=>import("../views/Address"))
let Addaddress = lazy(()=>import("../views/Addaddress"))
let Hosearch = lazy(()=>import("../views/Hosearch"))
let Order = lazy(()=>import("../views/Order"))
let Catego = lazy(()=>import("../views/Catego"))

let elements=[
    {
        path:"/index",
        element:<Suspense fallback={<Loading/>}><Index></Index></Suspense>,
        author:false,
        children:[
            {
                path:"home",
                element:<Suspense fallback={<Loading></Loading>}><Home></Home></Suspense>,
                author:false
            },{
                path:"car",
                element:<Suspense fallback={<Loading></Loading>}><Car></Car></Suspense>,
                author:true
            },{
                path:"mine",
                element:<Suspense fallback={<Loading></Loading>}><Mine></Mine></Suspense>,
                author:true
            },{
                path:"",
                element:<Navigate to="home"></Navigate>
            },{
                path:"catego",
                element:<Suspense fallback={<Loading></Loading>}><Catego></Catego></Suspense>,
                author:false
     }
        ]
    },{
        path:"/info",
        element:<Suspense fallback={<Loading></Loading>}><Info></Info></Suspense>,
        author:false
    },{
        path:"/login",
        element:<Suspense fallback={<Loading></Loading>}><Login></Login></Suspense>,
        author:false
    },{
        path:"/mineMsg",
        element:<Suspense fallback={<Loading></Loading>}><MineMsg></MineMsg></Suspense>,
        author:true
    },{
        path:"/carInfo",
        element:<Suspense fallback={<Loading></Loading>}><CarInfo></CarInfo></Suspense>,
        author:true
    },{
        path:"/",
        element:<Suspense><Navigate to="/index"></Navigate></Suspense>,
        author:false
    },{
       path:"*",
       element:<Suspense fallback={<Loading></Loading>}><NoFound></NoFound></Suspense>,
       author:false
    },{
        path:"/address",
        element:<Suspense fallback={<Loading></Loading>}><Address></Address></Suspense>,
        author:true
     },{
        path:"/add",
        element:<Suspense fallback={<Loading></Loading>}><Addaddress></Addaddress></Suspense>,
        author:true
     },{
        path:"/hosearch",
        element:<Suspense fallback={<Loading></Loading>}><Hosearch></Hosearch></Suspense>,
        author:false
     },{
        path:"/order",
        element:<Suspense fallback={<Loading></Loading>}><Order></Order></Suspense>,
        author:true
     }
];

function RouterView(){
    return (
        <Routes>
            {elements.map((item,index)=>{
                return <Route key={index} path={item.path} element={item.author?<Author OldComponent={item.element} oldPath={item.path}/>:item.element}>
                    {item.children && item.children.map((item1,index1)=>{
                        return <Route key={index1} path={item1.path} element={item1.author?<Author OldComponent={item1.element} oldPath={item.path+"/"+item1.path}/>:item1.element}></Route>
                    })}
                </Route>
            })}
        </Routes>
    )
}

export default RouterView