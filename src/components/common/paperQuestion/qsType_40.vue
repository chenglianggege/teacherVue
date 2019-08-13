<template>
  <div>
    <div class="qs-title">{{question.qs_title}}<span class="fr">
          <el-button v-show="showBtn"
                     :type="cart.hasOwnProperty('qsId_' + question.qs_id) ? 'success' : 'primary'"
                     size="mini"
                     @click="publishQuestionWithInfo(question, checkedItems)">{{cart.hasOwnProperty('qsId_' + question.qs_id) ? '取消布置' : '布置该题'}}</el-button></span>
    </div>
    <div class="qs-content">{{question.qs_content}}</div>
    <el-checkbox v-if="showBtn"  :indeterminate="isIndeterminate" :disabled="cart.hasOwnProperty('qsId_' + question.qs_id) ? true : false" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <el-row v-if="showBtn">
      <el-checkbox-group :disabled="cart.hasOwnProperty('qsId_' + question.qs_id) ? true : false" v-model="checkedItems" @change="handleCheckedItemsChange">
        <el-col :span="8" v-for="info in question.info" :key="info.info_id">
        <div class="items" v-for="item in info.items" :key="item.item_id">
            <div class="item-content" >
              <el-checkbox :label="info.info_id">{{item.item_content}}</el-checkbox>
              <span v-show="item.source_content" class="horn-icon" :data-src="item.source_content" @click="audioPlay($event)"></span>
            </div>
        </div>
        </el-col>
      </el-checkbox-group>
    </el-row>
    <el-row v-if="!showBtn">
      <el-col :span="8" v-for="info in question.info" :key="info.info_id">
        <div class="items" v-for="item in info.items" :key="item.item_id">
          <div class="item-content" v-if="checkedItems.indexOf(info.info_id) !== -1">
            {{item.item_content}}
            <span v-show="item.source_content" class="horn-icon" :data-src="item.source_content" @click="audioPlay($event)"></span>
          </div>
        </div>
      </el-col>
    </el-row>
    <studentAnswer v-if="question.hasOwnProperty('student_score') && question.student_score" :studentAnswer="question.student_score"></studentAnswer>
  </div>
</template>

<script>
import paperQustionMixin from '@/common/paperQustion'
export default {
  name: 'qsType_40',
  mixins: [paperQustionMixin],
  data () {
    return {
      checkAll: true,
      checkedItems: [],
      allItems: [],
      isIndeterminate: false
    }
  },
  mounted () {
    let allItems = []
    for (let i in this.question.info) {
      allItems.push(this.question.info[i]['info_id'])
    }
    this.allItems = allItems
    if (this.cart.hasOwnProperty('qsId_' + this.question.qs_id)) {
      this.checkedItems = this.cart['qsId_' + this.question.qs_id].qsInfoIds
      this.checkAll = this.checkedItems.length === allItems.length
      this.isIndeterminate = this.checkedItems.length > 0 && this.checkedItems.length < allItems.length
    } else {
      this.checkedItems = allItems
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.checkedItems = val ? this.allItems : []
      this.isIndeterminate = false
    },
    handleCheckedItemsChange (value) {
      console.log(value)
      let checkedCount = value.length
      this.checkAll = checkedCount === this.allItems.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allItems.length
    }
  }
}
</script>
<style scoped src="@/assets/css/teacher/paperQuestion.css"></style>
<style scoped>

</style>
