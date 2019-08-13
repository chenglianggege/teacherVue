<template>
  <div class="container">
    <el-header height="80px" class="header">
      <layoutHeader :activeIndex="activeIndex"></layoutHeader>
    </el-header>
    <div class="c-body">
      <div class="center-selection">
        <ul>
          <li class='sel-li'><router-link to="/teacher/personal/main" >个人中心</router-link></li>
          <li class='sel-li'><router-link to="/teacher/personal/info" class='a-on'>修改资料</router-link></li>
          <li class='sel-li'><router-link to="/teacher/personal/phone" >修改手机</router-link></li>
          <li class='sel-li'><router-link to="/teacher/personal/password" >修改密码</router-link></li>
        </ul>
      </div>
      <div class="center-content">
        <p class="content-title">修改资料</p>
        <div class="alert-data-box">
          <div class="input-div">
            <span class="input-title">姓名</span>
            <input type="text" placeholder="请输入姓名" v-model="userInfo.user_name" maxlength="12">
            <span class="tips"></span>
          </div>
          <div class="input-div">
            <span class="input-title">学校</span>
            <input @click="dialogSelectSchoolVisible = true" type="text" :value="userInfo.school_name" class="pointer" placeholder="请输入学校" maxlength="30" readonly>
            <span class="tips"></span>
          </div>
          <div class="input-div">
            <span class="input-title">邮箱</span>
            <input type="text" placeholder="请输入邮箱" v-model="userInfo.user_email"  maxlength="30">
            <span class="tips"></span>
          </div>
          <div class="btn-div">
            <el-button type="primary" size="small" @click="saveInfo"  class="btn-div-btn">保存修改</el-button>
          </div>
        </div>
      </div>
      <div class="cl-fix"></div>
    </div>
    <selectSchool :visible="dialogSelectSchoolVisible" :showClose="true" v-on:close="dialogSelectSchoolVisible = false" v-on:updateSchool="_updateSchool"></selectSchool>
    <layout-footer></layout-footer>
  </div>
</template>

<script>
import defaultAvatar from '@/assets/images/tou.png'
import layoutHeader from '@/components/common/layoutHeader'
import layoutFooter from '@/components/common/layoutFooter'
import selectSchool from '@/components/common/selectSchool'
import axios from 'axios'
import bus from '@/common/eventBus'
export default {
  name: 'info',
  data () {
    return {
      activeIndex: '0',
      userInfo: {},
      default_avatar: defaultAvatar,
      dialogSelectSchoolVisible: false
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
    async saveInfo () {
      let token = localStorage.getItem('token')
      let ret = await axios.post(window.API_URL + '/v2/user/info/save', {user_name: this.userInfo.user_name, user_email: this.userInfo.user_email}, {params: {token: token}})
      this.$alert(ret.data.retMsg, '修改资料', {confirmButtonText: '确定'})
      if (ret.data.retCode === 0) {
        let userInfo = await axios.get(window.API_URL + '/v2/user/info', {
          params: {token: token}
        })
        if (userInfo.data.retCode === 0) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo.data.retData))
          bus.$emit('userinfo')
        }
      }
    },
    _updateSchool (schoolName) {
      this.userInfo.school_name = schoolName
      this.dialogSelectSchoolVisible = false
    }
  },
  components: {
    layoutHeader, layoutFooter, selectSchool
  },
  created () {
    this.getuserInfo()
  }
}
</script>

<style scoped src="@/assets/css/teacher/personal.css"></style>
<style scoped>

</style>
