import axios from "axios";
import {store} from "./../store";
import {getCookie} from './../config/index'
import {Message,Loading} from 'element-ui'

let loadingInstance;

const Axios = axios.create({
  timeout:8000,responseType:"json",headers:{
    "Content-Type":"application/json; charset=UTF-8"
  },withCredentials:true
});
Axios.interceptors.request.use(config => {
  loadingInstance = Loading.service({fullscreen:true,lock:true});
  if(getCookie('token')){
    config.headers.token = getCookie('token');
  }
  return config;
},error => {
  loadingInstance.close();
  return Promise.reject(error);
});

Axios.interceptors.response.use(response => {
  if(response.data && (response.data.code === '403' || response.data.code === '401')){
    store.commit("loginOUT");
    return;
  }
  if(response.status === 200){
    loadingInstance.close();
    return response;
  }else{
    loadingInstance.close();
    Message.warning(response.data.msg)
  }
},error => {
  loadingInstance.close();
  return Promise.reject(error);
});

export default {
  install:function(Vue,Option){
    Object.defineProperty(Vue.prototype,"$axios",{value:Axios});
  }
};
