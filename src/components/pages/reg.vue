<template>
  <div>
    <div class="header">
      <div class="header-con getHeader">
        <div class="header-icon">
          <a href="index.html" target="_self"></a>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="c-body">
        <div class="reg-win">
          <p class="forget-title">账号注册</p>
          <div class="step-1">
            <div class="input-div">
              <span class="input-title">手机号</span>
              <input type="text" v-model="regForm.phone" placeholder="请输入手机号码" maxlength="11">
              <span class="tips"></span>
            </div>
            <div class="input-div">
              <span class="input-title">验证码</span>
              <input type="text" v-model="regForm.phone_code" placeholder="请输入短信验证码" class="w132" maxlength="4">
              <button id="get-code" :disabled="sendTime>0" :style="{color : sendTime>0 ? 'gray': '#2199de'}" @click="sendCode" >{{sendTime>0?sendTime+'s后重新获取':'获取验证码'}}</button>
              <span class="tips"></span>
            </div>
            <div class="input-div">
              <span class="input-title">姓名</span>
              <input type="text" v-model="regForm.user_name" placeholder="请输入姓名" maxlength="12">
              <span class="tips"></span>
            </div>
            <div class="input-div">
              <span class="input-title">密码</span>
              <input type="password" v-model="regForm.password" placeholder="请输入密码" maxlength="20">
              <span class="tips"></span>
              <span class="level-tips"></span>
            </div>
            <div class="input-div">
              <span class="input-title">确认密码</span>
              <input type="password" v-model="regForm.re_password" placeholder="请再次输入密码" id="pass2" maxlength="20">
              <span class="tips"></span>
            </div>
            <div class="input-div">
              <span class="input-title">推荐码</span>
              <input type="text" v-model="regForm.agent_code" placeholder="推荐码"  maxlength="11">
              <span class="tips"></span>
            </div>
            <div class="reg-btn-div">
              <el-button type="primary" class="cc-btn next-forget-btn" :loading="regIng"  @click="reg">提交注册</el-button>
              <router-link class="back-login-btn" :to="{path: '/login'}"><el-button type="text">已有账号，去登录</el-button></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-footer height="100px" class="footer">
      <layout-footer></layout-footer>
    </el-footer>
  </div>
</template>

<script>
import layoutFooter from '@/components/common/layoutFooter'
import axios from 'axios'
export default {
  name: 'forget',
  components: {
    layoutFooter
  },
  data () {
    return {
      regIng: false,
      sendTime: 0,
      regForm: {
        role: 2,
        phone: '',
        phone_code: '',
        password: '',
        re_password: '',
        agent_code: '',
        user_name: ''
      }
    }
  },
  methods: {
    async reg () {
      let regx = /^1\d{10}$/
      if (!regx.test(this.regForm.phone)) {
        this.$alert('请输入正确的11位手机号码', '注册', {confirmButtonText: '确定'})
        return
      }
      if (!this.regForm.user_name) {
        this.$alert('请输入姓名', '注册', {confirmButtonText: '确定'})
        return
      }
      if (!this.regForm.phone_code) {
        this.$alert('请输入手机短信验证码', '注册', {confirmButtonText: '确定'})
        return
      }
      if (!this.regForm.password) {
        this.$alert('请输入密码', '注册', {confirmButtonText: '确定'})
        return
      }
      if (!this.regForm.agent_code) {
        this.$alert('请输入推荐码', '注册', {confirmButtonText: '确定'})
        return
      }

      if (this.regForm.password !== this.regForm.re_password) {
        this.$alert('两次输入密码不一致', '注册', {confirmButtonText: '确定'})
        return
      }
      this.regIng = true
      let regRet = await axios.post(window.API_URL + '/v2/account/reg', this.regForm)
      if (regRet.data.retCode !== 0) {
        this.$alert(regRet.data.retMsg, '注册', {confirmButtonText: '确定'})
        this.regIng = false
        return
      }
      localStorage.setItem('token', regRet.data.retData.token)
      localStorage.setItem('role', this.regForm.role)
      let _this = this
      this.$alert('注册成功！', '注册', {confirmButtonText: '确定',
        callback: function () {
          _this.$router.push('/')
        }})
    },
    sendCode () {
      if (this.sendTime) {
        this.$alert('验证码发送过于频繁', '发送验证码', {confirmButtonText: '确定'})
        return
      }
      let regx = /^1\d{10}$/
      if (!regx.test(this.regForm.phone)) {
        this.$alert('请输入正确的11位手机号码', '注册', {confirmButtonText: '确定'})
        return
      }
      let _this = this
      axios.post(window.API_URL + '/v2/account/login/send-code', this.regForm).then(function (ret) {
        _this.$alert(ret.data.retMsg, '发送验证码', {confirmButtonText: '确定'})
        if (ret.data.retCode !== 0) {
          return
        }
        _this.sendTime = 60
        let intval = setInterval(function () {
          _this.sendTime--
          if (_this.sendTime <= 0) {
            clearInterval(intval)
          }
        }, 1000)
      })
    }
  }
}
</script>

<style scoped>
  .back-login-btn {
    cursor: pointer;
    display: block;
    margin-left: 134px;
    width: 239px;
    height: 32px;
    margin-bottom: 3px;
    color: #2199de;
    outline: 0;
    border: 0;
    background: #fff;
    font-size: 12px;
  }
  .container {
    padding-bottom: 0px !important;
  }
  .header {
    width: 100%;
    min-width: 1040px;
    background: #fff;
  }
  .header-con {
    position: relative;
    width: 1040px;
    height: 80px;
    margin: 0 auto;
    padding: 0 20px;
  }
  .header-icon {
    width: 240px;
    height: 100%;
    float: left;
  }
  .header-icon a {
    background: url(~@/assets/images/yys.png) no-repeat center;
    display: block;
    width: 100%;
    height: 45px;
    position: relative;
    top: 7px;
  }
  .reg-win {
    height: 552px;
    width: 1000px;
    margin: 0 auto;
    background: #fff;
    border-radius: 6px;
    padding-left: 320px;
    padding-top: 80px;
  }
  .forget-title {
    text-indent: 119px;
    font-size: 26px;
    color: #404040;
    margin-bottom: 34px;
  }
  .input-div {
    height: 31px;
    line-height: 31px;
    margin-bottom: 14px;
    position: relative;
  }
  .input-title {
    display: inline-block;
    width: 58px;
    height: 100%;
    margin-right: 11px;
    text-align: right;
    font-size: 14px;
    color: #9e9e9e;
  }
  .input-div input {
    height: 100%;
    padding-left: 13px;
    width: 239px;
    border-radius: 1px;
    border: 1px solid #d9e0e8;
    outline: 0;
    color: #646464;
  }
  .tips {
    font-size: 12px;
    color: #f0384a;
    margin-left: 10px;
  }
  #get-code {
    width: 98px;
    height: 100%;
    margin-left: 4px;
    border: 1px solid #d9e0e8;
    border-radius: 1px;
    line-height: 29px;
    color: #2199de;
    font-size: 14px;
    outline: 0;
    background: #fff;
    cursor: pointer;
  }
  .input-div .w132 {
    width: 132px;
  }
  .reg-btn-div {
    margin-top: 24px;
  }
  .next-forget-btn {
    margin-left: 74px;
    width: 239px;
    height: 32px;
    margin-bottom: 17px;
    padding-top: 10px;
  }
</style>
