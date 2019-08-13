<template>
  <el-container v-loading.fullscreen.body.lock="fullscreenLoading">
    <el-header height="80px" class="header">
      <layoutHeader :activeIndex="activeIndex"></layoutHeader>
    </el-header>
    <el-main  class="container"  v-if="fullscreenLoading"></el-main>
    <el-main  class="container"  v-if="!fullscreenLoading">
      <div class="homealertout" v-if="homealertType">
        <div class="homealert">
          <div class="homealert-top"><p>欢迎使用教师端微信小程序哦～</p></div>
          <div class="homealert-bottom">
            <div class="homealert-left">
              <p><em>方法一：</em>打开微信扫一扫</p><p>登录<span>英语说教师端</span>小程序</p>
              <img src="@/assets/images/homealert/fangfa1.jpg"/>
            </div>
            <div class="homealert-right">
              <p><em>方法二：</em>下拉微信首页在搜索小程序处</p><p>输入<span>"英语说教师端"</span></p>
              <img src="@/assets/images/homealert/fangfa2.jpg"/>
            </div>
          </div>
          <div class="homealert-close" @click="closeHomealert"></div>
        </div>
      </div>
      <div class="main">
        <div class="part1">
          <div class="teacher-info">
            <div class="avatar-info">
              <router-link :to="{ path: '/teacher/personal/main'}">
                <img class="avatar" :src="userInfo.user_avatar ? userInfo.user_avatar : default_avatar">
              </router-link>
              <div style="color: #242424;font-size: 16px;margin-top: 15px">{{userInfo.user_name}}</div>
              <div style="color: #737373;font-size: 14px;margin-top: 5px">{{userInfo.school_name}}</div>
            </div>
            <div class="class-info" v-if="classNum > 0">
              <div style="display: flex;display: -webkit-flex;justify-content: space-between">
                <div class="flex-center" style="height: 22px">
                  <img src="@/assets/images/banji.png" style="width: 18px;height: 18px;"/>
                  <span style="font-size: 12px;color: #333333;margin-left: 5px;line-height: 22px">我的班级</span>
                </div>
                <div style="color: #3c9aec;font-size: 12px"><router-link :to="{path: '/teacher/classList'}">所有班级></router-link></div>
              </div>
              <div class="class-list">
                <router-link :to="{ path: '/teacher/classList', query: { classId: classItem.class_id }}" v-for="(classItem, idx) in classList" :key="idx" v-if="idx < 2">
                <div class="class-item" >
                  <div class="text1">{{classItem.class_name}}</div>
                  <div class="text2">绑卡人数：<span style="color: #fe0000">{{classItem.activity_num}}</span>/{{classItem.student_num}}人</div>
                </div>
                </router-link>
              </div>
            </div>
            <div class="no-class" v-if="classNum <= 0">
              <div class="flex-center">
                <img src="@/assets/images/wubanji.png" style="width: 21px;height: 21px;"/>
                <span style="font-size: 14px;color: #333333;margin-left: 5px;line-height: 22px">我的班级</span>
              </div>
              <div style="color: #999999;font-size: 12px;margin-top: 15px">您还没有班级哦，快去创建吧</div>
              <el-button type="primary" class="btn-add-class" @click="dialogAddClassFormVisible = true">创建班级</el-button>
            </div>
          </div>
          <div class="btn-group">
            <div class="btn-part">
              <div class="text1">已创建班级</div>
              <div class="text2">{{teacherInfo.class_num}}</div>
              <router-link :to="{path: '/teacher/publishHomework'}"><el-button class="button1">布置作业</el-button></router-link>
            </div>
            <div class="btn-part mt20">
              <div class="text1">已布置作业</div>
              <div class="text2">{{teacherInfo.homework_num}}</div>
              <router-link :to="{path: '/teacher/checkHomework'}"><el-button class="button1">检查作业</el-button></router-link>
            </div>
          </div>
        </div>
        <div class="part2">
          <div class="check-homework-header">
            <div class="check-homework-title">最近作业</div>
          </div>
          <div class="homework-box-today-no-homework" v-show="homeworkTotal <=0">
            <div><img src="@/assets/images/wuzuoye.png" style="width: 229px;height: 136px;margin-bottom: 40px"/></div>
            <span>还未布置作业哦，快去<router-link :to="{path: '/teacher/publishHomework'}">布置作业</router-link></span>
          </div>
          <div class="homework-box" v-for="(list, index) in homeworkList" :key="index">
            <div class="homework-box-title" v-if="index != today || page > 1">
              <span class="icon-calendar"></span><span>{{index}}</span> (<span>{{list.weekday}}</span>)
            </div>
            <layoutHomework :list="list.homework" v-if="index != today || page > 1"></layoutHomework>
          </div>
        </div>
      </div>
    </el-main>
    <addClass :visible="dialogAddClassFormVisible" v-on:close="getClassList();dialogAddClassFormVisible = false"></addClass>
    <selectSchool :visible="dialogSelectSchoolVisible" v-on:close="getuserInfo();dialogSelectSchoolVisible= false"></selectSchool>
    <layout-footer></layout-footer>
  </el-container>
