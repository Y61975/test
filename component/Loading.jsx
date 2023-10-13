import { Component } from "react";
import { Loading } from 'react-vant';
import "./myload.css"

class MyLoading extends Component{
      render(){
        
        return <div className="myloading">
            {/* <h1>Loading...</h1> */}
            <Loading type="ball" />
        </div>
    }

    }

export default MyLoading