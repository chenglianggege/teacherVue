<template>
    <el-row :gutter="0" class="navbar">
      <el-col :span="4">
        <router-link class="navbar-brand" :to="{ path: '/teacher/index'}">
        <img alt="logo" src="@/assets/images/yys.png">
        </router-link>
      </el-col>
      <el-col :span="13">
        <el-menu :default-active="activeIndex"  mode="horizontal">
          <router-link :to="{path:'/teacher/index'}"><el-menu-item class="header-tab" index="1">首页</el-menu-item></router-link>
          <router-link :to="{path:'/teacher/publishHomework'}"><el-menu-item class="header-tab" index="2">布置作业</el-menu-item></router-link>
          <router-link :to="{path:'/teacher/checkHomework'}"><el-menu-item class="header-tab" index="3">检查作业</el-menu-item></router-link>
          <router-link :to="{path:'/teacher/Analysis'}"><el-menu-item class="header-tab" index="6">学情分析</el-menu-item></router-link>
          <router-link :to="{path:'/teacher/classList'}"><el-menu-item class="header-tab" index="4">班级管理</el-menu-item></router-link>
          <router-link v-if="this.userInfo.user_area && this.userInfo.user_area.hasOwnProperty('area_id') && this.userInfo.hasOwnProperty('agent_id') && +this.userInfo.user_area.area_id === 5649 && +this.userInfo.agent_id === 13" :to="{path:'/download'}"><el-menu-item class="header-tab" index="5">真题下载</el-menu-item></router-link>
        </el-menu>
      </el-col>
      <el-col :span="6">
        <el-menu class="person-tab"  mode="horizontal">
          <el-submenu class="eqcode-tab" index="1">
            <template slot="title">
                <div style="display:inline;width: 150px ;overflow: hidden;text-overflow: ellipsis;white-space:nowrap;position:relative;">
                  <img class="ercode-new" src="@/assets/images/homealert/new.png"/>
                  <img class="ercode-ercodemark" src="@/assets/images/homealert/xiaochengxu.png"/>
                  小程序
                </div>
              </template>
            <el-menu-item index="1-1" style="height:200px;">
              <div style="overflow:hidden;font-size:14px;text-align:center;">
                <img class="hadeqrcode" src="@/assets/images/homealert/fangfa1.jpg"/>
                <p style="color:#333;">微信扫一扫，使用小程序</p>
              </div>
            </el-menu-item>
          </el-submenu>
          <el-submenu :show-timeout="0" :hide-timeout="0" index="10">
            <template slot="title">
              <div>
                <img class="avatar" :src="userInfo.user_avatar ? userInfo.user_avatar : default_avatar">
                <span>{{userInfo.user_name}}</span>
              </div>
            </template>
            <router-link to="/teacher/personal/main"><el-menu-item index="2-1">个人中心</el-menu-item></router-link>
            <el-menu-item index="2-2" @click="loginOut">退出登录</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
</template>

<script>
import defaultAvatar from '@/assets/images/tou.png'
import bus from '@/common/eventBus'
export default {
  name: 'layoutHeader',
  props: {
    activeIndex: {
      type: String,
      required: true
    }
  },
  methods: {
    loginOut () {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      return this.$router.push('/')
    }
  },
  data () {
    return {
      userInfo: {},
      default_avatar: defaultAvatar
    }
  },
  mounted () {
    let _this = this
    bus.$on('userinfo', function () {
      _this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    })
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
  }
}
</script>

<style scoped>
  .el-menu-item.is-active{
    color: #409EFF !important;
    border-bottom: none !important;
  }
  .el-submenu.is-active .el-submenu__title {
    border-bottom: none !important;
  }
  .el-menu-item:hover{
    color: #409EFF !important;
    background-color: #fff !important;
  }
  .el-menu {
    border-bottom: none !important;
  }
  .el-menu-item{
    font-size: 16px !important;
    color: #404040 !important;
  }

  .navbar{
    width: 1040px;
    margin: auto !important;
    background: #fff;
    margin-top: 20px;
  }
  .header-tab{
    float: left;
    height: 60px;
    margin-top: 10px;
    position: relative;
    font-size: 16px;
  }
  .eqcode-tab{
    float: left;
    height: 60px;
    position: relative;
  }
  .person-tab{
    float: right;
    height: 60px;
    line-height: 40px;
    margin-top: 10px;
    position: relative;
    font-size: 16px;
  }
  .header .navbar-brand img{
    height: 45px;
    margin-top: 15px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius:40px;
  }
  .hadeqrcode{
    display: block;
    margin: 0 auto;
  }
  .ercode-new{
    position: absolute;
    top: -15px;right: -19px;
  }
  .ercode-ercodemark{
    position: absolute;
    top: -2px;left: -24px;
  }
</style>
