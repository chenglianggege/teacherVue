<template>
  <el-dialog title="选择学校" :visible.sync="selectSchoolvisible" :before-close="handleClose" :show-close="showClose" :close-on-click-modal="false" :close-on-press-escape="false" width="670px">
    <div class="school-body">
      <p class="the-title">省/直辖市</p>
      <div class="province-div">
        <ul class="clear">
          <li v-for="province in provinces" :key="province.area_id" :class="{'selected-item': province.area_id == provinceId}" class="w-item province-item see-item" @click="provinceId = province.area_id">
            {{province.full_name}}
          </li>
        </ul>
      </div>
      <p class="the-title">市</p>
      <div class="city-div">
        <ul class="clear">
          <li v-for="city in citys" :key="city.area_id" :class="{'selected-item': city.area_id == cityId}" class="w-item province-item see-item" @click="cityId = city.area_id">
            {{city.full_name}}
          </li>
        </ul>
      </div>
      <p class="the-title">区</p>
      <div class="area-div">
        <p class="no-sel-text" v-show="!areas.length">请选择地区</p>
        <ul class="clear" v-show="areas.length">
          <li v-for="area in areas" :key="area.area_id" :class="{'selected-item': area.area_id == areaId}" class="w-item province-item see-item" @click="areaId = area.area_id">
            {{area.full_name}}
          </li>
        </ul>
      </div>
      <div class="search-div" style="display: block;">
        在学校中搜索 <input type="text" v-model="searchTxt" id="schoolSearch"><el-button id="clearSchool-input" @click="searchTxt=''" type="text" v-show="searchTxt" class="none">清空</el-button>
      </div>
      <div class="school-div" style="display: block;">
        <div>
          <p class="no-sel-text" v-show="!schools.length">请选择学校</p>
          <ul class="clear" v-show="schools.length">
            <el-tooltip v-show="search(school.school_name)" v-for="school in schools" :key="school.school_id" :disabled="school.school_name.length > 9 ? false : true" placement="top" :content="school.school_name" trigger="hover" :visible-arrow="false">
            <li :class="{'selected-item': school.school_id == schoolId}" class="s-item school-item see-item" @click="schoolId = school.school_id;schoolInfo = school">
              {{school.school_name}}
            </li>
            </el-tooltip>
          </ul>
        </div>
      </div>
      <div class="no-school-box none" style="display: none;">
        <div class="no-school-sel" style="display: block;">
          <span class="no-school-text">学校不存在？</span>
          <span class="addSchool-btn">+ 新建学校</span>
        </div>
        <div class="no-school-input none" style="display: none;">
          <p class="no-school-tips">请正确输入您所在的学校名称</p>
          <span id="schoolName-input-con"><input type="text" id="schoolName-input" maxlength="15"><span id="cancelSchool-input">取消</span></span>
        </div>
      </div>
      <!--div class="class-div">
                班级：
                <span v-text="card.grade"></span>
                <input type="text" id="class-number" maxlength='3'>
                 班 <span class="ml20">（提示：请输入班级编号，如<span v-text="card.grade"></span>1班，输入〞1〞）</span>
            </div-->
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="saveSchool" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'
export default {
  name: 'selectSchool',
  data () {
    return {
      provinces: [],
      citys: [],
      cityId: 0,
      areas: [],
      areaId: 0,
      schools: [],
      schoolId: 0,
      schoolInfo: {},
      selectSchoolvisible: false,
      searchTxt: '',
      provinceId: 0
    }
  },
  props: {
    pId: {
      type: Number,
      default: 5266
    },
    visible: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible () {
      this.selectSchoolvisible = this.visible
    },
    selectSchoolvisible () {
      if (!this.selectSchoolvisible) {
        this.$emit('close')
      }
    },
    async provinceId () {
      this.cityId = 0
      if (this.provinceId) {
        let citys = await axios.get(window.API_URL + '/v2/area', {params: {parent_id: this.provinceId}})
        if (citys.data.retCode === 0) {
          this.citys = citys.data.retData
        }
      }
    },
    async cityId () {
      this.areaId = 0
      this.areas = []
      if (this.cityId) {
        let areas = await axios.get(window.API_URL + '/v2/area', {params: {parent_id: this.cityId}})
        if (areas.data.retCode === 0) {
          this.areas = areas.data.retData
        }
      }
    },
    async areaId () {
      this.schoolId = 0
      this.schools = []
      if (this.areaId) {
        let schools = await axios.get(window.API_URL + '/v2/area/school', {params: {area_id: this.areaId}})
        if (schools.data.retCode === 0) {
          this.schools = schools.data.retData
        }
      }
    }
  },
  methods: {
    async saveSchool () {
      if (!this.schoolId) {
        this.$alert('请选择一个学校', '选择学校', {confirmButtonText: '确定'})
        return
      }
      let token = localStorage.getItem('token')
      let ret = await axios.post(window.API_URL + '/v2/user/info/save', {school_id: this.schoolId}, {params: {token: token}})
      this.$alert(ret.data.retMsg, '选择学校', {confirmButtonText: '确定'})
      if (ret.data.retCode === 0) {
        let userInfo = await axios.get(window.API_URL + '/v2/user/info', {
          params: {token: token}
        })
        if (userInfo.data.retCode === 0) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo.data.retData))
          this.$emit('updateSchool', this.schoolInfo.school_name)
        }
        this.selectSchoolvisible = false
      }
    },
    search (schoolName) {
      if (!this.searchTxt) {
        return true
      }
      let reg = new RegExp(this.searchTxt)
      if (reg.test(schoolName)) {
        return true
      }
      return false
    },
    handleClose (done) {
      done()
      this.selectSchoolvisible = false
    }
  },
  async created () {
    let provinces = await axios.get(window.API_URL + '/v2/area', {params: {parent_id: 0}})
    if (provinces.data.retCode === 0) {
      this.provinces = provinces.data.retData
    }
    this.provinceId = this.pId
  }
}
</script>

