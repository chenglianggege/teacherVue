<template>
  <el-container v-loading.fullscreen.body.lock="fullscreenLoading">
    <el-header height="80px" class="header">
      <layoutHeader :activeIndex="activeIndex"></layoutHeader>
    </el-header>
    <el-main  class="container"  v-if="fullscreenLoading"></el-main>
    <el-main  class="container"  v-if="!fullscreenLoading">
      <div class="c-body">
        <div class="homework-div">
          <!-- <div class="sel-level">
            <ul class="fl">
              <li @click="changeLevel(grade)" v-for="grade in allGrades.grades_info" :class="currentLevel == grade.id ? 'li-on' : ''" :key="grade.level">{{grade.level}}</li>
            </ul>
            <div class="cl-fix"></div>
          </div>
          <div class="sel-condition" style="display: block">
            <div class="sel-grade">
              <div class="sel-m-box">
                <span class="sel-title">地区:</span>
                <ul>
                  <li class="li-on">
                    {{userInfo.user_area ? userInfo.user_area.province_name + '-' + userInfo.user_area.city_name : '全部地区'}}
                  </li>
                </ul>
                <div class="cl-fix"></div>
              </div>
            </div>
          </div>-->
          <div class="sel-condition" style="display: block">
            <div class="sel-grade">
              <div class="sel-m-box">
                <span class="sel-title">年级:</span>
                <ul>
                  <li @click="currentGrade = grade.grade_id" v-for="grade in allGrades.grades_info[1]" :key="grade.grade_id" :class="{'li-on' :currentGrade==grade.grade_id}">
                    <span>{{grade.grade_name}}</span>
                  </li>
                </ul>
                <div class="cl-fix"></div>
              </div>
            </div>
            <div class="sel-module">
              <div class="sel-m-box">
                <span class="sel-title">模块:</span>
                <ul>

                  <li @click="currentModule=4" :class="{'li-on' :currentModule==4}">
                    <span>同步跟读</span>
                  </li>

                  <li @click="currentModule=3" :class="{'li-on' :currentModule==3}">
                    <span>听说专项</span>
                  </li>
                  <li @click="currentModule=2" :class="{'li-on' :currentModule==2}">
                  <span>模拟试卷</span>
                  </li>
                </ul>
                <div class="cl-fix"></div>
              </div>
            </div>
            <div class="sel-qstype" v-show="currentModule == 3">
              <div class="sel-m-box">
                <span class="sel-title">题型:</span>
                <ul>
                  <li @click="currentQsType = qsType.qs_type_id" v-for="qsType in qsTypes" :key="qsType.qs_type_id" :class="{'li-on' :qsType.qs_type_id == currentQsType}">
                    <span>{{qsType.qs_type_name}}</span>
                  </li>
                </ul>
                <div class="cl-fix"></div>
              </div>
            </div>
            <div class="sel-qstype" v-show="currentModule == 4">
              <div class="sel-m-box">
                <span class="sel-title">类型:</span>
                <ul>
                  <li @click="currentModule2 = 4"  :class="{'li-on' :currentModule2 == 4}">
                    <span>单词跟读</span>
                  </li>
                  <li @click="currentModule2 = 5"  :class="{'li-on' :currentModule2 == 5}">
                    <span>课文跟读</span>
                  </li>
                </ul>
                <div class="cl-fix"></div>
              </div>
            </div>
          </div>
          <div class="cl-fix"></div>
          <el-container class="unit-box">
            <el-aside width="400px"  v-loading.body.lock="loadingPaper" style="background-color: rgb(238, 241, 246)">
              <el-menu v-show="papersList && papersList.length" @open="getQuestion" style="margin-right: 2px">
                <el-submenu style="text-overflow: ellipsis;overflow: hidden;" v-for="paper in papersList" :key="paper.paper_id" :index="paper.paper_id" >
                  <template slot="title">
                    <el-button
                      v-show="currentModule !=4 && questionList.hasOwnProperty(paper.paper_id)"
                      type="primary"
                      size="mini"
                      @click="publishPaper(paper.paper_id)">
                      整卷布置
                    </el-button>
                    <i class="el-icon-document"></i><span>{{paper.paper_title}}</span>
                  </template>
                  <el-menu-item @click="questionDetail=question;paperTitle=paper.paper_title"   v-for="question in questionList[paper.paper_id]" :key="question.qs_id" :index="question.qs_id">
                    <i class="el-icon-d-arrow-right"></i>
                    <span>{{question.qs_title}}</span>
                  </el-menu-item>
                </el-submenu>
              </el-menu>
              <div style="text-align: center;line-height: 100px;margin: 0 auto;" v-show="!papersList || !papersList.length">暂无可选题目</div>
            </el-aside>
            <el-container>
              <el-header style="text-align: center;padding-top: 20px;font-size: 18px;text-overflow: ellipsis;overflow: hidden;width: 100%;white-space: nowrap;">
                <span>{{paperTitle ? paperTitle : '请在左侧选择题目预览'}}</span>
              </el-header>
              <el-main>
                <layoutPaper :paperDetail="[questionDetail]"></layoutPaper>
              </el-main>
            </el-container>
          </el-container>
        </div>
      </div>
    </el-main>
    <shoppingCart></shoppingCart>
    <el-footer height="100px" class="footer">
      <layout-footer></layout-footer>
    </el-footer>
  </el-container>
