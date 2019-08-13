<template>
  <div>
    <div class="homework-box-list" v-for="(item, index) in list" :key="index">
      <div class="homework-box-content gap">
        <div class="homework-box-content-title">
          <div class="fl clear">
            <span class="hbct-title fl">作业名称：</span>
            <span class="hbct-MW fl"><span class="hbct-name">{{item.exam_title}}</span></span>
            <span class="hbct-status fl hbct-status-ing" v-if="item.status==100">未发布</span>
            <span class="hbct-status fl hbct-status-ing" v-if="item.status==101">进行中</span>
            <span class="hbct-status fl hbct-status-end" v-if="item.status==200">已结束</span>
            <span class="hbct-status fl hbct-status-end" v-if="item.status==201">已检查</span>
          </div>
          <div class="fr">
            <div class="hbct-time-tips fl">
              <span v-if="item.status==100">还未开始</span>
              <span v-if="item.status==101">还剩<span class="red">{{item.finish_time | howMuchDay}}</span>天结束</span>
              <span v-if="item.status==200 || item.status==201">已结束</span>
              <span>（{{item.finish_time | formatDate}}）</span>
            </div>
          </div>
        </div>
        <div class="homework-box-content-class">
          <div class="hbcc-left fl">
            <div class="hbcc-left-top">
              <span class="hbcc-class">{{item.class_name}}</span><span class="hbcc-score hbcc-score-gray"><span>{{item.average_score}}</span>/<span>{{item.paper_score}}</span>分</span>
            </div>
            <div class="hbcc-left-bottom">
              <div class="hbcc-left-bottom-btn fl">
                <span class="icon-cake"></span><span>{{item.finish_user_num}}</span>/<span>{{item.exam_user_num}}</span>完成
              </div>
            </div>
          </div>
          <div class="fr hbcc-right">
            <el-button type="primary" size="small" @click="editHomework(item)">修改</el-button>
            <el-button type="primary" size="small" @click="delHomework(index)">撤回</el-button>
            <router-link :to="{path: '/teacher/homeworkDetail', query: {exam_id: item.exam_id}}"><el-button type="primary" size="small" style="margin-left: 10px">检查作业详情</el-button></router-link>
          </div>
          <div class="cl-fix"></div>
        </div>
      </div>
    </div>
    <el-dialog title="修改作业" width="35%" :visible.sync="dialogEditHomeworkFormVisible">
      <el-form :model="editHomeworkForm" label-width="100px">
        <el-form-item label="作业名称">
          <el-input v-model="editHomeworkForm.exam_title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" >
          <el-input auto-complete="off" :value="editHomeworkForm.publish_time | formatDate" disabled></el-input>
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
</template>

<script>
import {formatDate} from '@/common/date.js'
import axios from 'axios'
export default {
  name: 'layoutHomework',
  data () {
    return {
      dialogEditHomeworkFormVisible: false,
      editHomeworkForm: {
        finish_time: '',
        publish_time: '',
        exam_title: '',
        exam_des: '',
        exam_id: ''
      }
    }
  },
  props: {
    list: {}
  },
  filters: {
    formatDate (time) {
      time += '000'
      return formatDate(new Date(parseInt(time)), 'yyyy-MM-dd hh:mm')
    },
    howMuchDay (time) {
      time += '000'
      return parseInt((parseInt(time) - new Date().getTime()) / (3600000 * 24))
    }
  },
  methods: {
    editHomework (item) {
      this.editHomeworkForm = {
        finish_time: new Date(parseInt(item.finish_time + '000')),
        publish_time: item.publish_time,
        exam_title: item.exam_title,
        exam_des: item.exam_des,
        exam_id: item.exam_id
      }
      this.dialogEditHomeworkFormVisible = true
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
              _this.$emit('change')
            }})
        } else {
          _this.$alert(ret.data.retMsg, '修改作业', {confirmButtonText: '确定'})
        }
      })
    },
    delHomework (index) {
      let token = localStorage.getItem('token')
      let _this = this
      let examId = this.list[index].exam_id
      this.$confirm('是否确认删除此作业?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post(window.API_URL + '/v2/teacher/homework/del', {exam_id: examId}, {params: {token: token}}).then(function (ret) {
          _this.$emit('change')
        })
      })
    }
  }
}
</script>

<style scoped>
  .homework-box-list:hover {
    box-shadow: 0 4px 18px rgba(0,0,0,.1);
    -webkit-box-shadow: 0 4px 18px rgba(0,0,0,.1);
  }
  .icon-cake {
    display: inline-block;
    position: relative;
    margin-right: 6px;
    width: 15px;
    height: 15px;
    left: 0;
    top: 2px;
    background: url(~@/assets/images/sprite-check-homework.png) no-repeat -75px 0;
  }
  .icon-more {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 4px;
    left: 0;
    top: -3px;
    background: url(~@/assets/images/sprite-check-homework.png) no-repeat -27px 0;
  }

  .homework-box-content {
    border-radius: 6px;
    overflow: hidden;
    width: 100%;
    background: #fff;
  }
  .gap {
    margin-bottom: 10px;
  }
  .homework-box-content-title {
    height: 47px;
    line-height: 46px;
    border: 1px solid #f5f7fa;
    padding-left: 20px;
    padding-right: 10px;
    font-size: 14px;
  }
  .hbct-title {
    color: #0e0e0e;
  }
  .hbct-name {
    color: #0e0e0e;
    cursor: pointer;
  }
  .hbct-MW {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 385px;
    white-space: nowrap;
    color: #bcbcbc;
  }
  .hbct-status-ing {
    background: #ecfaf1;
    color: #43cb75;
  }
  .hbct-status-end {
    background: #f5f6f7;
    color: #a1a9b0;
  }
  .hbct-status {
    top: 11px;
    padding-left: 11px;
    padding-right: 11px;
    height: 24px;
    line-height: 24px;
    border-radius: 12px;
    display: inline-block;
    position: relative;
    font-size: 14px;
    margin-left: 10px;
  }
  .hbct-time-tips {
    padding-left: 11px;
    padding-right: 11px;
    color: #bcbcbc;
  }
  .hbct-btn {
    padding-left: 11px;
    padding-right: 11px;
    color: #3caaea;
    cursor: pointer;
    position: relative;
  }
  .homework-box-content-class {
    height: 90px;
    border-bottom: 1px solid #f5f7fa;
    margin-left: 20px;
    margin-right: 20px;
  }
  .hbcc-left {
    height: 100%;
  }
  .hbcc-right {
    padding-top: 33px;
  }
  .hbcc-left-top {
    height: 40px;
    line-height: 59px;
    font-size: 18px;
  }
  .hbcc-class {
    color: #313131;
    margin-right: 29px;
  }
  .hbcc-score-gray {
    color: #bcbcbc;
  }
  .hbcc-score-red {
    color: #ff6268;
  }
  .hbcc-score-yellow {
    color: #ffa600;
  }
  .hbcc-score-green {
    color: #5cd287;
  }
  .hbcc-left-bottom {
    height: 50px;
    line-height: 50px;
  }
  .hbcc-left-bottom-btn {
    height: 100%;
    margin-right: 43px;
    color: #2199de;
    font-size: 14px;
    cursor: pointer;
    position: relative;
  }
</style>
