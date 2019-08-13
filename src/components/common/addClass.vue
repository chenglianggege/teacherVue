<template>
  <el-dialog title="添加班级" width="30%" :visible.sync="dialogAddClassFormVisible">
    <el-form :model="addClassForm" label-width="100px">
      <el-form-item label="班级名称">
        <el-input :maxlength="6" v-model="addClassForm.class_name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="班级年度" >
        <el-radio-group v-model="addClassForm.year" size="small">
          <el-radio-button v-for="(year, index) in years"  :key="index" :label="year"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="班级年级" >
        <el-select v-model="addClassForm.grade" placeholder="请选择">
          <el-option
            v-for="item in grades.grades_list"
            :key="item.grade_id"
            :label="item.grade_name"
            :value="item.grade_id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogAddClassFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveClass">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'
export default {
  name: 'addClass',
  data () {
    return {
      addClassForm: {},
      years: [],
      grades: [],
      dialogAddClassFormVisible: this.visible
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible () {
      this.dialogAddClassFormVisible = this.visible
    },
    dialogAddClassFormVisible () {
      if (!this.dialogAddClassFormVisible) {
        this.$emit('close')
      }
    }
  },
  methods: {
    saveClass () {
      let token = localStorage.getItem('token')
      let _this = this
      axios.post(window.API_URL + '/v2/teacher/sclass/add',
        this.addClassForm,
        {params: {token: token}}).then(function (ret) {
        if (ret.data.retCode === 0) {
          _this.dialogAddClassFormVisible = false
          _this.$message({
            type: 'success',
            message: '添加成功!'
          })
        } else {
          _this.$message({
            type: 'error',
            message: ret.data.retMsg
          })
        }
      })
    }
  },
  async created () {
    let year = new Date().getFullYear()
    this.years.push((year - 1) + '~' + year)
    this.years.push(year + '~' + (year + 1))

    let token = localStorage.getItem('token')
    let pressID = localStorage.getItem('pressID')
    let grades = await axios.get(window.API_URL + '/v2/teacher/paper/grades', {params: {token: token, press_id: pressID}})
    if (grades.data.retCode === 0) {
      this.grades = grades.data.retData
    }
  }
}
</script>

<style scoped>

</style>
