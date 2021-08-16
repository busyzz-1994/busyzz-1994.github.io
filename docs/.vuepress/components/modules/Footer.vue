<!--
 * @Author: busyzz
 * @Date: 2021-08-12 23:55:28
 * @Description:
-->
<template>
  <div class="qr-code">
    <img src="~@/assets/max.jpg" alt="-" />
    <div class="back"></div>
  </div>
</template>
<script>
export default {};
</script>

<style scoped lang="stylus">
@import '~@/styles/index.styl';
.qr-code
  text-align center
  img
    width 200px
.back
  background #eee
  height $height;
</style>
