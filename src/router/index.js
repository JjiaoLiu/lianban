import Vue from 'vue'
import Router from 'vue-router'
import LeftNav from '@/pages/LeftNav'
import NotFound from '@/pages/NotFound'
import {store} from "../store";

Vue.use(Router);

const router = new Router({
  routes:[{
    path:'/',redirect:'/home'
  },{
    path:'/login',name:'login',component:resolve => require(['@/pages/login'],resolve)
  },{
    path:'/home',component:LeftNav,children:[{
      path:'roomSit/add',name:'roomSitAdd',component:resolve => require(['@/pages/roomSitAdd'],resolve),
    },{
      path:'roomPart/add',name:'roomPartAdd',component:resolve => require(['@/pages/roomPartAdd'],resolve),
    },{
      path:'roomMeeting/add',name:'roomMeetingAdd',component:resolve => require(['@/pages/roomMeetingAdd'],resolve),
    },{
      path:'roomFit/add',name:'roomFitAdd',component:resolve => require(['@/pages/roomFitAdd'],resolve),
    },{
      path:'roomCommen/add',name:'roomCommenAdd',component:resolve => require(['@/pages/roomCommenAdd'],resolve),
    },{
      path:'orderPart/deal',name:'orderPartDeal',component:resolve => require(['@/pages/orderPartDeal'],resolve),
    },{
      path:'orderMeeting/deal',name:'orderMeetingDeal',component:resolve => require(['@/pages/orderMeetingDeal'],resolve),
    },{
      path:'operationVisit/detail',name:'operationVisitDetail',component:resolve => require(['@/pages/operationVisitDetail'],resolve),
    },{
      path:'operationRoom/add',name:'operationRoomAdd',component:resolve => require(['@/pages/operationRoomAdd'],resolve),
    },{
      path:'operationFit/deal',name:'operationFitDeal',component:resolve => require(['@/pages/operationFitDeal'],resolve),
    },{
      path:'operationAdv/add',name:'operationAdvAdd',component:resolve => require(['@/pages/operationAdvAdd'],resolve),
    },{
      path:'operationAc/add',name:'operationAcAdd',component:resolve => require(['@/pages/operationAcAdd'],resolve),
    },{
      path:'enterpriseUser/detail',name:'enterpriseUserDetail',component:resolve => require(['@/pages/enterpriseUserDetail'],resolve),
    },{
      path:'enterpriseFilter/detail',name:'enterpriseFilterDetail',component:resolve => require(['@/pages/enterpriseMngEdit'],resolve),
    },{
      path:'enterpriseMng/edit',name:'enterpriseMngEdit',component:resolve => require(['@/pages/enterpriseMngEdit'],resolve),
    },{
      path:'employee/add',name:'employeeAdd',component:resolve => require(['@/pages/employeeAdd'],resolve),
    },

    ]
  },{path:'*',component:NotFound}]
});

router.beforeEach((to,from,next) => {
  if(to.fullPath === '/' || (store.state.requireAuth || localStorage.getItem('requireAuth'))){
    next();
  }else{
    if(!to.fullPath.includes("/login")){
      next({
        path:'/login',query:{redirect:to.fullPath}
      })
    }
    next()
  }
});
export default router
