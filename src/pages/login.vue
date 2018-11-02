<template>
  <div class="login-bg">
    <div class="login-wrap">
      <div class="login-box">
        <div class="login-txt">
          <p class="txt-en">management backstage</p>
          <p class="txt-cn">管理后台</p>
          <!--<p class="txt-copy">Copyright © 2018 Uimaker.com their respective owners. E-mail:admin@uimaker.com</p>-->
        </div>
        <div class="login-main">
          <h1><img src="../assets/img/icon_logo.png" height="103" width="170"/></h1>
          <p>欢迎登录</p>
          <div class="login-form" @keyup.enter="loginIn">
            <div class="input">
              <div class="input-label"><img src="../assets/img/icon_phone.png" height="18" width="12"/></div>
              <input type="tel" placeholder="请输入账号" v-model.trim="user.userName" required TABINDEX="1"
                     @blur="checkInput($event,'userName')">
            </div>
            <div class="input">
              <div class="input-label"><img src="../assets/img/icon_psw.png" height="16" width="14"/></div>
              <input trueType="password" :type="inputType" placeholder="请输入登录密码(8-16位字母和数字)" required
                     v-model.trim="user.password" TABINDEX="2"
                     @blur="checkInput($event,'password')">
              <div class="input-right"><img :src="iconEye" height="10" width="18"
                                            @click="changeInputType"/></div>
            </div>
            <div class="input">
              <div class="input-label"><img src="../assets/img/icon_ewm.png" height="18" width="10"/></div>
              <input trueType="captcha" placeholder="请输入验证码" v-model.trim="user.captcha" required
                     TABINDEX="3"
                     @blur="checkInput($event,'captcha')" maxlength="4">
              <div class="input-right ewm"><img :src="captchaSrc" height="35" width="100"
                                                @click="changeEwm"/></div>
            </div>
            <div class="checkbox">
              <el-checkbox v-model="user.rememberMe">自动登录</el-checkbox>
            </div>
            <div class="submit">
              <button type="button" @click="loginIn" class="login-btn" :disabled="disabled">登录</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {setCookie} from '../config'
  import iconEyeClose from '../assets/img/icon_eye_close.png'
  import iconEyeOpen from '../assets/img/icon_eye_open.png'

  export default {
    name:'login',data(){
      return {
        inputType:'password',iconEye:iconEyeClose,captchaSrc:'',user:{
          userName:'',password:'',captcha:'',rememberMe:false,
        },disabled:true
      }
    },created(){

      // if(localStorage.getItem('rememberMe')){
      //   this.checkRememberMe()
      // }else{
      this.changeEwm();
      // }
    },methods:{
      changeInputType(){
        if(this.inputType === 'password'){
          this.inputType = 'text';
          this.iconEye = iconEyeOpen;
        }else{
          this.inputType = 'password';
          this.iconEye = iconEyeClose;
        }
      },changeEwm(){
        this.$axios.get(process.env.API_HOST[3] + '/util/captcha',{responseType:'arraybuffer'}).then(res => {
          this.captchaSrc = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data,byte) => data + String.fromCharCode(byte),''))
        });
      },checkInput(e,attr){
        // if (e.target.required && !e.target.value) {
        //   this.$message(e.target.placeholder);
        //   return false
        // }
        // const PASSWORD_REG = /^(?![^a-zA-Z]+$)(?!\\\\D+$).{8,16}$/;
        // const PHONE_NUMBER_REG = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        // switch (e.target.type) {
        //   case 'tel':
        //     if (!e.target.value.match(PHONE_NUMBER_REG)) {
        //       this.$message(e.target.placeholder);
        //       this.user[attr] = '';
        //       return false
        //     }
        //     break;
        //   case 'password':
        //     if (!e.target.value.match(PASSWORD_REG)) {
        //       this.$message(e.target.placeholder);
        //       this.user[attr] = '';
        //       return false
        //     }
        //     break;
        //   case 'text':
        //     if (e.target.attributes.trueType.value === 'password' && !e.target.value.match(PASSWORD_REG)) {
        //       this.$message(e.target.placeholder);
        //       this.user[attr] = '';
        //       return false
        //     }
        //     // if (e.target.attributes.trueType.value === 'captcha' && e.target.value.length != 6) {
        //     //   this.$message(e.target.placeholder);
        //     //   this.user[attr] = '';
        //     //   return false
        //     // }
        //     break;
        //   default:
        //     break
        // }
      },loginIn(){
        if(!this.user.userName){
          this.$message.warning("账号不能为空");
          return false;
        }
        if(!this.user.password){
          this.$message.warning("密码不能为空");
          return false;
        }
        if(!this.user.captcha){
          this.$message.warning("验证码不能为空");
          return false;
        }
        const loading = this.$loading({
          lock:true,text:'Loading',spinner:'el-icon-loading',background:'rgba(0, 0, 0, 0.7)'
        });
        this.$axios.post(process.env.API_HOST[0] + '/login',this.user).then(res => {
          if(res.data.success === true){
            setCookie('token',res.data.token);
            setCookie('realName',res.data.realName);
            if(this.user.rememberMe){
              localStorage.setItem('rememberMe',1)
            }else{
              if(localStorage.getItem('rememberMe')){
                localStorage.removeItem('rememberMe')
              }
            }
            this.$store.commit("loginIN");
            this.$router.push(this.$route.query.redirect || "/")
          }else{
            this.$message.warning(res.data.msg);
            this.changeEwm();
          }
        });
        loading.close();
      },checkRememberMe(){
        const loading = this.$loading({
          lock:true,text:'Loading',spinner:'el-icon-loading',background:'rgba(0, 0, 0, 0.7)'
        });
        this.$axios.post(process.env.API_HOST[0] + '/checkRememberMe').then(res => {
          if(res.data.success === true){
            setCookie('token',res.data.token);
            localStorage.setItem('realName',res.data.realName);
            this.$store.commit("loginIN");
            this.$router.push(this.$route.query.redirect || "/")
          }else{
            this.changeEwm();
          }
        });
        loading.close();
      }
    },watch:{
      user:{
        handler(_new,_old){
          if(!(this.user.ewm != '' && this.user.password != '' && this.user.phone != '')){
            this.disabled = true;
          }else{
            this.disabled = false;
          }
        },deep:true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import './../assets/mixin/all.scss';

  .login-bg {
    background: url("../assets/img/login_bg.jpg") center center no-repeat;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    min-width: 1320px;
    min-height: 668px;
  }

  .login-wrap {
    @include use-flex(center, center);
    width: 100%;
    height: 100%;
    .login-box {
      width: 1320px;
      height: 668px;
      @include use-flex(center, center);
      .login-txt {
        width: 920px;
        text-align: center;
        color: #ffffff;
        padding-top: 150px;
        .txt-en {
          font-size: 44px;
          margin-bottom: 25px;
        }
        .txt-cn {
          font-size: 24px;
        }
        .txt-cn {
          font-size: 24px;
        }
        .txt-copy {
          font-size: 14px;
          color: #999999;
          position: relative;
          top: 230px;
        }
      }
      .login-main {
        width: 450px;
        height: 668px;
        /*margin-top: 18px;*/
        background: #ffffff;
        padding: 40px 35px;
        > h1, > p {
          text-align: center;
        }
        > h1 {
          height: 103px;
        }
        > p {
          font-size: 24px;
          color: #468;
          margin-top: 16px;
          margin-bottom: 35px;
        }
        .login-form {
          .input {
            position: relative;
            .input-label {
              position: absolute;
              top: 33px;
              left: 0;
            }
            .input-right {
              position: absolute;
              top: 33px;
              right: 0;
              cursor: pointer;
              &.ewm {
                top: 20px;
              }
            }
            input {
              border-bottom: 1px solid #e6e6e6;
              transition: all .3s;
              height: 66px;
              padding: 34px 20px 16px 23px;
              width: 100%;
              font-size: 14px;
              line-height: 16px;
              color: #468;
              &:focus {
                border-bottom: 1px solid #88a3b9;
              }
            }
          }
          .checkbox {
            margin-top: 20px;
            margin-bottom: 40px;
          }
          .login-btn {
            width: 100%;
            color: #ffffff;
            font-size: 16px;
            height: 46px;
            line-height: 46px;
            text-align: center;
            letter-spacing: 5px;
            display: block;
            background: #00a790;
            &:disabled {
              cursor: auto;
              background: #88a3b9;
            }
          }
        }
      }
    }
  }
</style>
