<template>
  <el-container class="container">
    <el-header class="header">
      <el-row :gutter="20" class="navbar">
        <el-col :span="12">
          <a class="navbar-brand" href="#"><img alt="logo" src="@/assets/images/qinyun.png"></a>
        </el-col>
        <el-col :span="12">
          <el-menu mode="horizontal">
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">产品中心</el-menu-item>
            <el-menu-item index="3">新闻资讯</el-menu-item>
            <el-menu-item index="4">关于我们</el-menu-item>
            <el-menu-item index="5">帮助中心</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div class="login">
        <div class="login_cont">
          <div class="login_body">
            <div class="login_nav">
              <div class="nav_slider">
                <span :class="{focus:loginForm.role==2}" v-on:click="loginForm.role=2">我是老师</span>
                <span :class="{focus:loginForm.role==1}" v-on:click="loginForm.role=1">我是学生</span>
              </div>
            </div>
            <form>
              <div class="input_signin ">
                <input class="input" v-model="loginForm.phone" placeholder="用户名">
                <input type="password" class="input" v-model="loginForm.password" placeholder="密码">
              </div>
            </form>
          </div>
          <input type="submit" id="button" class="button btn-two active" style="cursor: pointer" v-on:click="loginIn" name="button" value="登录">
        </div>
      </div>
    </el-main>
    <el-footer class="footer">
      <div class="copyright">
        版权所有Copyright&copy;2016-2017&nbsp;&nbsp;All Rights Reserved&nbsp;浙江出版联合集团 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;浙江青云在线教育科技有限公司出品
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'index',
  data () {
    return {
      loginForm: {
        role: 2,
        phone: '',
        password: ''
      }
    }
  },
  methods: {
    loginIn () {
      let _this = this
      const loading = this.$loading({
        lock: true,
        text: '登录中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      axios.post(window.API_URL + '/v2/account/login', {
        phone: _this.user_name,
        password: _this.password,
        role: _this.loginRole
      }).then(function (ret) {
        if (ret.data.retCode === 0) {
          localStorage.setItem('token', ret.data.retData.token)
          localStorage.setItem('role', _this.loginRole)
          axios.get(window.API_URL + '/v2/account/info', {
            params: {token: ret.data.retData.token}
          }).then(function (ret) {
            if (ret.data.retCode === 0) {
              localStorage.setItem('userInfo', JSON.stringify(ret.data.retData))
              _this.$router.push(_this.loginRole === 1 ? '/student/index' : '/teacher/index')
            } else {
              _this.$alert(ret.data.retMsg, '登录', {confirmButtonText: '确定'})
            }
          }).finally(function () {
            loading.close()
          })
        } else {
          _this.$alert(ret.data.retMsg, '登录', {confirmButtonText: '确定'})
        }
      }).finally(function () {
        loading.close()
      })
    }
  },
  created () {
    let _this = this
    let token = localStorage.getItem('token')
    let role = parseInt(localStorage.getItem('role'))
    if (token && role) {
      axios.get(window.API_URL + (role === 1 ? '/v2/student/info' : '/v2/teacher/info'), {
        params: {token: token}
      }).then(function (ret) {
        _this.$router.push(role === 1 ? '/student/index' : '/teacher/index')
      })
    }
  }
}
</script>
<style scoped>
  .header{
    background: #ffffff;
  }
  .navbar{
    width: 1000px;
    margin: auto !important;
  }
  .header .navbar-brand img{
    height: 60px;
  }
  .footer{
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: white;
    margin-top: 20px;
    padding-top: 20px;
    text-align: center;
  }
  .container{
    background: url(~@/assets/images/index_back.png) fixed center center no-repeat;
    background-size: cover;
  }
  .login{
    width: 100%;
    margin-bottom: 20%;
  }
  .login .login_cont{
    width: 470px;
    margin: 10% auto;
    background-color: rgba(0,0,0,.7);
    border-radius:2%;
    position: relative;
  }
  .login .login_cont .login_body{
    padding: 0 61px;
  }
  .login .login_nav{
    width: 100%;
    height: 120px;
    position: relative;
  }
  .login .nav_slider{
    position: absolute;
    width: 100%;
    height: 38px;
    font-size: 24px;
    color: white;
    top: 42px;
  }
  .login .nav_slider span{
    font-family: "Microsoft YaHei";
    color: white;
    text-decoration: none;
    cursor: pointer;
  }
  .login .nav_slider span:first-child{
    float: left;
  }
  .login .nav_slider span:last-child{
    float: right;
  }
  .login .nav_slider span:hover{
    text-decoration: none;
    color: white;
  }
  .login form .input{
    width: 100%;
    height: 55px;
    margin-bottom: 28px;
    border-radius: 5px;
    padding-left: 19px;
    line-height: 55px;
    outline: none;
    font-size: 14px;
  }
  .login input[type="submit"]{
    width: 100%;
    height: 55px;
    border-left-radius: 5px;
    border-right-radius: 5px;
    outline: none;
    background: -moz-linear-gradient(left,#6bc108,#fc530a);
    background: -o-linear-gradient(left,#6bc108,#fc530a);
    background: -ms-linear-gradient(left,#6bc108,#fc530a);
    background: -webkit-linear-gradient(left,#6bc108,#fc530a);
    border: 0;
    height: 67px;
    font-size: 20px;
    font-family: "Microsoft YaHei";
    color: white;
  }
  .login .focus{
    border-bottom: 3px solid #6bc108;
  }
</style>
