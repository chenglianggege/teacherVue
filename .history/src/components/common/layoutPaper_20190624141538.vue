<template>
  <div class="paper-detail" >
    <div v-for="question in paperDetail" :key="question.qs_id">
      <div v-if="question.qs_type == 1">
        <qsType1 :showBtn="showBtn" :question="question"></qsType1>
      </div>
      <div v-if="question.qs_type == 3">
        <qsType3 :showBtn="showBtn" :question="question"></qsType3>
      </div>
      <div v-if="question.qs_type == 4">
        <qsType4 :showBtn="showBtn" :question="question"></qsType4>
      </div>
      <div v-if="question.qs_type == 5">
        <qsType5 :showBtn="showBtn" :question="question"></qsType5>
      </div>
      <div v-if="question.qs_type == 9">
        <qsType9 :showBtn="showBtn" :question="question"></qsType9>
      </div>
      <div v-if="question.qs_type == 12">
        <qsType12 :showBtn="showBtn" :question="question"></qsType12>
      </div>
      <div v-if="question.qs_type == 13">
        <qsType13 :showBtn="showBtn" :question="question"></qsType13>
      </div>
      <div v-if="question.qs_type == 16">
        <qsType16 :showBtn="showBtn" :question="question"></qsType16>
      </div>
      <div v-if="question.qs_type == 17">
        <qsType17 :showBtn="showBtn" :question="question"></qsType17>
      </div>
      <div v-if="question.qs_type == 18">
        <qsType18 :showBtn="showBtn" :question="question"></qsType18>
      </div>
      <div v-if="question.qs_type == 19">
        <qsType19 :showBtn="showBtn" :question="question"></qsType19>
      </div>
      <div v-if="question.qs_type == 21">
        <qsType21 :showBtn="showBtn" :question="question"></qsType21>
      </div>
      <div v-if="question.qs_type == 26">
        <qsType18 :showBtn="showBtn" :question="question"></qsType18>
      </div>
      <div v-if="question.qs_type == 35">
        <qsType35 :showBtn="showBtn" :question="question"></qsType35>
      </div>
      <div v-if="question.qs_type == 36">
        <qsType36 :showBtn="showBtn" :question="question"></qsType36>
      </div>
      <div v-if="question.qs_type == 37">
        <qsType37 :showBtn="showBtn" :question="question"></qsType37>
      </div>
      <div v-if="question.qs_type == 38">
        <qsType38 :showBtn="showBtn" :question="question"></qsType38>
      </div>
      <div v-if="question.qs_type == 40">
        <qsType40 :showBtn="showBtn" :question="question"></qsType40>
      </div>
      <div v-if="question.qs_type == 41">
        <qsType41 :showBtn="showBtn" :question="question"></qsType41>
      </div>
      <div v-if="question.qs_type == 42">
        <qsType42 :showBtn="showBtn" :question="question"></qsType42>
      </div>
      <div v-if="question.qs_type == 1901">
        <qsType1901 :showBtn="showBtn" :question="question"></qsType1901>
      </div>
    </div>
    <audio id="player"></audio>
  </div>
</template>

<script>
import qsType1 from '@/components/common/paperQuestion/qsType_1'
import qsType3 from '@/components/common/paperQuestion/qsType_3'
import qsType4 from '@/components/common/paperQuestion/qsType_4'
import qsType5 from '@/components/common/paperQuestion/qsType_5'
import qsType9 from '@/components/common/paperQuestion/qsType_9'
import qsType12 from '@/components/common/paperQuestion/qsType_12'
import qsType13 from '@/components/common/paperQuestion/qsType_13'
import qsType16 from '@/components/common/paperQuestion/qsType_16'
import qsType17 from '@/components/common/paperQuestion/qsType_17'
import qsType18 from '@/components/common/paperQuestion/qsType_18'
import qsType19 from '@/components/common/paperQuestion/qsType_19'
import qsType21 from '@/components/common/paperQuestion/qsType_21'
import qsType35 from '@/components/common/paperQuestion/qsType_35'
import qsType36 from '@/components/common/paperQuestion/qsType_36'
import qsType37 from '@/components/common/paperQuestion/qsType_37'
import qsType38 from '@/components/common/paperQuestion/qsType_38'
import qsType40 from '@/components/common/paperQuestion/qsType_40'
import qsType41 from '@/components/common/paperQuestion/qsType_41'
import qsType42 from '@/components/common/paperQuestion/qsType_42'
import qsType1901 from '@/components/common/paperQuestion/qsType_1901'
import bus from '@/common/eventBus'
export default {
  name: 'layoutPaper',
  components: {qsType1, qsType5, qsType3, qsType4, qsType16, qsType38, qsType17, qsType18, qsType12, qsType21, qsType13, qsType36, qsType35, qsType9, qsType19, qsType37, qsType40, qsType41, qsType1901},
  props: {
    paperDetail: {},
    showBtn: {
      default: true
    }
  },
  mounted () {
    let player = document.querySelector('#player')
    player.addEventListener('ended', function () {
      console.log('player on ended')
      bus.$emit('playended')
    })
    player.addEventListener('pause', function () {
      console.log('player on pause')
      bus.$emit('playended')
    })
  }
}
</script>

<style scoped>
  .paper-detail {
    margin: 0 25px 25px 25px;
  }
</style>
