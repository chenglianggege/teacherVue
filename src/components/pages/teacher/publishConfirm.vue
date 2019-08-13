<template>
  <el-container v-loading.fullscreen.body.lock="fullscreenLoading">
    <el-header height="80px" class="header">
      <layoutHeader :activeIndex="activeIndex"></layoutHeader>
    </el-header>
    <el-main  class="container"  v-if="fullscreenLoading"></el-main>
    <el-main  class="container"  v-if="!fullscreenLoading">
      <div class="c-body none" style="display: block;">
        <div class="detail-title">
          <span class="a-for-back">布置作业</span>
        </div>
        <div class="pub-box">
          <div class="pub-set-box clear">
            <div class="pub-set-div fl clear">
              <span class="pub-set-title fl">作业标题:</span>
              <el-input class="pub-title-input fl" v-model="submitForm.exam_title" placeholder="作业标题"></el-input>
            </div>
          </div>
          <div class="pub-set-box clear">
            <div class="pub-set-div fl clear">
              <span class="pub-set-title fl">布置班级:</span>
              <el-select multiple v-model="submitForm.class_id" placeholder="请选择布置班级">
                <el-option v-for="item in classList" :key="item.class_id" :label="item.class_name + '('+item.student_num+'人)'" :value="item.class_id" :disabled="item.student_num == 0"></el-option>
              </el-select>
            </div>
          </div>
          <div class="pub-set-box clear">
            <div class="pub-set-div fl clear mr96">
              <span class="pub-set-title fl">截止时间<span class="icon-pub-question icon-end-question"></span>:</span>
              <el-date-picker v-model="submitForm.finish_time" type="datetime" placeholder="请选择截止时间"></el-date-picker>
            </div>
            <div class="pub-set-div fl claer pub-set-start">
              <span class="pub-set-title fl">开始时间<span class="icon-pub-question icon-start-question"></span>:</span>
              <el-radio class="pub-sel" v-model="submitForm.start_type" label="1">立即开始</el-radio>
              <el-radio class="pub-sel" v-model="submitForm.start_type" label="2">指定时间</el-radio>
              <el-date-picker :picker-options="pickerOptions" v-model="submitForm.start_time" type="datetime" placeholder="请选择开始时间" v-show="submitForm.start_type == 2"></el-date-picker>
            </div>
            <div class="pub-set-div fl clear" style="display: none">
              <span class="pub-set-title fl">作业备注:</span>
              <el-input class="pub-note-input fl" v-model="submitForm.exam_des" placeholder="给学生留言"></el-input>
            </div>
          </div>
          <div class="pub-btn-box">
            <el-button type="primary" @click="publishHomework">确认布置</el-button>
          </div>
        </div>
        <div class="detail-title">
          <span class="a-for-back">题目预览</span>
        </div>
        <el-row>
          <el-col :span="8"><div class="grid-content">题目数量：{{qsNum}}题</div></el-col>
          <el-col :span="8"><div class="grid-content">题目总分：{{qsScore}}分</div></el-col>
          <el-col :span="8"><div class="grid-content">预计时间：{{qsDuration}}分钟</div></el-col>
        </el-row>
        <div class="pub-question">
          <layoutPaper :showBtn="false" :paperDetail="qsDetails"></layoutPaper>
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
import layoutPaper from '@/components/common/layoutPaper'
import {formatDate} from '@/common/date.js'
import axios from 'axios'
export default {
  name: 'publishConfirm',
  components: {
    layoutHeader, layoutFooter, layoutPaper
  },
  methods: {
    async initHomework () {
      let token = localStorage.getItem('token')
      let cart = JSON.parse(localStorage.getItem('cart'))
      cart = cart || {}
      let keys = Object.keys(cart)
      let questionIds = []
      for (let i = 0; i < keys.length; i++) {
        questionIds.push(keys[i].substr(5))
      }
      this.qsNum = keys.length
      let qsScore = 0
      let duration = 0
      for (let i in keys) {
        let qs = cart[keys[i]]
        qsScore += qs.qsScore
        duration += qs.duration
      }
      this.qsScore = qsScore
      this.qsDuration = Math.ceil(duration / 60000)

      this.submitForm.question_ids = questionIds
      this.submitForm.cart = cart
      try {
        let qsDetails = await axios.get(window.API_URL + '/v2/teacher/paper/question-by-ids', {params: {token: token, question_ids: questionIds}})
        if (qsDetails.data.retCode === 0) {
          this.qsDetails = qsDetails.data.retData
          console.log(this.qsDetails)
        }
        let classList = await axios.get(window.API_URL + '/v2/teacher/sclass/list', {params: {token: token}})
        if (classList.data.retCode === 0) {
          this.classList = classList.data.retData
          let classIds = []
          for (let i in this.classList) {
            if (this.classList[i].student_num > 0) {
              classIds.push(this.classList[i].class_id)
            }
          }
          this.submitForm.class_id = classIds
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.fullscreenLoading = false
      }
    },
    publishHomework () {
      let token = localStorage.getItem('token')
      const loading = this.$loading({
        lock: true,
        text: '正在发布...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let _this = this
      axios.post(window.API_URL + '/v2/teacher/homework/publish', this.submitForm, {params: {token: token}}).then(function (ret) {
        if (ret.data.retCode === 0) {
          _this.$alert('作业布置成功!', '作业布置', {confirmButtonText: '确定',
            callback: function () {
              localStorage.removeItem('cart')
              _this.$router.push('/teacher/checkHomework')
            }})
        } else {
          _this.$alert(ret.data.retMsg, '作业布置', {confirmButtonText: '确定'})
        }
      }).finally(function () {
        loading.close()
      })
    }
  },
  data () {
    let today = formatDate(new Date(), 'MM.dd')
    let finishTime = formatDate(new Date(), 'yyyy/MM/dd') + ' 23:59:59'
    return {
      fullscreenLoading: true,
      activeIndex: '2',
      finishTime: finishTime,
      submitForm: {
        start_type: '1',
        question_ids: [],
        finish_time: finishTime,
        start_time: '',
        exam_title: today + '听说作业',
        class_id: '',
        exam_des: '',
        cart: []
      },
      classList: [],
      qsDetails: [],
      pickerOptions: {
      },
      qsNum: 0,
      qsScore: 0,
      qsDuration: 0
    }
  },
  created () {
    this.initHomework()
  }
}
</script>

<style scoped>
  .el-select {
    width: 220px;
  }
  .el-col {
    background-color: #409EFF;
    margin-bottom: 10px;
  }
  .grid-content {
    height: 36px;
    color: #ffffff;
    font-size: 16px;
    line-height:36px ;
    padding-left: 20px;
  }
  .detail-title {
    height: 53px;
    line-height: 53px;
    font-size: 20px;
    color: #555;
  }
  .pub-box {
    background: #e4f1f9;
    border: 1px solid #b4e2ff;
    border-radius: 6px;
    padding: 24px 0 21px 21px;
  }
  .pub-set-div {
    margin-bottom: 12px;
    position: relative;
  }
  .pub-set-title {
    height: 40px;
    line-height: 40px;
    position: relative;
    width: 77px;
  }
  .pub-sel {
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    margin-left: 6px;
    margin-right: 23px;
  }
  .pub-note-input {
    width: 875px;
    line-height: 29px;
    outline: 0;
    resize: none;
    font-size: 14px;
    color: #2e2e2e;
  }
  .pub-title-input {
    width: 475px;
    line-height: 29px;
    outline: 0;
    resize: none;
    font-size: 14px;
    color: #2e2e2e;
  }
  .pub-btn-box {
    padding-left: 78px;
  }
  .pub-question {
    margin-bottom: 13px;
    background: #fff;
    width: 100%;
    padding: 15px 13px 15px 20px;
    border-radius: 6px;
  }
</style>