<style scoped>
  .the-title {
    font-size: 14px;
    font-weight: 700;
    line-height: 28px;
  }
  .area-div, .city-div, .province-div {
    border-bottom: 1px solid #e0e8f1;
  }
  .province-div ul {
    height: 97px;
    overflow-y: auto;
  }
  .area-div li, .city-div li, .province-div li {
    float: left;
    list-style: none;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 3px;
    cursor: pointer;
  }
  .w-item {
    width: 40px;
    height: 24px;
    line-height: 24px;
    margin-right: 27px;
  }
  .selected-item {
    color: #47a4f2;
    font-weight: 700;
  }
  .search-div {
    height: 44px;
    line-height: 44px;
    background: #f4f8fd;
  }
  .school-body {
    border-radius: 3px;
    background: #fff;
    font-size: 12px;
    overflow-y: auto;
    padding: 0px 5px 0px 5px;
  }
  #schoolName-input, #schoolSearch {
    width: 239px;
    height: 24px;
    border: 1px solid #e0e8f1;
    margin-left: 10px;
  }
  .school-div {
    overflow-y: auto;
    margin-top: 10px;
    margin-bottom: 25px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e8f1;
  }
  .school-div .no-sel-text {
    height: 42px;
    line-height: 42px;
  }
  .school-div ul {
    height: 107px;
    overflow: auto;
  }
  li, ul {
    list-style: none;
    margin: 0;
  }
  .school-div li {
    float: left;
    list-style: none;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 3px;
    cursor: pointer;
  }
  li.school-item {
    text-align: left;
    cursor: pointer;
  }
  .s-item {
    width: 122px;
    height: 24px;
    line-height: 24px;
    margin-right: 20px;
    margin-bottom: 3px;
  }
</style>
