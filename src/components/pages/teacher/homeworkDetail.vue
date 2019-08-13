<template>
  <el-container v-loading.fullscreen.body.lock="fullscreenLoading">
    <el-header height="80px" class="header">
      <layoutHeader :activeIndex="activeIndex"></layoutHeader>
    </el-header>
    <el-main  class="container"  v-if="fullscreenLoading"></el-main>
    <el-main  class="container"  v-if="!fullscreenLoading">
      <div class="c-body" style="display: block;">
        <div class="mark-top">
          <div class="fl test-infor">
            <p class="test-name mb19 clear">
              <router-link class="a-for-check a-for-back fl" :to="{path: '/teacher/checkHomework'}">检查作业</router-link>
              <span class="icon-for-back fl t7"></span>
              <span class="mr20 homework-name-class fl">{{homeworkDetail.exam_title}}（{{homeworkDetail.class_name}}）</span>
              <span class="hbct-status fl hbct-status-ing" v-if="homeworkDetail.status == 100">未发布</span>
              <span class="hbct-status fl hbct-status-ing" v-if="homeworkDetail.status == 101">进行中</span>
              <span class="hbct-status fl hbct-status-end" v-if="homeworkDetail.status == 200">已结束</span>
              <span class="hbct-status fl hbct-status-end" v-if="homeworkDetail.status == -1">已删除</span>
            </p>
            <div class="test-detail">
              <p>
                <span class="box-icon"><span class="icon-clock"></span></span>
                <span class="start-time-val">{{homeworkDetail.publish_time | formatDate}}</span> - <span class="end-time-val">{{homeworkDetail.finish_time | formatDate}}</span>
              </p>
              <p>
                <span class="">
                  <span class="box-icon"><span class="icon-cookie"></span></span>完成度：<span>{{(homeworkDetail.finish_user_num / homeworkDetail.exam_user_num * 100).toFixed(0)}}</span>%
                </span>
                <span class="ml25">
                  <span class="box-icon"><span class="icon-build"></span></span>得分率：<span>{{(homeworkDetail.rate_score * 100).toFixed(0)}}</span>%
                </span>
              </p>
              <p v-show="homeworkDetail.exam_des">
                <span class="box-icon"><span class="icon-note"></span></span>
                <span>{{homeworkDetail.exam_des}}</span>
              </p>
            </div>
          </div>
          <div class="fr test-btn-box">
            <div class="ab-btn-div">
              <span class="del-homework-btn fr" @click="delHomework"><span class="iconfont icon-del red"></span>删除作业</span>
              <span class="alert-homework-btn fr" @click="dialogEditHomeworkFormVisible = true" ><span class="icon-set"></span>修改作业</span>
              <el-dialog title="修改作业" width="35%" :visible.sync="dialogEditHomeworkFormVisible">
                <el-form :model="editHomeworkForm" label-width="100px">
                  <el-form-item label="作业名称">
                    <el-input v-model="editHomeworkForm.exam_title" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="开始时间" >
                    <el-input auto-complete="off" :value="homeworkDetail.publish_time | formatDate" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="截止时间" >
                    <el-date-picker v-model="editHomeworkForm.finish_time" type="datetime"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="作业备注" >
                    <el-input v-model="editHomeworkForm.exam_des" type="textarea" :rows="3" auto-complete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogEditHomeworkFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="saveHomework">确 定</el-button>
                </div>
              </el-dialog>
            </div>
            <el-button @click="exportHomework" type="primary" size="small" style="width: 100px" class="lead-win-btn cc-btn">导出成绩</el-button>
            <el-dialog :visible.sync="dialogVisible" width="30%">
              <span style="display: flex;align-items: center;    justify-content: center;font-size: 18px;" v-show="!exportUrl" >正在努力的为您生成成绩报表...<i class="el-icon-loading"></i></span>
              <span style="display: flex;align-items: center;    justify-content: center;font-size: 18px;" v-show="exportUrl" ><i style="color: green" class="el-icon-success"></i>生成成绩报表完成，请点击下面按钮下载</span>
              <span slot="title" style="display: flex;align-items: center;    justify-content: center;font-size: 18px;">
                导出成绩
              </span>
              <span slot="footer" style="display: flex;align-items: center;    justify-content: center;font-size: 18px;">
                <a :href="exportUrl"><el-button v-show="exportUrl"  type="primary" size="small" style="width: 100px" class="lead-win-btn cc-btn">点击下载</el-button></a>
              </span>
            </el-dialog>
          </div>
          <div class="cl-fix"></div>
        </div>
        <div class="mark-body">
          <div class="mark-sel">
            <ul>
              <li><a @click="currentModule = 'main'" :class="{'a-on': currentModule=='main'}" href="javascript:;">整体情况</a></li>
              <li><a @click="currentModule = 'student'" :class="{'a-on': currentModule=='student'}">学生成绩</a></li>
              <li><a @click="currentModule = 'paper'" :class="{'a-on': currentModule=='paper'}">内容讲评</a></li>
            </ul>
          </div>
          <div v-show="currentModule=='main'">
            <div class="st-group-b clear">
              <div class="st-flex-item">
                <div class="st-flex-info info-finish c-blue">
                  <span>{{homeworkDetail.finish_user_num}}</span>/<span class="all-num">{{homeworkDetail.exam_user_num}}</span>
                </div>
                <p class="st-flex-title">完成人数</p>
              </div>
              <div class="st-flex-item">
                <div class="st-flex-info info-average c-orange">
                  <span>{{(+homeworkDetail.average_score).toFixed(1)}}</span>/<span class="all-num">{{homeworkSummary.paper_score}}</span>
                </div>
                <p class="st-flex-title">平均分</p>
              </div>
            </div>
            <div class="st-group">
              <h3 class="st-group-title">题目得分情况（统计范围：已完成作业的学生）</h3>
              <div class="task-info">
                <span class="c-lv c-l level-s">优</span>
                <span class="c-blue c-y level-s">良</span>
                <span class="c-orange c-z level-s">中</span>
                <span class="c-red c-c level-s">差</span>
                <el-popover placement="top" title="得分率" width="200" trigger="hover" >
                  <div>
                    <p>
                      <span class="c-lv c-l level-s">优: 90% ~ 100%</span>
                      <span class="c-blue c-y level-s">良: 80% ~ 90%</span>
                      <span class="c-orange c-z level-s">中: 60% ~ 80%</span>
                      <span class="c-red c-c level-s">差: 0% ~ 60%</span>
                    </p>
                  </div>
                  <i class="el-icon-question" slot="reference" style="font-size: 18px"></i>
                </el-popover>
              </div>
              <div class="st-group-b">
                <div>
                  <div class="st-group-table">
                    <table cellspacing="0" id="tb-score" class="full-tb">
                      <thead>
                      <tr>
                        <td class="questions">题目名称</td>
                        <td class="full-score">满分值</td>
                        <td class="ave-score">平均分</td>
                        <td class="rate-score">得分率</td>
                        <td class="h-score">最高分</td>
                        <td class="l-score">最低分</td>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="question in homeworkSummary.paper_nav" :key="question.qs_id">
                        <td class="questions" style="text-overflow:ellipsis;white-space: nowrap;overflow: hidden;text-align: left"><span>{{question.title}}</span></td>
                        <td class="full-score">{{(+question.score).toFixed(1)}}</td>
                        <td v-if="question.average_score/question.score * 100 < 60" class="ave-score c-red">{{(+question.average_score).toFixed(1)}}</td>
                        <td v-if="question.average_score/question.score * 100 >= 60 && question.average_score/question.score * 100 < 80" class="ave-score c-orange">{{(+question.average_score).toFixed(1)}}</td>
                        <td v-if="question.average_score/question.score * 100 >= 80 && question.average_score/question.score * 100 < 90" class="ave-score c-blue">{{(+question.average_score).toFixed(1)}}</td>
                        <td v-if="question.average_score/question.score * 100 >= 90" class="ave-score c-lv">{{(+question.average_score).toFixed(1)}}</td>
                        <td class="rate-score">{{(question.rate_score*100).toFixed(2)}}%</td>
                        <td class="h-score">{{+question.max_score}}</td>
                        <td class="l-score">{{+question.min_score}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="st-group">
              <h3 class="st-group-title">学生得分分布情况（统计范围：已完成作业的学生）</h3>
              <div class="st-group-b clear">
                <div class="fl">
                  <div class="st-group-table">
                    <table cellspacing="0" id="tb-percent">
                      <thead>
                      <tr>
                        <td class="per-fsd">分数段</td>
                        <td class="per-count">人数</td>
                        <td class="per-percent">百分比</td>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(finish_count,index) in homeworkSummary.homework_info.distribution" :key="index">
                        <td class="per-fsd">{{index}}</td>
                        <td class="per-count">{{finish_count}}</td>
                        <td class="per-percent">{{(finish_count/homeworkSummary.homework_info.total_count*100).toFixed(0)}}%</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="fr">
                    <chart class="charts-con" :options="distribution" :init-options="initOptions" ref="distribution" auto-resize/>
                </div>
              </div>
            </div>
          </div>
          <div v-show="currentModule=='student'">
            <div class="st-group">
              <h3 class="st-group-title">学生得分详情（数据显示范围：所有学生，含未完成）</h3>
              <div class="task-info">
                <span class="c-lv c-l level-s">优</span>
                <span class="c-blue c-y level-s">良</span>
                <span class="c-orange c-z level-s">中</span>
                <span class="c-red c-c level-s">差</span>
                <el-popover placement="top" title="得分率" width="200" trigger="hover" >
                  <div>
                    <p>
                      <span class="c-lv c-l level-s">优: 90% ~ 100%</span>
                      <span class="c-blue c-y level-s">良: 80% ~ 90%</span>
                      <span class="c-orange c-z level-s">中: 60% ~ 80%</span>
                      <span class="c-red c-c level-s">差: 0% ~ 60%</span>
                    </p>
                  </div>
                  <i class="el-icon-question" slot="reference" style="font-size: 18px"></i>
                </el-popover>
              </div>
              <div class="st-group-b">
                <el-table :data="StudentList" stripe :header-cell-style="tableHeaderCss" :cell-style="{'text-align': 'center'}">
                  <el-table-column label="排名">
                    <template slot-scope="scope">
                      {{homeworkDetail.status == 200 ? scope.$index+1 : '-'}}
                    </template>
                  </el-table-column>
                  <el-table-column label="照片">
                    <template slot-scope="scope">
                      <img class="cover-img" alt="" :src="scope.row.user_avatar ? PIC_STATIC + scope.row.user_avatar : default_stu_avatar">
                    </template>
                  </el-table-column>
                  <el-table-column prop="student_name" label="姓名"></el-table-column>
                  <el-table-column prop="student_no" label="学号"></el-table-column>
                  <el-table-column label="进度">
                    <template slot-scope="scope">
                      {{(scope.row.exam_process*100).toFixed(0)}}%
                    </template>
                  </el-table-column>
                  <el-table-column  label="得分">
                    <template slot-scope="scope">
                      <span v-if="scope.row.score/scope.row.paper_score * 100 < 60" class="c-red">{{scope.row.score}}</span>
                      <span v-if="scope.row.score/scope.row.paper_score * 100 >= 60 && scope.row.score/scope.row.paper_score * 100 < 80" class="c-orange">{{scope.row.score}}</span>
                      <span v-if="scope.row.score/scope.row.paper_score * 100 >= 80 && scope.row.score/scope.row.paper_score * 100 < 90" class="c-blue">{{scope.row.score}}</span>
                      <span v-if="scope.row.score/scope.row.paper_score * 100 >= 90" class="c-lv">{{scope.row.score}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column v-for="(score_info,index) in moreCol" :key="index" :label="score_info.title" >
                    <template slot-scope="scope">
                      {{scope.row.score_info[index].score_overall}}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div v-show="currentModule=='paper'">
            <layoutPaper :showBtn="false" :paperDetail="paperDetail"></layoutPaper>
          </div>
        </div>
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
import axios from 'axios'
import {formatDate} from '@/common/date.js'
// import ECharts from 'vue-echarts/components/ECharts.vue'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import defaultStuAvatar from '@/assets/images/df_student.png'
import layoutPaper from '@/components/common/layoutPaper'
export default {
  name: 'homeworkDetail',
  components: {
    layoutHeader, layoutFooter, chart: ECharts, layoutPaper
  },
  watch: {
    currentModule () {
      if (this.currentModule === 'main') {
        this.$parent.logTrack()
        this.initHomework()
      }
      if (this.currentModule === 'student') {
        this.$parent.logTrack(this.currentModule)
        this.initStudent()
      }
      if (this.currentModule === 'paper') {
        this.$parent.logTrack(this.currentModule)
        this.initPaper()
      }
    },
    dialogEditHomeworkFormVisible () {
      if (this.dialogEditHomeworkFormVisible) {
        this.editHomeworkForm = {
          finish_time: new Date(parseInt(this.homeworkDetail.finish_time + '000')),
          exam_title: this.homeworkDetail.exam_title,
          exam_des: this.homeworkDetail.exam_des,
          exam_id: this.homeworkDetail.exam_id
        }
      }
    }
  },
  data () {
    return {
      fullscreenLoading: true,
      activeIndex: '3',
      homeworkDetail: null,
      homeworkSummary: null,
      paperDetail: null,
      currentModule: 'main',
      StudentList: null,
      exportUrl: '',
      dialogVisible: false,
      getDownUrl: false,
      PIC_STATIC: window.PIC_STATIC,
      distribution: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {type: 'shadow'}
        },
        color: ['#58aff6'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '1%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['0~20%', '20%~40%', '40~60%', '60~80%', '80~100%'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '人数',
            type: 'bar',
            data: []
          }
        ]
      },
      initOptions: {
        renderer: 'canvas'
      },
      default_stu_avatar: defaultStuAvatar,
      moreCol: [],
      tableHeaderCss: {
        background: '#f3f6fa',
        height: '36px',
        padding: '0',
        'text-align': 'center'
      },
      dialogEditHomeworkFormVisible: false,
      editHomeworkForm: {
        finish_time: '',
        exam_title: '',
        exam_des: '',
        exam_id: ''
      }
    }
  },
  filters: {
    formatDate (time) {
      time += '000'
      return formatDate(new Date(parseInt(time)), 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    async initHomework () {
      this.fullscreenLoading = true
      this.dialogEditHomeworkFormVisible = false
      let examId = this.$route.query.exam_id
      if (!examId) {
        return this.$router.push('/teacher/checkHomework')
      }
      let token = localStorage.getItem('token')
      try {
        let homeworkDetail = await axios.get(window.API_URL + '/v2/teacher/homework/detail', {params: {token: token, exam_id: examId}})
        if (homeworkDetail.data.retCode === 0) {
          this.homeworkDetail = homeworkDetail.data.retData
        }
        let homeworkSummary = await axios.get(window.API_URL + '/v2/teacher/homework/detail/summary', {params: {token: token, exam_id: examId}})
        if (homeworkSummary.data.retCode === 0) {
          this.homeworkSummary = homeworkSummary.data.retData
          this.distribution.series[0].data = Object.values(this.homeworkSummary.homework_info.distribution)
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.fullscreenLoading = false
      }
    },
    async initStudent () {
      this.fullscreenLoading = true
      let examId = this.$route.query.exam_id
      if (!examId) {
        return this.$router.push('/teacher/checkHomework')
      }
      let token = localStorage.getItem('token')
      try {
        let homeworkDetail = await axios.get(window.API_URL + '/v2/teacher/homework/detail', {params: {token: token, exam_id: examId}})
        if (homeworkDetail.data.retCode === 0) {
          this.homeworkDetail = homeworkDetail.data.retData
        }
        let StudentList = await axios.get(window.API_URL + '/v2/teacher/homework/student/list', {params: {token: token, exam_id: examId}})
        if (StudentList.data.retCode === 0) {
          this.StudentList = StudentList.data.retData
          if (this.StudentList.length) {
            this.moreCol = this.StudentList[0].score_info
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.fullscreenLoading = false
      }
    },
    async initPaper () {
      this.fullscreenLoading = true
      let examId = this.$route.query.exam_id
      if (!examId) {
        return this.$router.push('/teacher/checkHomework')
      }
      let token = localStorage.getItem('token')
      try {
        let homeworkDetail = await axios.get(window.API_URL + '/v2/teacher/homework/detail', {params: {token: token, exam_id: examId}})
        if (homeworkDetail.data.retCode === 0) {
          this.homeworkDetail = homeworkDetail.data.retData
        }
        let paperDetail = await axios.get(window.API_URL + '/v2/teacher/homework/paper', {params: {token: token, exam_id: examId}})
        if (paperDetail.data.retCode === 0) {
          this.paperDetail = paperDetail.data.retData
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.fullscreenLoading = false
      }
    },
    saveHomework () {
      this.editHomeworkForm.finish_time = formatDate(this.editHomeworkForm.finish_time, 'yyyy-MM-dd hh:mm:ss')
      let token = localStorage.getItem('token')
      let _this = this
      axios.post(window.API_URL + '/v2/teacher/homework/save', this.editHomeworkForm, {params: {token: token}}).then(function (ret) {
        if (ret.data.retCode === 0) {
          _this.$alert('作业修改成功!', '修改作业', {
            confirmButtonText: '确定',
            callback: function () {
              _this.initHomework()
            }})
        } else {
          _this.$alert(ret.data.retMsg, '修改作业', {confirmButtonText: '确定'})
        }
      })
    },
    delHomework () {
      let token = localStorage.getItem('token')
      let _this = this
      this.$confirm('是否确认删除此作业?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post(window.API_URL + '/v2/teacher/homework/del', {exam_id: _this.homeworkDetail.exam_id}, {params: {token: token}}).then(function (ret) {
          if (ret.data.retCode === 0) {
            return _this.$router.replace('/teacher/checkHomework')
          }
        })
      })
    },
    async exportHomework () {
      this.dialogVisible = true
      let token = localStorage.getItem('token')
      let examId = this.$route.query.exam_id
      this.getDownUrl = true
      let StudentList = await axios.get(window.API_URL + '/v2/teacher/homework/student/list', {params: {token: token, exam_id: examId, down: 'xls'}})
      let _this = this
      setTimeout(function () {
        if (StudentList.data.retCode === 0) {
          _this.exportUrl = StudentList.data.retData['static']
        }
        _this.getDownUrl = false
      }, 1000)
    }
  },
  created () {
    this.initHomework()
  }
}
</script>

<style scoped src="@/assets/css/teacher/homeworkDetail.css"></style>
<style scoped>

</style>
