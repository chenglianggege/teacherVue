<template>
  <el-container v-loading.fullscreen.body.lock="fullscreenLoading">
    <el-header height="80px" class="header">
      <layoutHeader :activeIndex="activeIndex"></layoutHeader>
    </el-header>
    <el-main  class="container"  v-if="fullscreenLoading"></el-main>
    <el-main  class="container"  v-if="!fullscreenLoading">
      <div class="check-homework-header">
        <div class="check-homework-title fl">检查作业</div>
      </div>
      <div class="homework-box" v-if="page == 1">
        <div class="homework-box-title">
          <span class="icon-calendar"></span><span>{{today}}</span> (<span>{{todayWeek}}</span>)
        </div>
        <div class="homework-box-today-no-homework" v-if="!homeworkList.hasOwnProperty(today)">
          今天还没有布置作业。现在去<router-link :to="{path: '/teacher/publishHomework'}">布置作业</router-link>
        </div>
        <layoutHomework @change="initHomework" :list="homeworkList[today].homework" v-if="homeworkList.hasOwnProperty(today)"></layoutHomework>
      </div>
      <div class="homework-box" v-for="(list, index) in homeworkList" :key="index">
        <div class="homework-box-title" v-if="index != today || page > 1">
          <span class="icon-calendar"></span><span>{{index}}</span> (<span>{{list.weekday}}</span>)
        </div>
        <layoutHomework @change="initHomework" :list="list.homework" v-if="index != today || page > 1"></layoutHomework>
      </div>
      <div class="page-box" v-show="homeworkTotal > pageSize">
        <el-pagination background layout="prev, pager, next" :current-page.sync="page" :pager-count="9" :page-size="pageSize" :total="homeworkTotal"></el-pagination>
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
import layoutHomework from '@/components/common/layoutHomework'
import axios from 'axios'
import {formatDate} from '@/common/date.js'
export default {
  name: 'checkHomework',
  components: {
    layoutHeader, layoutFooter, layoutHomework
  },
  methods: {
    async initHomework () {
      this.fullscreenLoading = true
      let token = localStorage.getItem('token')
      try {
        let homeworkList = await axios.get(window.API_URL + '/v2/teacher/homework/list', {params: {token: token, pagesize: this.pageSize, page: this.page, day: 1}})
        if (homeworkList.data.retCode === 0) {
          this.homeworkList = homeworkList.data.retData.list
          this.homeworkTotal = Number(homeworkList.data.retData.total)
          // console.log(this.homeworkList)
          document.body.scrollTop = document.documentElement.scrollTop = 0
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.fullscreenLoading = false
      }
    }
  },
  data () {
    return {
      fullscreenLoading: true,
      activeIndex: '3',
      homeworkList: [],
      homeworkTotal: 0,
      today: '',
      todayWeek: '',
      pageSize: 5,
      page: 1
    }
  },
  watch: {
    page () {
      this.initHomework()
    }
  },
  created () {
    this.today = formatDate(new Date(), 'yyyy-MM-dd')
    let weeks = ['日', '一', '二', '三', '四', '五', '六']
    let week = new Date().getDay()
    this.todayWeek = '周' + weeks[week]
    this.initHomework()
  }
}
</script>

<style scoped>
  .el-pagination {
    max-width: 500px;
    margin: 0 auto;
  }
  .check-homework-header {
    height: 48px;
    width: 1040px;
    margin: 0 auto;
  }
  .check-homework-title {
    color: #555;
    font-size: 20px;
    line-height: 48px;
    height: 100%;
  }
  .sel-content {
    height: 100%;
    font-size: 14px;
    color: #2199de;
    cursor: pointer;
    position: relative;
  }
  .for-sel-win {
    line-height: 48px;
  }
  .icon-sel {
    display: inline-block;
    position: relative;
    width: 17px;
    height: 13px;
    left: 0;
    top: 2px;
    background: url(~@/assets/images/sprite-check-homework.png) no-repeat -47px 0;
    margin-right: 6px;
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

  .sel-type-box {
    margin-top: 29px;
  }
  .sel-type-box p {
    color: #a4a4a4;
    font-size: 14px;
    margin-bottom: 12px;
    line-height: 20px;
  }
  .clear-sel {
    float: right;
    color: #2199de;
    font-size: 14px;
    margin-right: 33px;
    cursor: pointer;
  }
  .sel-status ul li {
    width: 84px;
  }
  .sel-class ul li {
    width: 128px;
  }
  .sel-type-box ul li {
    height: 26px;
    line-height: 26px;
    color: #2e2e2e;
    font-size: 14px;
    float: left;
  }
  .sel-btn-box {
    margin-top: 27px;
    margin-bottom: 38px;
  }
  .cc-btn {
    font-size: 14px;
  }
  .sure-check-btn {
    width: 241px;
    height: 32px;
    line-height: 0 !important;
  }

  .homework-box {
    width: 1040px;
    margin: 0 auto 40px auto;
  }
  .homework-box-title {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    color: #757575;
  }
  .homework-box-today-no-homework {
    height: 92px;
    line-height: 92px;
    color: #bcbcbc;
    font-size: 14px;
    text-align: center;
    background: #fff;
    border-radius: 6px;
  }
  .toPublish {
    color: #2199de;
    cursor: pointer;
  }
  .homework-box-today-no-homework:hover {
    box-shadow: 0 4px 18px rgba(0,0,0,.1);
    -webkit-box-shadow: 0 4px 18px rgba(0,0,0,.1);
  }
  .page-box {
    width: 1040px;
    margin: 30px auto;
  }

</style>
