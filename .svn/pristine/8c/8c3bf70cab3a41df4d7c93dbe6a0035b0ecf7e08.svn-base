<template>
  <div>
    <div class="qs-title">{{question.qs_title}}
      <span class="fr">
          <el-button
            v-show="showBtn"
            :type="cart.hasOwnProperty('qsId_' + question.qs_id) ? 'success' : 'primary'"
            size="mini"
            @click="publishQuestion(question)">{{cart.hasOwnProperty('qsId_' + question.qs_id) ? '取消布置' : '布置该题'}}
          </el-button>
      </span>
    </div>
    <div class="qs-content">{{question.qs_content}}</div>
    <div class="qs-info" v-for="(info, info_idx) in question.info" :key="info.info_id">
      <div class="items" v-for="item in info.items" :key="item.item_id">
        <div class="item-content">{{info_idx+1}}. {{item.item_content}} <span v-show="item.source_content" class="horn-icon" :data-src="item.source_content" @click="audioPlay($event)"></span></div>
        <div class="item-answer" v-for="(answer,index) in item.answers" :key="answer.answer_id">
          {{options[index]}}.<span> {{answer.answer_content}} </span>
          <img class="option-img" v-if="answer.source_content" :src="STATIC_URL + answer.source_content">
          <i :class="answer.answer_is_right==1?'el-icon-check':'el-icon-close'"></i>
        </div>
        <div class="item-answer-condition">准备时间：{{item.item_prepare_second}}秒 答题时间：{{item.item_answer_second}}秒 题目满分：{{item.item_score}}分</div>
      </div>
    </div>
    <studentAnswer v-if="question.hasOwnProperty('student_score') && question.student_score" :studentAnswer="question.student_score"></studentAnswer>
  </div>
</template>

<script>
import paperQustionMixin from '@/common/paperQustion'
export default {
  name: 'qsType_1',
  mixins: [paperQustionMixin]
}
</script>
<style scoped src="@/assets/css/teacher/paperQuestion.css"></style>
<style scoped>

</style>
