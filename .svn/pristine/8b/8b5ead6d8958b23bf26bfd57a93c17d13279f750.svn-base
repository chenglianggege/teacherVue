<template>
  <div>
    <div @mouseover="toggleShoppingBox" class="shopping-box" v-bind:style="{right: shoppingBox + 'px'}">
      <span class="icon-shopping">
        <span class="shopping-num none" v-show="shoppingNum">{{shoppingNum}}</span>
      </span>
      <p class="shopping-tips" v-show="shoppingNum==0">请添加作业</p>
    </div>
    <div class="shopping-win"  @mouseleave="toggleShoppingWin"  v-bind:style="{right: shoppingWin + 'px'}">
      <div class="shopping-win-title clear">
        已选<span class="shopping-win-num" >{{shoppingNum}}</span>个题目
        <span style="float: right">共计<span class="shopping-win-num">{{shoppingScore}}</span>分</span>
      </div>
      <div class="shopping-win-box">
        <ul>
          <li class="clear" v-for="(item, index) in cart" :key="index">
            <span class="shopping-win-name fl">{{typeof item === 'string' ? item : item.qsTitle}}</span><span @click="removeQs(index)" class="shopping-win-close">
            <span class="icon-homework-close"></span></span></li>
        </ul>
      </div>
      <div style="text-align: center;margin-bottom: 10px">预计<span class="shopping-win-num">{{shoppingDuration}}</span>分钟完成</div>
      <router-link :to="{path: '/teacher/publishConfirm'}"><button class="pub-btn">去布置</button></router-link>
      <button class="pub-clean-btn" @click="clearCart"><span class="icon-clean"></span>清空已选作业</button>
    </div>
  </div>
</template>

<script>
import bus from '@/common/eventBus'
export default {
  name: 'shoppingCart',
  data () {
    return {
      shoppingNum: 0,
      shoppingScore: 0,
      shoppingDuration: 0,
      shoppingBox: 0,
      shoppingWin: -239,
      cart: {}
    }
  },
  methods: {
    toggleShoppingBox () {
      if (this.shoppingNum === 0) {
        return
      }
      this.shoppingBox = -80
      this.shoppingWin = 0
    },
    toggleShoppingWin () {
      this.shoppingBox = 0
      this.shoppingWin = -239
    },
    initCart () {
      let cart = JSON.parse(localStorage.getItem('cart'))
      this.cart = cart || {}
      let qsIds = Object.keys(this.cart)
      this.shoppingNum = qsIds.length
      let qsScore = 0
      let duration = 0
      for (let i in qsIds) {
        let qs = cart[qsIds[i]]
        qsScore += qs.qsScore
        duration += qs.duration
      }
      this.shoppingScore = qsScore
      this.shoppingDuration = Math.ceil(duration / 60000)
    },
    removeQs (qsId) {
      let cart = JSON.parse(localStorage.getItem('cart'))
      cart = cart || {}
      delete cart[qsId]
      localStorage.setItem('cart', JSON.stringify(cart))
      this.cart = cart
      bus.$emit('cart')
    },
    clearCart () {
      localStorage.removeItem('cart')
      bus.$emit('cart')
    }
  },
  mounted () {
    let _this = this
    bus.$on('cart', function () {
      console.log('cart on cart')
      _this.initCart()
    })
  },
  created () {
    this.initCart()
  }
}
</script>

<style scoped>
  .shopping-box {
    width: 80px;
    border: 1px #e7e9eb solid;
    border-right: 0;
    background: #fff;
    padding: 15px 0 8px 0;
    position: fixed;
    right: 0;
    top: 25%;
  }
  .shopping-win {
    width: 239px;
    border: 1px #e7e9eb solid;
    border-right: 0;
    border-radius: 5px;
    background: #fff;
    padding: 11px 10px 11px 12px;
    position: fixed;
    right: -239px;
    top: 25%;
    z-index: 1;
  }
  .shopping-num {
    width: 18px;
    height: 18px;
    background: #f86800;
    border-radius: 100%;
    font-size: 12px;
    color: #fff;
    line-height: 18px;
    text-align: center;
    position: absolute;
    top: -10px;
    right: -10px;
  }
  .shopping-tips {
    font-size: 12px;
    height: 21px;
    line-height: 21px;
    color: #bcbcbc;
    text-align: center;
  }
  .shopping-win-title {
    font-size: 14px;
    color: #555;
    height: 40px;
    line-height: 40px;
    margin-bottom: 7px;
  }
  .shopping-win-num, .shopping-win-time {
    color: #2199de;
  }
  .shopping-win-num, .shopping-win-time {
    color: #2199de;
  }
  .shopping-win-box {
    max-height: 175px;
    overflow-y: auto;
    margin-bottom: 22px;
  }
  .shopping-win-box ul li {
     height: 35px;
     line-height: 35px;
     width: 100%;
     font-size: 14px;
     color: #555;
     position: relative;
   }
  .shopping-win-box ul li .shopping-win-name {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 185px;
    white-space: nowrap;
  }
  .shopping-win-close {
    position: absolute;
    right: 0;
    display: inline-block;
    cursor: pointer;
    height: 100%;
    width: 20px;
  }
  .icon-homework-close {
    display: inline-block;
    position: absolute;
    top: 12px;
    right: 5px;
    width: 9px;
    height: 9px;
    background: url(~@/assets/images/sprite-shopping.png) no-repeat 0 0;
  }
  .shopping-win-close:hover .icon-homework-close{
    background:url(~@/assets/images/sprite-shopping.png) no-repeat -9px 0
  }
  .pub-btn {
    margin: 0 auto;
    width: 100%;
    height: 32px;
    background: #21d180;
    line-height: 32px;
    color: #fff;
    text-align: center;
    border: 0;
    outline: 0;
    border-radius: 5px;
    cursor: pointer;
  }
  .pub-clean-btn {
    margin: 0 auto;
    width: 100%;
    height: 32px;
    background: #fff;
    line-height: 32px;
    color: #bcbcbc;
    text-align: center;
    border: 0;
    outline: 0;
    border-radius: 5px;
    cursor: pointer;
  }
  .icon-clean {
    margin-right: 7px;
    display: inline-block;
    position: relative;
    width: 14px;
    height: 13px;
    background: url(~@/assets/images/sprite-shopping.png) no-repeat -18px 0;
  }
</style>
