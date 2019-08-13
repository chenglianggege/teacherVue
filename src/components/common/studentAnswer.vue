<template>
  <div>
    <div class="part-btn">
      <button class="green-btn con-audio show-audio" @click="showAnswer=!showAnswer"><span :class="showAnswer ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"><span class="gr-arr-2"></span></span><span class="aud-word">{{showAnswer ? '收起':'显示'}}学生作答</span></button>
    </div>
    <div class="audio-list" style="display: block;" v-if="showAnswer && studentAnswer">
      <div class="part-table">
        <table cellspacing="0"  v-for="(studentAnswers,asw_idx) in studentAnswer" :key="asw_idx">
          <thead>
          <tr>
            <td class="p1"></td>
            <td class="p2">排名</td>
            <td class="p3">学号</td>
            <td class="p4">姓名</td>
            <td class="p6">得分</td>
            <td class="p7 td-ans">学生作答</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(student,index) in studentAnswers" :key="index">
            <td></td>
            <td><span>{{index+1}}</span></td>
            <td><span>{{student.info.student_no ? student.info.student_no : '-'}}</span></td>
            <td><span>{{student.info.student_name}}</span></td>
            <td><span>{{student.score_overall}}</span></td>
            <td class="td-ans" v-if="student.answer_type == 1 || student.answer_type == 3">
              <span v-for="(detail,d_idx) in student.detail" :key="d_idx" class="ib mr8 ml8"><span>{{d_idx+1}}</span>:<span :class="detail.exam_score > 0 ? 'ans-right' : 'ans-wrong'">{{detail.user_answer}}</span></span>
            </td>
            <td class="td-ans" style="text-align: left" v-if="student.answer_type == 2">
              <span class="ib horn-w" v-for="(detail,d_idx) in student.detail" :key="d_idx" >
                <span class="horn-icon" @click="audioPlay($event)" :data-src="'//' + detail.user_answer + '.mp3'"></span>
                录音<span>{{d_idx+1}}</span>(<span>{{detail.exam_score}}</span>分)
              </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
import bus from '@/common/eventBus'
export default {
  name: 'studentAnswer',
  props: {
    studentAnswer: {}
  },
  data () {
    return {
      showAnswer: false,
      isPlaying: false,
      playUrl: '',
      STATIC_URL: ''
    }
  },
  methods: {
    audioPlay (source) {
      let player = document.querySelector('#player')
      let src = source.target.dataset.src
      if (this.isPlaying && this.playUrl === src) {
        this.isPlaying = false
        player.pause()
        return
      }
      if (this.isPlaying) {
        this.isPlaying = false
        player.pause()
        this.currentPlayer.target.classList.remove('playing')
      }
      player.src = src
      player.play()
      this.currentPlayer = source
      this.isPlaying = true
      this.playUrl = src
      this.currentPlayer.target.classList.add('playing')
      console.log(player.src)
    }
  },
  watch: {
    isPlaying () {
      if (!this.isPlaying) {
        this.currentPlayer.target.classList.remove('playing')
      }
    }
  },
  mounted () {
    this.STATIC_URL = window.STATIC_URL
    let _this = this
    bus.$on('playended', function () {
      _this.isPlaying = false
    })
  }
}
</script>
<style scoped src="@/assets/css/teacher/paperQuestion.css"></style>
<style scoped>

</style>
