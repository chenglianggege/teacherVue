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
    <div class="qs-info" v-for="(info,info_idx) in question.info" :key="info.info_id">
      <div v-if="info_idx == 0">
        <div class="info-content">
          {{info.info_content}}
        </div>
        <img class="info-img" v-if="info.info_content_img" :src="STATIC_URL + info.info_content_img">
        <div class="items" v-for="(item,index) in info.items" :key="item.item_id">
          <div class="item-content"><span v-show="item.source_content" class="horn-icon" :data-src="item.source_content" @click="audioPlay($event)"></span></div>
          <div class="item-answer"  v-for="answer in item.answers" :key="answer.answer_id"><span>填空{{index+1}}：{{answer.answer_content}}</span></div>
          <div class="item-answer-condition">准备时间：{{item.item_prepare_second}}秒 答题时间：{{item.item_answer_second}}秒 题目满分：{{item.item_score}}分</div>
        </div>
      </div>
      <div v-if="info_idx == 1">
        <div class="info-content">
          {{info.info_content}}
        </div>
        <div class="items" v-for="item in info.items" :key="item.item_id">
          <div class="item-content"><span v-show="item.source_content" class="horn-icon" :data-src="item.source_content" @click="audioPlay($event)"></span></div>
          <div class="item-answer"  v-for="answer in item.answers" :key="answer.answer_id"><span>评分参考文本：{{answer.answer_content}}</span></div>
          <div class="item-answer-condition">准备时间：{{item.item_prepare_second}}秒 答题时间：{{item.item_answer_second}}秒 题目满分：{{item.item_score}}分</div>
        </div>
      </div>
      <div v-if="info_idx == 2">
        <div class="info-content">
         {{info.info_content}}
        </div>
        <div class="items" v-for="item in info.items" :key="item.item_id">
          <div class="item-content">{{item.item_content ? item.item_content + '. ' : '问题' + (index+1) + '. '}}<span v-show="item.source_content" class="horn-icon" :data-src="item.source_content" @click="audioPlay($event)"></span></div>
          <div class="item-answer"  v-for="answer in item.answers" :key="answer.answer_id"><span>评分参考文本：{{answer.answer_content}}</span></div>
          <div class="item-answer-condition">准备时间：{{item.item_prepare_second}}秒 答题时间：{{item.item_answer_second}}秒 题目满分：{{item.item_score}}分</div>
        </div>
      </div>
    </div>
    <studentAnswer v-if="question.hasOwnProperty('student_score') && question.student_score" :studentAnswer="question.student_score"></studentAnswer>
  </div>
</template>

<script>
import paperQustionMixin from '@/common/paperQustion'
export default {
  name: 'qsType_37',
  mixins: [paperQustionMixin]
}
</script>
<style scoped src="@/assets/css/teacher/paperQuestion.css"></style>
<style scoped>

</style>
