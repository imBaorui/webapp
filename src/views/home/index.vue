<template>
  <div class="home">
    <van-nav-bar title="首页" />
       <!-- 频道列表 -->
    <van-tabs v-model="active" color="#fa9521" ellipsis='false'>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">{{ item.name }}</van-tab>
    </van-tabs>
  </div>
</template>

<script>
// 引入全部频道的请求模块
import { getAllChannels } from '../../api/channels'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 控制当前激活的标签页
      channels: [] // 频道列表
    }
  },
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.channels = data.data.channels
    }
  },
  created () {
    this.loadAllChannels()
  }
}
</script>

<style lang="less" scoped>
</style>
