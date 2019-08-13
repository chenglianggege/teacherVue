<template>
  <el-container v-loading.fullscreen.body.lock="fullscreenLoading">
    <el-header height="80px" class="header">
      <layoutHeader :activeIndex="activeIndex"></layoutHeader>
    </el-header>
    <el-main  class="container"  v-if="fullscreenLoading"></el-main>
    <el-main  class="container"  v-if="!fullscreenLoading">
      <div class="no-class" v-show="classList.length === 0">
        <div>
          <img src="@/assets/images/wubanjichatu.png" style="width: 229px;height: 136px;margin-bottom: 40px"/>
        </div>
        <div>您还没有班级哦，赶快去创建班级吧！</div>
        <div>
          <router-link :to="{path:'/teacher/classList'}">
            <el-button type="primary" class="btn-create-class">班级管理</el-button>
          </router-link>
        </div>
      </div>
      <div class="class-content">
        <el-tabs  v-model="activeClass" type="card" @tab-click="activeClassChange" >
          <el-tab-pane :lazy="true" :label="classItem.class_name" :name="classItem.class_id + ''" v-for="(classItem, idx) in classList" :key="idx">
            <div class="no-class" v-if="+classItem.homework_info.count === 0">
              <div>
                <img src="@/assets/images/wushujuchatu.png" style="width: 229px;height: 136px;margin-bottom: 40px"/>
              </div>
              <div>本班学生完成作业后，才会有数据哦~</div>
            </div>
            <div class="class-content" v-if="+classItem.homework_info.count > 0">
              <h3 class="st-group-title">班级整体<span style="font-size: 16px;margin-left: 20px">已完成作业总次数：{{classItem.homework_info.count}}</span></h3>
              <div class="complete-info">
                <div class="rate-info">班平均作业完成度：{{(classItem.homework_info.complete_rate * 100).toFixed(2)}}%</div>
                <el-tooltip placement="top">
                <i class="iconfont icon-question"></i>
                <div slot="content">
                  <p>【作业完成】</p>
                  <p>学生在规定时间内完成作业</p>
                  <p>【单份作业的完成度】</p>
                  <p>指的是完成人数占总人数比</p>
                  <p>例如：给50人布置，49人按时完成，则完成度为98.00%</p>
                  <p>【班平均作业完成度】</p>
                  <p>指的是所有“单份作业完成度”的平均值（不含已删除的作业）</p>
                </div>
                </el-tooltip>
                <el-radio-group v-model="completeTimeRange" @change="completeTimeRangeChange" class="time-range-group">
                  <el-radio-button label="-30 days">近30天</el-radio-button>
                  <el-radio-button label="-60 days">近60天</el-radio-button>
                  <el-radio-button label="-90 days">近90天</el-radio-button>
                  <el-radio-button label="-180 days">近半年</el-radio-button>
                  <el-radio-button label="-1 year">近1年</el-radio-button>
                </el-radio-group>
                <el-date-picker
                  v-model="completeTimeRange"
                  type="daterange"
                  style="margin-left: 20px"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="completeTimeRangeChange"
                 />
              </div>
              <div v-if="completeData.xAxis.data.length">
                <chart class="charts-line" :options="completeData" :init-options="initOptions" auto-resize/>
              </div>
              <div class="no-class" style="height: 350px" v-else>
                <div>
                  <img src="@/assets/images/wushujuchatu.png" style="width: 229px;height: 136px;margin-bottom: 10px"/>
                </div>
                <div>本时段内没有作业，请选择其他时间段</div>
              </div>

              <div class="complete-info">
                <div class="rate-info">班平均答题得分率：{{(classItem.homework_info.score_rate * 100).toFixed(2)}}%</div>
                <el-tooltip placement="top">
                  <i class="iconfont icon-question"></i>
                  <div slot="content">
                    <p>【单个学生单份作业答题得分率】</p>
                    <p>指一份作业里学生所做的题的得分与所做题的满分之间的比值</p>
                    <p>【单份作业答题得分率】</p>
                    <p>一份作业，所有学生得分率的平均值</p>
                    <p>【班平均答题得分率】</p>
                    <p>所有“单份作业答题得分率”的平均值</p>
                  </div>
                </el-tooltip>
                <el-radio-group v-model="scoreTimeRange" @change="scoreTimeRangeChange" class="time-range-group">
                  <el-radio-button label="-30 days">近30天</el-radio-button>
                  <el-radio-button label="-60 days">近60天</el-radio-button>
                  <el-radio-button label="-90 days">近90天</el-radio-button>
                  <el-radio-button label="-180 days">近半年</el-radio-button>
                  <el-radio-button label="-1 year">近1年</el-radio-button>
                </el-radio-group>
                <el-date-picker
                  v-model="scoreTimeRange"
                  type="daterange"
                  style="margin-left: 20px"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="scoreTimeRangeChange"
                />
              </div>
              <div v-if="scoreData.xAxis.data.length">
                <chart class="charts-line" :options="scoreData" :init-options="initOptions" auto-resize/>
              </div>
              <div class="no-class" style="height: 350px" v-else>
                <div>
                  <img src="@/assets/images/wushujuchatu.png" style="width: 229px;height: 136px;margin-bottom: 10px"/>
                </div>
                <div>本时段内没有作业，请选择其他时间段</div>
              </div>

              <h3 class="st-group-title">学生详情</h3>
              <el-table v-loading="loading" stripe size="medium" :data="studentList" style="width: 100%;" :row-style="{cursor: 'pointer'}"  ref="studentTable" @row-click="studentRowClick">
                <el-table-column prop="student_name" sortable  align="center" label="备注姓名"></el-table-column>
                <el-table-column label="头像" align="center" width="100" class-name="no-padding" class="no-padding">
                  <template slot-scope="scope">
                    <img class="header-img" :src="scope.row.user_avatar ? PIC_STATIC + scope.row.user_avatar + '?x-oss-process=image/resize,h_100' : default_stu_avatar"/>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="complete_rate" align="center" :sort-method="sortFieldFinish" label="作业完成度%">
                  <template slot-scope="scope">
                    {{(+scope.row.complete_rate).toFixed(0)}}
                  </template>
                </el-table-column>
                <el-table-column sortable prop="score_rate" align="center" :sort-method="sortFieldScore" label="平均作答得分率%（点击查看详情）">
                  <template slot-scope="scope" styly="position:relative;">
                    <div class="transparent"></div>
                    {{(+scope.row.score_rate).toFixed(0)}}
                  </template>
                </el-table-column>
                <el-table-column align="center" type="expand">
                <template slot-scope="props" class="no-padding">
                  <chart class="student-line" :options="studentScore[props.row.student_id].list" :init-options="initOptions" auto-resize/>
                </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

    </el-main>
    <el-footer height="100px" class="footer">
      <layout-footer></layout-footer>
    </el-footer>
  </el-container>