</template>

<script>
import layoutHeader from '@/components/common/layoutHeader'
import layoutFooter from '@/components/common/layoutFooter'
import shoppingCart from '@/components/common/shoppingCart'
import layoutPaper from '@/components/common/layoutPaper'
import axios from 'axios'
import bus from '@/common/eventBus'

export default {
  name: 'publishHomework',
  components: {
    layoutHeader, layoutFooter, shoppingCart, layoutPaper
  },
  methods: {
    async initHomework () {
      let token = localStorage.getItem('token')
      let pressID = localStorage.getItem('pressID')
      try {
        let grades = await axios.get(window.API_URL + '/v2/teacher/paper/grades', {params: {token: token, press_id: pressID}})
        if (grades.data.retCode === 0) {
          this.allGrades = grades.data.retData
          this.grades = this.allGrades.grades_info[0].grades
          for (let idx in this.allGrades.grades_info) {
            let grades = this.allGrades.grades_info[idx]
            if (grades.id === this.currentLevel) {
              this.grades = grades.grades
            }
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.fullscreenLoading = false
      }
      this.loadPaper()
    },
    async initQsTypes () {
      try {
        let token = localStorage.getItem('token')
        let qsTypes = await axios.get(window.API_URL + '/v2/teacher/paper/types', {params: {token: token, grade: this.currentGrade}})
        if (qsTypes.data.retCode === 0) {
          this.qsTypes = qsTypes.data.retData || []
          if (this.qsTypes.length > 0) {
            this.currentQsType = this.qsTypes[0].qs_type_id
            this.loadPaper()
          } else {
            this.papersList = []
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    async changeLevel (grades) {
      console.log(this.allGrades.grades_info[1])
      this.currentLevel = grades.id
      this.grades = grades.grades
      this.currentGrade = this.grades[0].grade_id
      await this.getBookPress()
      this.currentBookPress = 0
      if (this.bookPress && this.bookPress.length) {
        this.currentBookPress = this.bookPress[0].press_id
      }
    },
    async loadPaper () {
      if (this.fullscreenLoading) {
        return
      }
      let token = localStorage.getItem('token')
      this.fullscreenLoading = true
      this.paperDetail = null
      this.questionDetail = {}
      this.papersList = []
      this.paperTitle = ''
      try {
        let papersList = await axios.get(window.API_URL + '/v2/teacher/paper/query',
          {params: {token: token, grade: this.currentGrade, paper_type: this.currentModule !== 4 ? this.currentModule : this.currentModule2, qs_type: this.currentQsType}})
        if (papersList.data.retCode === 0) {
          this.papersList = papersList.data.retData
        } else {
          this.papersList = []
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.fullscreenLoading = false
      }
    },
    async getQuestion (paperId) {
      if (this.loadingPaper) {
        return
      }
      if (this.questionList.hasOwnProperty(paperId)) {
        return
      }
      let token = localStorage.getItem('token')
      this.loadingPaper = true
      try {
        let paperDetail = await axios.get(window.API_URL + '/v2/teacher/paper/detail',
          {params: {token: token, paper_id: paperId}})
        if (paperDetail.data.retCode === 0) {
          this.questionList[paperId] = paperDetail.data.retData
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingPaper = false
      }
    },
    async checkClass () {
      let token = localStorage.getItem('token')
      let teacherInfo = await axios.get(window.API_URL + '/v2/teacher/info', {params: {token: token}})
      if (teacherInfo.data.retCode === 0) {
        teacherInfo = teacherInfo.data.retData
        if (parseInt(teacherInfo.class_num) === 0) {
          let _this = this
          this.$alert('还未创建班级，请前往班级管理创建班级后再布置作业！', '提示', {confirmButtonText: '确定', showClose: false}).then(function () {
            _this.$router.push('/teacher/classList')
          })
        }
      }
    },
    async getBookPress () {
      let token = localStorage.getItem('token')
      let bookPress = await axios.get(window.API_URL + '/v2/teacher/paper/book-press', {params: {token: token, study_level: this.currentLevel}})
      if (bookPress.data.retCode === 0) {
        this.bookPress = bookPress.data.retData
      }
    },
    initCart () {
      let cart = JSON.parse(localStorage.getItem('cart'))
      this.cart = cart || {}
    },
    async publishPaper (paperId) {
      if (!this.questionList.hasOwnProperty(paperId)) {
        return
      }
      let qsList = this.questionList[paperId]
      let cart = JSON.parse(localStorage.getItem('cart'))
      cart = cart || {}
      for (let i in qsList) {
        let question = qsList[i]
        if (!cart.hasOwnProperty('qsId_' + question.qs_id)) {
          let qsIds = Object.keys(cart)
          if (qsIds.length >= 10) {
            this.$alert('已经10道题了，一份作业别让学生做太久~~', '提示')
            return
          }
          let duration = 0
          let qsScore = 0
          for (let i in question.info) {
            let info = question.info[i]
            duration += +info.duration
            for (let j in info.items) {
              qsScore += +info.items[j].item_score
            }
          }
          duration += +question.audio_duration
          duration += question.item_num * 1000
          cart['qsId_' + question.qs_id] = {qsId: question.qs_id, qsTitle: question.qs_title, duration: duration, qsScore: qsScore}
        }
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      this.cart = cart
      bus.$emit('cart')
    }
  },
  watch: {
    currentLevel () {
      localStorage.setItem('currentLevel', this.currentLevel)
    },
    currentBookPress () {
      localStorage.setItem('currentBookPress', this.currentBookPress)
      this.loadPaper()
    },
    currentGrade () {
      localStorage.setItem('currentGrade', this.currentGrade)
      if (this.currentModule === 3) {
        this.initQsTypes()
      } else {
        this.loadPaper()
      }
    },
    currentModule () {
      if (this.currentModule === 3) {
        this.initQsTypes()
      } else {
        this.loadPaper()
      }
    },
    currentModule2 () {
      this.loadPaper()
    },
    currentQsType () {
      this.loadPaper()
    },
    questionDetail () {
      let player = document.querySelector('#player')
      if (player) player.pause()
    }
  },
  data () {
    return {
      userInfo: {},
      activeIndex: '2',
      allGrades: {},
      grades: [],
      fullscreenLoading: true,
      currentLevel: '小学',
      currentGrade: '',
      currentModule: 4,
      currentQsType: 0,
      currentModule2: 4,
      qsTypes: [],
      loadingPaper: false,
      paperDetail: '',
      questionList: {},
      questionDetail: {},
      paperTitle: {},
      papersList: [],
      bookPress: [],
      currentBookPress: '',
      cart: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    let currentLevel = localStorage.getItem('currentLevel')
    if (currentLevel) {
      this.currentLevel = currentLevel
    }
    let currentBookPress = localStorage.getItem('currentBookPress')
    if (currentBookPress) {
      this.currentBookPress = currentBookPress
    }
    let currentGrade = localStorage.getItem('currentGrade')
    if (currentGrade) {
      this.currentGrade = currentGrade
    }
    this.initHomework()
    this.getBookPress()
    this.checkClass()
  },
  mounted () {
    let _this = this
    this.initCart()
    bus.$on('cart', function () {
      console.log('paper on cart')
      _this.initCart()
    })
  }
}
</script>

<style scoped>
  .homework-div {
    margin: 0 auto;
    width: 1040px;
    background: #fff;
  }
  .sel-level {
    min-height: 57px;
    line-height: 57px;
    border-bottom: 1px solid #dde6ef;
  }
  .sel-level ul {
    max-width: 785px;
  }
  .sel-level ul .li-on {
    border-bottom: 4px solid #3caaea;
  }
  .sel-level ul li {
    float: left;
    padding: 0 27px 0 27px;
    font-size: 16px;
    height: 57px;
    line-height: 57px;
    color: #555;
    cursor: pointer;
  }
  .sel-grade, .sel-module, .sel-qstype {
    width: 100%;
    background: #f9fbfd;
  }
  .sel-m-box {
    border-bottom: 1px solid #eff3f7;
  }
  .sel-c-box, .sel-m-box {
    margin: 0 27px 0 27px;
  }
  .sel-title {
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    float: left;
    margin-right: 18px;
  }
  .sel-grade ul, .sel-module ul, .sel-qstype ul {
    float: left;
    width: 890px;
  }
  .sel-grade ul li, .sel-module ul li, .sel-qstype ul li {
    float: left;
    margin-right: 56px;
    font-size: 14px;
    height: 46px;
    line-height: 46px;
    color: #606060;
    cursor: pointer;
    position: relative;
  }
  .sel-column ul .li-on, .sel-column ul li:hover, .sel-grade ul .li-on, .sel-grade ul li:hover, .sel-qstype ul .li-on, .sel-qstype ul li:hover, .sel-module ul .li-on, .sel-module ul li:hover {
    color: #3caaea;
  }

</style>
