<template>
  <div class="main">
    <div class="login">
      <div class="login-header">
        <img class="logo" src="@/assets/images/login-logo.png"/>
        <div class="tab-btns">
          <el-button @click="()=>this.tab = 1" class="tab-btn" :class="{active: tab===1}" type="text" >网页版</el-button>
          <span style="color: #efefef;margin: 0 10px">|</span>
          <el-button @click="()=>this.tab = 2" class="tab-btn" :class="{active: tab===2}" type="text">手机端</el-button>
        </div>
      </div>
      <div style="height: 1px;width: 100%;background-color: #efefef"></div>
      <div v-show="tab===1" class="login-form">
        <div class="form-title">账号</div>
        <div class="input-div">
          <span class="iconfont icon-mobile"></span>
          <input type="text" maxlength="11" auto-complete="off" v-model="loginForm.phone" :class="{hasErr: phoneErr}"  placeholder="请输入手机号码" class="login-input">
        </div>
        <div class="notice"><span>{{phoneErr}}</span></div>

        <div class="form-title">密码</div>
        <div class="input-div">
          <span class="iconfont icon-lock"></span>
          <input type="password" maxlength="20" auto-complete="off" v-model="loginForm.password" :class="{hasErr: errorStr}"  placeholder="请输入密码" class="login-input">
        </div>
        <div class="notice"><span>{{errorStr}}</span></div>
        <div class="remember">
          <el-checkbox v-model="checked">下次自动登录</el-checkbox>
          <router-link to="forget" style="color: #999999;font-size: 14px" type="text">忘记密码?</router-link>
        </div>
        <el-button type="primary" :loading="loginIng" @click="loginIn" class="login-btn">登录</el-button>
        <div class="reg-account">没有账号？<router-link to="reg" ><span style="color: #409eff;">立即注册</span></router-link></div>
      </div>
      <div v-show="tab===2" class="login-form">
        <img src="@/assets/images/phone.png" style="width: 400px;height:  298px"/>
      </div>
    </div>
    <div class="copy-right">
      苏ICP备14042221号 CopyRight ©2016-2019, All Rights Reserved.苏州声通信息科技有限公司
    </div>
  </div>
</template>

<script>
import layoutFooter from '@/components/common/layoutFooter'
import axios from 'axios'
export default {
  name: 'login',
  components: {
    layoutFooter
  },
  data () {
    return {
      loginIng: false,
      checked: true,
      tab: 1,
      loginForm: {
        role: 2,
        phone: '',
        password: '',
        device: 'WEB',
        remmberMe: 0
      },
      errorStr: '',
      phoneErr: ''
    }
  },
  methods: {
    async loginIn () {
      let _this = this
      this.phoneErr = ''
      this.errorStr = ''
      let regx = /^1\d{10}$/
      if (!regx.test(this.loginForm.phone)) {
        // this.$alert('', '登录', {confirmButtonText: '确定'})
        this.phoneErr = '请输入正确的11位手机号码'
        return
      }
      if (!this.loginForm.password) {
        // this.$alert('', '登录', {confirmButtonText: '确定'})
        this.errorStr = '请输入登录密码'
        return
      }
      this.loginIng = true
      let loginRet = await axios.post(window.API_URL + '/v2/account/login', this.loginForm)
      if (loginRet.data.retCode === 1004) {
        // _this.$alert(userInfo.data.retMsg, '登录', {confirmButtonText: '确定'})
        this.phoneErr = loginRet.data.retMsg
        this.loginIng = false
        return
      }
      if (loginRet.data.retCode !== 0) {
        // _this.$alert(loginRet.data.retMsg, '登录', {confirmButtonText: '确定'})
        this.errorStr = loginRet.data.retMsg
        this.loginIng = false
        return
      }
      localStorage.setItem('token', loginRet.data.retData.token)
      localStorage.setItem('role', _this.loginForm.role)
      let userInfo = await axios.get(window.API_URL + '/v2/user/info', {
        params: {token: loginRet.data.retData.token}
      })
      if (userInfo.data.retCode !== 0) {
        // _this.$alert(userInfo.data.retMsg, '登录', {confirmButtonText: '确定'})
        this.errorStr = userInfo.data.retMsg
        this.loginIng = false
        return
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.data.retData))
      _this.$router.push(_this.loginRole === 1 ? '/student/index' : '/teacher/index')
    }
  },
  async created () {
    let token = localStorage.getItem('token')
    let role = parseInt(localStorage.getItem('role'))
    if (token && role) {
      let userInfo = await axios.get(window.API_URL + '/v2/user/info', {
        params: {token: token}
      })
      if (userInfo.data.retCode === 0) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo.data.retData))
        this.$router.push(role === 1 ? '/student/index' : '/teacher/index')
      }
    }
  }
}
</script>

<style scoped>
  .main{
    background: url(~@/assets/images/denglubg.png) no-repeat center;
    min-height: 998px;
    width: 100%;
    min-width: 1040px;
    height: 100%;
    margin: 0 !important;
    display: flex;display: -webkit-flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    flex-direction: column;
  }
  .login{
    width: 470px;
    height: 461px;
    background-color: #ffffff;
    box-shadow: 0px 4px 13px 3px
    rgba(0, 0, 0, 0.14);
    border-radius: 4px;
  }
  .login-header{
    display: flex;display: -webkit-flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 20px 0 20px;
  }
  .logo {
    width: 119px;
    height: 38px;
    margin-top: 10px;
  }
  .tab-btn{
    color: #333333;
    font-size: 18px;
    border-radius: 0;
    padding: 20px 10px ;
    border-bottom-style: solid;
    border-bottom-color: #fff;
    border-bottom-width: 2px;
  }
  .active{
    color: #409EFF !important;
    border-bottom-color: #409EFF !important;
  }
  .mb18 {
    margin-bottom: 18px;
  }
  .input-div {
    position: relative;
  }
  .login-input {
    height: 40px;
    width: 404px;
    display: block;
    outline: 0;
    padding-left: 34px;
    background: #f9fcfe;
    border: 1px solid #d9dee2;
    font-size: 14px;
    border-radius: 4px;
  }
  .login-form{
    padding-left: 40px;
    padding-top: 30px;
    padding-right: 40px;
  }
  .hasErr{
    border: solid 2px #fd5a46;
    box-shadow: 0px 0px 6px 1px
    rgba(253, 90, 70, 0.17);
  }
  .form-title{
    margin-bottom: 10px;
  }
  .iconfont{
    position: absolute;
    font-size: 20px;
    color: #aaaaaa;
    top: 8px;
    left: 5px;
  }
  .notice{
    font-size: 12px;
    color: #fd5a46;
    height: 20px;
  }
  .remember{
    margin-top: 10px;
    display: flex;display: -webkit-flex;
    justify-content: space-between;
  }
  .login-btn{
    width: 184px;
    margin-top: 30px;
    margin-left: 109px;
  }
  .reg-account{
    font-size: 14px;
    margin-top: 30px;
    margin-left: 131px;
  }
  .copy-right{
    font-size: 13px;
    color: #333333;
    opacity: 0.5;
    margin-top: 200px;
  }
</style>
