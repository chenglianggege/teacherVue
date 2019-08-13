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
          <li class='sel-li'><router-link to="/teacher/personal/phone" >修改手机</router-link></li>
          <li class='sel-li'><router-link to="/teacher/personal/password" class='a-on'>修改密码</router-link></li>
        </ul>
      </div>
      <div class="center-content">
        <p class="content-title">修改密码</p>
        <div class="alert-data-box">
          <div class="input-div">
            <span class="input-title">原密码</span>
            <input type="password" placeholder="请输入原密码" v-model="submitForm.old_password" maxlength="20">
            <span class="tips"></span>
          </div>
          <div class="input-div">
            <span class="input-title">新密码</span>
            <input type="password" placeholder="请输入新密码"  v-model="submitForm.password" maxlength="20">
            <span class="tips"></span>
            <span class="level-tips"></span>
          </div>
          <div class="input-div">
            <span class="input-title">确认密码</span>
            <input type="password" placeholder="请再次输入新密码" v-model="submitForm.repassword" maxlength="20">
            <span class="tips"></span>
          </div>
          <div class="btn-div">
            <el-button type="primary" size="small" @click="savePassword"  class="btn-div-btn">保存修改</el-button>
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
  name: 'password',
  data () {
    return {
      activeIndex: '0',
      userInfo: {},
      default_avatar: defaultAvatar,
      submitForm: {
        old_password: '',
        password: '',
        repassword: ''
      }
    }
  },
  methods: {
    async savePassword () {
      if (this.submitForm.password !== this.submitForm.repassword) {
        this.$alert('两次输入的密码不一致', '修改密码', {confirmButtonText: '确定'})
        return
      }
      if (!this.submitForm.password) {
        this.$alert('请输入新密码', '修改密码', {confirmButtonText: '确定'})
        return
      }
      if (!this.submitForm.old_password) {
        this.$alert('请输入旧密码', '修改密码', {confirmButtonText: '确定'})
        return
      }
      let token = localStorage.getItem('token')
      let ret = await axios.post(window.API_URL + '/v2/user/password', this.submitForm, {params: {token: token}})
      if (ret.data.retCode === 0) {
        this.$alert('密码修改成功，下次请使用新密码登录！', '修改密码', {confirmButtonText: '确定'})
        return
      }
      this.$alert(ret.data.retMsg, '修改密码', {confirmButtonText: '确定'})
    }
  },
  components: {
    layoutHeader, layoutFooter
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
  }
}
</script>

<style scoped src="@/assets/css/teacher/personal.css"></style>
<style scoped>

</style>
