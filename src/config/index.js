function setCookie(cname,cvalue){
  document.cookie = cname + "=" + cvalue + ";";
}

//获取cookie
function getCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++){
    var c = ca[i];
    while(c.charAt(0) == ' ') c = c.substring(1);
    if(c.indexOf(name) != -1) return c.substring(name.length,c.length);
  }
  return "";
}

//清除cookie

const facilityListOption = [{
  name:"淋浴",val:'facility_sc-1',active:require('./../assets/img/icon_linyu_active.png'),inactive:require('./../assets/img/icon_linyu.png')
},{
  name:"打印机",val:'facility_sc-2',active:require('./../assets/img/icon_dayin_active.png'),inactive:require('./../assets/img/icon_dayin.png'),
},{
  name:"冰箱",val:'facility_sc-3',active:require('./../assets/img/icon_bingxiang_active.png'),inactive:require('./../assets/img/icon_bingxiang.png'),
},{
  name:"微波炉",val:'facility_sc-4',active:require('./../assets/img/icon_weibolu_active.png'),inactive:require('./../assets/img/icon_weibolu.png'),
},{
  name:"饮水机",val:'facility_sc-5',active:require('./../assets/img/icon_yinshuiji_active.png'),inactive:require('./../assets/img/icon_yinshuiji.png'),
},{
  name:"公共前台",val:'facility_sc-6',active:require('./../assets/img/icon_ggqt_active.png'),inactive:require('./../assets/img/icon_ggqt.png'),
},{
  name:"吧台",val:'facility_sc-7',active:require('./../assets/img/icon_batai_active.png'),inactive:require('./../assets/img/icon_batai.png'),
},{
  name:"会议室",val:'facility_sc-8',active:require('./../assets/img/icon_huiyishi_active.png'),inactive:require('./../assets/img/icon_huiyishi.png'),
},{
  name:"免费咖啡",val:'facility_sc-9',active:require('./../assets/img/icon_coffee_active.png'),inactive:require('./../assets/img/icon_coffee.png'),
},{
  name:"娱乐区域",val:'facility_sc-10',active:require('./../assets/img/icon_yule_active.png'),inactive:require('./../assets/img/icon_yule.png'),
},{
  name:"休息区域",val:'facility_sc-11',active:require('./../assets/img/icon_xiuxi_active.png'),inactive:require('./../assets/img/icon_xiuxi.png'),
},{
  name:"高速网络",val:'facility_sc-12',active:require('./../assets/img/icon_wifi_active.png'),inactive:require('./../assets/img/icon_wifi.png'),
},{
  name:"睡眠舱",
  val:'facility_sc-13',
  active:require('./../assets/img/icon_shuimiancang_active.png'),
  inactive:require('./../assets/img/icon_shuimiancang.png'),
},{
  name:"保洁",
  val:'facility_sc-14',
  active:require('./../assets/img/icon_baojie_active.png'),
  inactive:require('./../assets/img/icon_baojie.png'),
},{
  name:"24h保安",
  val:'facility_sc-15',
  active:require('./../assets/img/icon_baoan_active.png'),
  inactive:require('./../assets/img/icon_baoan.png'),
}];

export {
  setCookie,getCookie,facilityListOption
}
