<template>
  <div class="container">
    <el-header height="80px" class="header">
      <layoutHeader :activeIndex="activeIndex"></layoutHeader>
    </el-header>
    <div class="c-body">
      <div class="center-selection">
        <ul>
          <li class='sel-li'><router-link to="/teacher/personal/main">个人中心</router-link></li>
          <li class='sel-li'><router-link to="/teacher/personal/info" >修改资料</router-link></li>
          <li class='sel-li'><router-link to="/teacher/personal/phone" class='a-on'>修改手机</router-link></li>
          <li class='sel-li'><router-link to="/teacher/personal/password" >修改密码</router-link></li>
        </ul>
      </div>
      <div class="center-content">
        <p class="content-title">修改手机</p>
        <div class="alert-data-box">
          <div class="input-div">
            <span class="input-title">原号码</span>
            <span id="old-phone" >{{userInfo.user_phone}}</span>
            <span class="fixed-tips">提示：修改后原手机号码不能再登录使用</span>
          </div>
          <div class="input-div">
            <span class="input-title">新号码</span>
            <input type="text" placeholder="请输入手机号码" v-model="newPhone" maxlength="20">
            <span class="tips"></span>
          </div>
          <div class="input-div">
            <span class="input-title">验证码</span>
            <input type="text" placeholder="请输入验证码" v-model="phoneCode" class="w132" maxlength="6">
            <button id="get-code" :disabled="sendTime>0" :style="{color : sendTime>0 ? 'gray': '#2199de'}" @click="sendCode" >{{sendTime>0?sendTime+'s后重新获取':'获取验证码'}}</button>
            <span class="tips"></span>
          </div>
          <div class="btn-div">
            <el-button type="primary" size="small" @click="savePhone"  class="btn-div-btn">保存修改</el-button>
          </div>
        </div>
      </div>
      <div class="cl-fix"></div>
    </div>
    <layout-footer></layout-footer>
  </div>
</template>

<script>
import defaultAvatar from '@/assets/images/tou.png'
import layoutHeader from '@/components/common/layoutHeader'
import layoutFooter from '@/components/common/layoutFooter'
import axios from 'axios'
export default {
  name: 'phone',
  data () {
    return {
      activeIndex: '0',
      newPhone: '',
      phoneCode: '',
      userInfo: {},
      sendTime: 0,
      default_avatar: defaultAvatar
    }
  },
  methods: {
    async getuserInfo () {
      let token = localStorage.getItem('token')
      let userInfo = await axios.get(window.API_URL + '/v2/user/info', {
        params: {token: token}
      })
      if (userInfo.data.retCode === 0) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo.data.retData))
      }
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    },
    async savePhone () {
      if (!this.newPhone) {
        this.$alert('请输入手机号码', '修改手机', {confirmButtonText: '确定'})
        return
      }
      if (this.newPhone === this.userInfo.user_phone) {
        this.$alert('新手机号码与原手机号码相同', '修改手机', {confirmButtonText: '确定'})
        return
      }
      if (!this.phoneCode) {
        this.$alert('请输入手机验证码', '修改手机', {confirmButtonText: '确定'})
        return
      }
      let token = localStorage.getItem('token')
      let _this = this
      let ret = await axios.post(window.API_URL + '/v2/user/info/save-phone', {phone: this.newPhone, phone_code: this.phoneCode}, {params: {token: token}})
      if (ret.data.retCode === 0) {
        this.$alert('手机号码修改成功，请重新登录！', '修改手机', {confirmButtonText: '确定'}).then(function () {
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          return _this.$router.push('/')
        })
        return
      }
      this.$alert(ret.data.retMsg, '修改手机', {confirmButtonText: '确定'})
    },
    sendCode () {
      if (this.sendTime) {
        this.$alert('验证码发送过于频繁', '发送验证码', {confirmButtonText: '确定'})
        return
      }
      if (this.newPhone === this.userInfo.user_phone) {
        this.$alert('新手机号码与原手机号码相同', '修改手机', {confirmButtonText: '确定'})
        return
      }
      if (!this.newPhone) {
        this.$alert('请输入手机号码', '发送验证码', {confirmButtonText: '确定'})
        return
      }
      let _this = this
      axios.post(window.API_URL + '/v2/account/login/send-code', {phone: this.newPhone}).then(function (ret) {
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
  },
  components: {
    layoutHeader, layoutFooter
  },
  created () {
    this.getuserInfo()
  }
}
</script>

<style scoped src="@/assets/css/teacher/personal.css"></style>
<style scoped>

</style>
