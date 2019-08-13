<template>
  <div class="container">
    <el-header height="80px" class="header">
      <layoutHeader :activeIndex="activeIndex"></layoutHeader>
    </el-header>
    <div class="c-body">
      <div class="center-selection">
        <ul>
          <li class='sel-li'><router-link to="/teacher/personal/main" class='a-on'>个人中心</router-link></li>
          <li class='sel-li'><router-link to="/teacher/personal/info" >修改资料</router-link></li>
          <li class='sel-li'><router-link to="/teacher/personal/phone" >修改手机</router-link></li>
          <li class='sel-li'><router-link to="/teacher/personal/password" >修改密码</router-link></li>
        </ul>
      </div>
      <div class="center-content">
        <div class="personal-con">
          <div class="mydata" id="container">

            <div class="myimg-div">
              <el-upload :action="uploadAction" :on-success="uploadSuccess" :on-error="uploadError" :show-file-list="false" name="file">
              <img :src="userInfo.user_avatar ? userInfo.user_avatar : default_avatar" class='myimg'>
              <div id="selectfiles" title="点击修改头像"></div>
              </el-upload>
            </div>

            <p class="myname">
              <span v-text='userInfo.user_name'></span>
            </p>
            <p class="myID" style="color: red;margin-top: 5px">
              点击图片可修改头像
            </p>
          </div>
          <div class='mydata-box box-bottom'>
            <div class="my-data-left fl">
              <span class='icon-data'></span>
            </div>
            <div class="mydata-right fl">
              个人资料：<span ></span>
              <p>姓名：<span v-text='userInfo.user_name'></span></p>
              <p>学校：<span v-text='userInfo.school_name||"无"'></span></p>
              <router-link to="/teacher/personal/info" class='right-btn cc-btn'>修改资料</router-link>
            </div>
            <div class="cl-fix"></div>
          </div>
          <div class='mydata-box box-bottom'>
            <div class="my-data-left fl">
              <span class='icon-phone'></span>
            </div>
            <div class="mydata-right fl">
              登录手机号码：<span v-text="userInfo.user_phone"></span>
              <p>可使用此手机号码登录，找回密码</p>
              <router-link to="/teacher/personal/phone" class='right-btn cc-btn'>修改手机号</router-link>
            </div>
            <div class="cl-fix"></div>
          </div>
          <div class='mydata-box'>
            <div class="my-data-left fl">
              <span class='icon-pass'></span>
            </div>
            <div class="mydata-right fl">
              登录密码：<span id='set_pass'>已设置</span>
              <p>建议定期更换密码，确保帐号安全</p>
              <router-link to="/teacher/personal/password" class='right-btn cc-btn'>修改密码</router-link>
            </div>
            <div class="cl-fix"></div>
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
import bus from '@/common/eventBus'
export default {
  name: 'pmain',
  data () {
    return {
      activeIndex: '0',
      userInfo: {},
      default_avatar: defaultAvatar,
      uploadAction: ''
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
        bus.$emit('userinfo')
      }
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    },
    async uploadSuccess (response) {
      console.log(response)
      if (response.retCode === 0) {
        let token = localStorage.getItem('token')
        let ret = await axios.post(window.API_URL + '/v2/user/info/save', {user_avatar: response.retData.static}, {params: {token: token}})
        if (ret.data.retCode === 0) {
          this.$alert('头像修改成功', '修改头像', {confirmButtonText: '确定'})
          this.getuserInfo()
          return
        }
        this.$alert('头像修改失败', '修改头像', {confirmButtonText: '确定'})
      }
    },
    uploadError (err) {
      console.log(err)
    }
  },
  components: {
    layoutHeader, layoutFooter
  },
  created () {
    this.getuserInfo()
    let token = localStorage.getItem('token')
    this.uploadAction = window.API_URL + '/v2/user/info/upload-avatar?token=' + token
  }
}
</script>

<style scoped src="@/assets/css/teacher/personal.css"></style>
<style>
  .el-upload{
    display: block !important;
  }
</style>
