import bus from '@/common/eventBus'
import studentAnswer from '@/components/common/studentAnswer'
var paperQustionMixin = {
  props: {
    question: {},
    showBtn: {
      default: true
    }
  },
  components: {studentAnswer},
  data () {
    return {
      currentPlayer: '',
      isPlaying: false,
      cart: {},
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      STATIC_URL: '',
      playUrl: ''
    }
  },
  filters: {
    coverToBrTag (text) {
      return text.replace(/\n/g, '<br/>')
    }
  },
  methods: {
    coverToBrTag (text) {
      return text.replace(/\n/g, '<br/>')
    },
    answerOpt (answerCont) {
      let arr = answerCont.split('|')
      if (arr.length === 0) {
        return []
      }
      let rightText = arr.pop()
      let ret = []
      for (let i in arr) {
        ret.push({text: arr[i], is_right: arr[i] === rightText})
      }
      return ret
    },
    audioPlay (source) {
      let player = document.querySelector('#player')
      let src = window.STATIC_URL + source.target.dataset.src
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
      // console.log(player.src)
    },
    publishQuestion (question) {
      let cart = JSON.parse(localStorage.getItem('cart'))
      cart = cart || {}
      if (cart.hasOwnProperty('qsId_' + question.qs_id)) {
        delete cart['qsId_' + question.qs_id]
      } else {
        let qsIds = Object.keys(cart)
        if (qsIds.length >= 10) {
          this.$alert('已经10道题了，一份作业别让学生做太久~~', '提示')
          return
        }
        let duration = 0
        let qsScore = 0
        for (let i in question.info) {
          let info = question.info[i]
          duration += +info.duration
          for (let j in info.items) {
            qsScore += +info.items[j].item_score
          }
        }
        duration += +question.audio_duration
        duration += question.item_num * 1000
        cart['qsId_' + question.qs_id] = {qsId: question.qs_id, qsTitle: question.qs_title, duration: duration, qsScore: qsScore}
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      this.cart = cart
      bus.$emit('cart')
    },
    publishQuestionWithInfo (question, qsInfoIds) {
      let cart = JSON.parse(localStorage.getItem('cart'))
      cart = cart || {}
      if (cart.hasOwnProperty('qsId_' + question.qs_id)) {
        delete cart['qsId_' + question.qs_id]
      } else {
        let qsIds = Object.keys(cart)
        if (qsIds.length >= 10) {
          this.$alert('已经10道题了，一份作业别让学生做太久~~', '提示')
          return
        }
        let duration = 0
        let qsScore = 0
        for (let i in question.info) {
          let info = question.info[i]
          if (!qsInfoIds.length || qsInfoIds.indexOf(info.info_id) >= 0) {
            duration += +info.duration
            for (let j in info.items) {
              qsScore += +info.items[j].item_score
              duration += 1000
            }
          }
        }
        duration += +question.audio_duration
        cart['qsId_' + question.qs_id] = {qsId: question.qs_id, qsTitle: question.qs_title, qsInfoIds: qsInfoIds, duration: duration, qsScore: qsScore}
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      this.cart = cart
      bus.$emit('cart')
    },
    initCart () {
      let cart = JSON.parse(localStorage.getItem('cart'))
      this.cart = cart || {}
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
    this.initCart()
    bus.$on('cart', function () {
      console.log('paper on cart')
      _this.initCart()
    })
  }
}
export default paperQustionMixin