</template>

<script>
import layoutHeader from '@/components/common/layoutHeader'
import layoutFooter from '@/components/common/layoutFooter'
import defaultStuAvatar from '@/assets/images/df_student.png'
import axios from 'axios'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'

export default {
  name: 'Analysis',
  components: {
    layoutHeader, layoutFooter, chart: ECharts
  },
  methods: {
    async initClassList (classId) {
      let token = localStorage.getItem('token')
      let pressID = localStorage.getItem('pressID')
      try {
        this.fullscreenLoading = true
        let classList = await axios.get(window.API_URL + '/v2/teacher/sclass/list', {params: {token: token}})
        if (classList.data.retCode === 0) {
          this.classList = classList.data.retData ? classList.data.retData : []
          if (this.classList.length) {
            this.activeClass = classId > 0 ? classId : this.classList[0].class_id
            this.getClassFinish()
            this.getClassScore()
            this.getClassDetail()
          } else {
            this.fullscreenLoading = false
          }
        }
        let grades = await axios.get(window.API_URL + '/v2/teacher/paper/grades', {params: {token: token, press_id: pressID}})
        if (grades.data.retCode === 0) {
          this.grades = grades.data.retData
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.fullscreenLoading = false
      }
    },
    activeClassChange () {
      this.getClassFinish()
      this.getClassScore()
      this.getClassDetail()
    },
    completeTimeRangeChange () {
      this.getClassFinish()
    },
    scoreTimeRangeChange () {
      this.getClassScore()
    },
    studentRowClick (row, column, event) {
      console.log(row, column, event)
      let studentId = row.student_id
      let classId = this.activeClass
      let idx = this.tabIdx.findIndex((n) => +n === +classId)
      if (idx === -1) {
        return
      }
      if (this.studentScore[studentId].show) {
        this.studentScore[studentId].show = false
        this.$refs.studentTable[idx].toggleRowExpansion(row)
      } else {
        this.getStudentScore(row)
      }
    },
    async getClassFinish () {
      let start = this.completeTimeRange
      let end = 'now'
      if (typeof (this.completeTimeRange) === 'object') {
        start = this.completeTimeRange[0]
        end = this.completeTimeRange[1]
      }
      let token = localStorage.getItem('token')
      try {
        let classDetail = await axios.get(window.API_URL + '/v2/teacher/sclass/analysis/finish', {params: {token: token, class_id: this.activeClass, start: start, end: end}})
        if (classDetail.data.retCode === 0) {
          let retData = classDetail.data.retData ? classDetail.data.retData : []
          let seriesData = []
          let xAxis = []
          for (let i in retData) {
            seriesData.push(retData[i].finish_rate)
            xAxis.push(+i + 1)
            // seriesData.push(retData[i].finish_rate)
          }
          this.completeData.series[0].data = seriesData
          this.completeData.xAxis.data = xAxis
        }
      } catch (e) {
        console.log(e)
      } finally {
      }
    },
    async getClassScore () {
      let start = this.scoreTimeRange
      let end = 'now'
      if (typeof (this.scoreTimeRange) === 'object') {
        start = this.scoreTimeRange[0]
        end = this.scoreTimeRange[1]
      }
      let token = localStorage.getItem('token')
      try {
        let classDetail = await axios.get(window.API_URL + '/v2/teacher/sclass/analysis/score', {params: {token: token, class_id: this.activeClass, start: start, end: end}})
        if (classDetail.data.retCode === 0) {
          let retData = classDetail.data.retData ? classDetail.data.retData : []
          let seriesData = []
          let xAxis = []
          for (let i in retData) {
            seriesData.push(retData[i].rate_score)
            xAxis.push(+i + 1)
            // seriesData.push(retData[i].finish_rate)
          }
          this.scoreData.series[0].data = seriesData
          this.scoreData.xAxis.data = xAxis
        }
      } catch (e) {
        console.log(e)
      } finally {
      }
    },
    async getClassDetail () {
      this.loading = true
      let token = localStorage.getItem('token')
      try {
        let classDetail = await axios.get(window.API_URL + '/v2/teacher/sclass/detail', {params: {token: token, class_id: this.activeClass}})
        if (classDetail.data.retCode === 0) {
          let studentList = classDetail.data.retData.students ? classDetail.data.retData.students : []
          let studentScore = []
          for (let i in studentList) {
            studentScore[studentList[i].student_id] = {show: false, list: []}
          }
          if (studentList.length > 0) {
            let classId = this.activeClass
            let idx = this.tabIdx.findIndex((n) => +n === +classId)
            if (idx === -1) {
              this.tabIdx.push(classId)
            }
          }
          this.studentList = studentList
          this.studentScore = studentScore
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async getStudentScore (row) {
      this.loading = true
      let classId = this.activeClass
      let idx = this.tabIdx.findIndex((n) => +n === +classId)
      if (idx === -1) {
        return
      }
      let token = localStorage.getItem('token')
      let studentId = row.student_id
      try {
        let studentScore = await axios.get(window.API_URL + '/v2/teacher/sclass/analysis/student-score', {params: {token: token, class_id: this.activeClass, student_id: studentId}})
        if (studentScore.data.retCode === 0) {
          studentScore = studentScore.data.retData ? studentScore.data.retData : []
          let seriesData = []
          let xAxis = []
          for (let i in studentScore) {
            seriesData.push(studentScore[i].ratio_score)
            xAxis.push(+i + 1)
            // seriesData.push(retData[i].finish_rate)
          }
          let list = {
            tooltip: {trigger: 'axis', formatter: '{c0}%'},
            grid: {left: '3%', right: '4%', bottom: '3%', top: 20, containLabel: true},
            color: ['#58aff6'],
            xAxis: {type: 'category', boundaryGap: false, axisTick: {alignWithLabel: true}, data: xAxis},
            yAxis: [{type: 'value'}],
            series: [{name: '完成度', type: 'line', data: seriesData}]
          }
          this.studentScore[studentId] = {show: true, list: list}
          this.$refs.studentTable[idx].toggleRowExpansion(row)
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    sortFieldFinish (a, b) {
      return a.complete_rate - b.complete_rate
    },
    sortFieldScore (a, b) {
      return a.score_rate - b.score_rate
    }
  },
  data () {
    return {
      activeIndex: '6',
      fullscreenLoading: true,
      loading: true,
      classList: [],
      default_stu_avatar: defaultStuAvatar,
      PIC_STATIC: window.PIC_STATIC,
      activeClass: '0',
      classDetail: {},
      studentScore: [],
      completeTimeRange: '-30 days',
      scoreTimeRange: '-30 days',
      completeData: {
        tooltip: {trigger: 'axis', formatter: '{c0}%'},
        grid: {left: '3%', right: '4%', bottom: '3%', top: 20, containLabel: true},
        color: ['#58aff6'],
        xAxis: {type: 'category', boundaryGap: false, data: []},
        yAxis: [{type: 'value'}],
        series: [{name: '完成度', type: 'line', data: []}
        ]
      },
      scoreData: {
        tooltip: {trigger: 'axis', formatter: '{c0}%'},
        grid: {left: '3%', right: '4%', bottom: '3%', top: 20, containLabel: true},
        color: ['#58aff6'],
        xAxis: {type: 'category', boundaryGap: false, data: []},
        yAxis: [{type: 'value'}],
        series: [
          {name: '完成度', type: 'line', data: []}
        ]
      },
      studentList: [],
      initOptions: {
        renderer: 'canvas'
      },
      tabIdx: []
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    let classId = this.$route.query.hasOwnProperty('classId') ? this.$route.query.classId : '0'
    this.initClassList(classId)
  }
}
</script>
<style>
  .transparent{
    width: 50px;
    height: 50px;
    position: absolute;
    right: -50px;
    top: 0;
    z-index: 8000;
  }
  .time-range-group .el-radio-button__inner{
    padding: 12px 10px !important;
  }
  .no-padding{
    padding: 0 0 !important;
  }
  .el-table__expanded-cell{
    padding: 5px 0 !important;
  }
</style>
<style scoped>
  .container{
    display: -webkit-flex;display: flex;
    align-items: center;
    flex-direction: column;
  }
  .no-class{
    height: 500px;
    width: 1040px;
    background-color: #ffffff;
    display: -webkit-flex;display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
  .class-content{
    width: 1040px;
    background-color: #ffffff;
    margin-top: 10px;
    margin-bottom: 10px;
    position:relative;
  }
  .btn-create-class{
    margin-top: 10px;
  }
  .class-content{
    margin: 10px;
  }
  .complete-info{
    display: -webkit-flex;display: flex;
  }
  .rate-info{
    background-color: #409eff;
    color: #ffffff;
    height: 40px;
    line-height: 40px;
    width: 250px;
    text-align: center;
  }
  .icon-question{
    font-size: 22px;
    color: #409eff;
    margin-left: 10px;
    line-height: 40px;
  }
  .time-range-group{
    margin-left: 20px;
  }
  .charts-line {
    width: 1000px;
    height: 350px;
  }
  .student-line{
    width: 1000px;
    height: 150px;
  }
  .header-img {
    height: 40px;
    width: 40px;
    border-radius: 40px;
    position: relative;
    margin-top: 8px;
  }
</style>
