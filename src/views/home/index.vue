<template>
  <div class="home">
    <van-nav-bar title="首页" />
       <!-- 频道列表 -->
    <van-tabs v-model="active" color="#fa9521">
      <van-tab title="标签 1">内容 1</van-tab>
      <van-tab title="标签 2">内容 2</van-tab>
      <van-tab title="标签 3">内容 3</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'HomeIndex'
}
</script>

<style lang="less" scoped>
</style>
