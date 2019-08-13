<template>
  <el-footer class="foot">
    <div class="footer">
      <p>苏ICP备14042221号 CopyRight ©2016-2019, All Rights Reserved.苏州声通信息科技有限公司</p>
    </div>
  </el-footer>
</template>

<script>

export default {
  name: 'layoutFooter'
}
</script>

<style scoped>
  .foot{
    width: 100%;
    background: #3e3e3e;
    height: 120px !important;

    bottom:0px;
    left:0px;
  }
  .footer{
    text-align: center;
    padding-top: 40px;
    color: #858585;
  }
  .footer a{
    color: #858585;
    text-decoration: none;
    display: inline-block;
    margin:  5px 20px;
  }
</style>
