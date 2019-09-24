<template>
<!-- 搜索详情页 -->
  <div>
    <van-nav-bar
      left-arrow
      :title="`${$route.params.q}的搜索结果`"
      fixed
      @click-left="$router.back()"
    />
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="article in list"
        :key="article.art_id.toString()"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearch } from '../../api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1
    }
  },

  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const { data } = await getSearch({
        page: this.page, // 页数
        perPage: 20, // 每页数量
        q: this.$route.params.q // 搜索关键字
      })
      // 2. 将请求结果保存到当前组件的 list 中
      //   console.log(data)
      const { results } = data.data
      this.list.push(...results)
      // 3. 关闭 loading
      this.loading = false
      // 4. 判断是否已全部加载结束
      if (results.length) {
        // 如果有，更新页码
        this.page++
      } else {
        // 如果没有数据了，则将 finished 设置为 true，不再 onLoad
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-list{
    margin-top: 46px;
}
</style>
