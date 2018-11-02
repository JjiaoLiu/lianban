import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './../router'
import {getCookie,setCookie} from '../config'
// import {MessageBox} from 'element-ui'

let authRouters = [];
axios.interceptors.request.use(config => {
  if(getCookie('token')){
    config.headers.token = getCookie('token');
  }
  return config;
},error => {
  return Promise.reject(error);
});


function dealRoute(routers){
  routers.forEach((router,index,rs) => {
    if(router.childs_sc && router.childs_sc.length){
      dealRoute(router.childs_sc)
    }else{
      let authRoute = {
        path:router.dataUrl,name:router.dataUrl,component:resolve => require(['@/pages/' + router.dataUrl],resolve)
      };
      authRouters.push(authRoute);
    }
  });
}

function clearCookie(name){
  setCookie(name,"");
}

Vue.use(Vuex);
export const store = new Vuex.Store({
  state:{
    requireAuth:false,authRoutes:[],permKeys:[],employeeAdd:false
  },mutations:{
    loginIN(state){
      state.requireAuth = true;
      localStorage.setItem('requireAuth',true)
    },loginOUT(state){
      clearCookie('token');
      localStorage.removeItem('requireAuth');
      localStorage.removeItem('realName');
      router.push('/login');
      state.requireAuth = false;
      state.authRoutes = []
    },setAuthRoutes(state,payload){
      state.authRoutes = payload;
      authRouters = [];
      dealRoute(state.authRoutes);
      router.options.routes[2].children.unshift(...authRouters);
      router.addRoutes(router.options.routes);
    },setPermKeys(state,payload){
      state.permKeys = payload;
    }
  },actions:{
    getUserMenu({commit}){
      axios.get(process.env.API_HOST[0] + '/menu/userMenu',{
        timeout:8000,responseType:"json",headers:{
          "Content-Type":"application/json; charset=UTF-8"
        },withCredentials:true
      }).then(res => {
        if(res.status === 200 && res.data.success === true){
          commit('setAuthRoutes',res.data.list_sc);
          commit('setPermKeys',res.data.permKeys);
        }else{
          commit("loginOUT")
        }
      });
    }
  }
});