</template>

<script>
import layoutHeader from '@/components/common/layoutHeader'
import layoutFooter from '@/components/common/layoutFooter'
import axios from 'axios'
import defaultAvatar from '@/assets/images/tou.png'
import defaultStuAvatar from '@/assets/images/df_student.png'
import {formatDate} from '@/common/date.js'
import selectSchool from '@/components/common/selectSchool'
import addClass from '@/components/common/addClass'
import layoutHomework from '@/components/common/layoutHomework'
export default {
  name: 'index',
  components: {
    layoutHeader, layoutFooter, selectSchool, addClass, layoutHomework
  },
  data () {
    return {
      activeIndex: '1',
      fullscreenLoading: true,
      teacherInfo: {},
      userInfo: {},
      classList: [],
      homeworkList: [],
      default_avatar: defaultAvatar,
      default_stu_avatar: defaultStuAvatar,
      dialogAddClassFormVisible: false,
      PIC_STATIC: window.PIC_STATIC,
      dialogSelectSchoolVisible: false,
      homeworkTotal: 0,
      today: '',
      todayWeek: '',
      homealertType: false
    }
  },
  computed: {
    classNum () {
      return this.classList.length
    }
  },
  filters: {
    formatDate (time) {
      time += '000'
      return formatDate(new Date(parseInt(time)), 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    formatter_finish_num (row) {
      return row.finish_user_num + '/' + row.exam_user_num + '人'
    },
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
    formatter_average_score (row) {
      return row.average_score + '/' + row.paper_score + '分'
    },
    closeHomealert () {
      this.homealertType = false
      localStorage.setItem('homealertType', 1)
    },
    async getClassList () {
      let token = localStorage.getItem('token')
      let classList = await axios.get(window.API_URL + '/v2/teacher/sclass/list', {params: {token: token}})
      if (classList.data.retCode === 0) {
        this.classList = classList.data.retData ? classList.data.retData : []
      }
    }
  },
  async created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    let token = localStorage.getItem('token')
    let homealertType = localStorage.getItem('homealertType') || false
    if (!homealertType) {
      this.homealertType = 1
    }
    try {
      let teacherInfo = await axios.get(window.API_URL + '/v2/teacher/info', {params: {token: token}})
      localStorage.setItem('pressID', teacherInfo.data.retData.press_id)
      if (teacherInfo.data.retCode === 0) {
        this.teacherInfo = teacherInfo.data.retData
      }
      let homeworkList = await axios.get(window.API_URL + '/v2/teacher/homework/list', {params: {token: token, pagesize: 2, day: 1}})
      if (homeworkList.data.retCode === 0) {
        this.homeworkList = homeworkList.data.retData.list ? homeworkList.data.retData.list : []
        this.homeworkTotal = homeworkList.data.retData.total
      }
      this.getClassList()
    } catch (e) {
      console.log(e)
    } finally {
      this.fullscreenLoading = false
    }
  },
  mounted () {
    if (this.userInfo.hasOwnProperty('school_id') && !this.userInfo.school_id) {
      this.dialogSelectSchoolVisible = true
    }
  }
}
</script>

<style scoped>
  .container{
    width: 100%;
    display: flex;display: -webkit-flex;
    align-items: center;
    flex-direction: column;
  }
  .main{
    width: 1040px;
    background-color: #f1f6fb;
  }
  .part1{
    display: flex;display: -webkit-flex;
  }
  .part2{
    margin-top: 20px;
  }
  .teacher-info{
    background-color: #fff;
    width: 490px;
    height: 338px;
  }
  .btn-group{
    width: 490px;
    height: 338px;
    margin-left: 20px;
  }
  .btn-part{
    background: url(~@/assets/images/beijing.png) no-repeat center;
    width: 490px;
    height: 159px;
    display: -webkit-flex;display: flex;
    flex-direction: column;
    justify-content: center;align-items: center;
  }
  .homealertout{
    background-color: rgba(0,0,0,.5);
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
  }
  .homealert{
    background: url(~@/assets/images/homealert/bg.png) no-repeat center;
    width: 906px;
    height: 541px;
    position: absolute;
    left: 50%;
    margin-left: -453px;
    top: 15vh;
  }
  .homealert-close{
    width: 40px;
    height: 40px;
    background: url(~@/assets/images/homealert/guanbi.png) no-repeat center;
    position: absolute;
    top: 29px;
    right: 33.5px;
  }
  .homealert em{
    color: #333333;
    font-style: normal;
    font-size: 16px;
    float: left;
  }
  .homealert span{
    color: #409eff;
  }
  .homealert-top{
    font-size: 24px;
    color: #409eff;
    margin-top: 160px;
    text-align: center;
    overflow: hidden;
  }
  .homealert-bottom{
    padding-top: 40px;
    display: -webkit-flex;display: flex;
    justify-content: space-around;
  }
  .homealert-left,.homealert-right{
    background: url(~@/assets/images/homealert/bg2.png) no-repeat left top;
    width: 31%;height: 250px;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 1px;
    color: #999999;
  }
  .homealert-left{
    padding: 15px 10px 0 10px;
    margin-left: 20px;
  }
  .homealert-right{
    margin-left: 80px;
    padding: 15px 0 0 0;
  }
  .homealert-right p{
    padding-left: 14px;
  }
  .homealert-left img{
    width: 168px;
    margin: 18px 0 0 65px;
  }
  .homealert-right img{
    margin-top: 18px;
  }
  .homealert-left p:nth-of-type(2){
    text-indent: 68px;
  }
  .btn-part .text1{
    font-size: 14px;
    color: #fff;
  }
  .btn-part .text2{
    font-size: 40px;
    color: #fff;
  }
  .btn-part .button1{
    width: 106px;
    border-radius: 4px;
    color: #3c9aec;
    padding: 8px 20px;
  }
  .mt20{
    margin-top: 20px;
  }
  .avatar-info{
    display: flex;display: -webkit-flex;
    flex-direction: column;
    align-items: center;
  }
  .avatar {
    width: 88px;
    height: 88px;
    border-radius:88px;
    margin-top: 30px;
  }
  .flex-center{
    display: flex;display: -webkit-flex;
    justify-content: center;
  }
  .class-info{
    width: 407px;
    margin-left: 31px;
    margin-top: 30px;
  }
  .class-list{
    margin-top: 10px;
    display: -webkit-flex;display: flex;
    justify-content: center;
  }
  .no-class{
    margin-top: 40px;
    display: -webkit-flex;display: flex;
    align-items: center;
    flex-direction: column;
  }
  .class-item{
    width: 205px;
    height: 78px;
    background-color: #f1f8f9;
    border-radius: 4px;
    display: -webkit-flex;display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
  }
  .class-item .text1{
    color: #353535;
    font-size: 14px;
  }
  .class-item .text2{
    color: #999999;
    font-size: 12px;
    margin-top: 10px;
  }
  .homework-box {
    width: 1000px;
  }
  .check-homework-header {
    height: 28px;
    width: 1000px;
  }
  .homework-box-title {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    color: #757575;
  }
  .homework-box-today-no-homework {
    height: 322px;
    color: #bcbcbc;
    font-size: 14px;
    text-align: center;
    background: #fff;
    border-radius: 6px;
    display: flex;display: -webkit-flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    width: 1000px;
  }
  .toPublish {
    color: #2199de;
    cursor: pointer;
  }
  .homework-box-today-no-homework:hover {
    box-shadow: 0 4px 18px rgba(0,0,0,.1);
    -webkit-box-shadow: 0 4px 18px rgba(0,0,0,.1);
  }
  .icon-calendar {
    display: inline-block;
    position: relative;
    top: 3px;
    margin-right: 7px;
    width: 17px;
    height: 16px;
    background: url(~@/assets/images/sprite-check-homework.png) no-repeat -90px 0;
  }
  .btn-add-class{
    width: 86px;
    border-radius: 4px;
    padding: 8px 10px;
    margin-top: 20px;
  }
</style>
