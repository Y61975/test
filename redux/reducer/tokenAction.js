import {legacy_createStore as createStore,combineReducers,applyMiddleware} from "redux"
import reduxThunk from "redux-thunk";

// 合并reducer--combineReducers

let store = createStore(reducer)