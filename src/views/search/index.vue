<template>
    <div>
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
      />
    </form>
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell
        icon="search"
        v-for="item in suggestions"
        :key="item"
        @click="onSearch(item)"
      >
        <div slot="title" v-html="highLight(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <van-cell-group>
      <van-cell title="历史记录">
        <span style="margin-right: 10px;">全部删除</span>
        <span>完成</span>
        <van-icon
          slot="right-icon"
          name="delete"
          style="line-height: inherit;"
        />
      </van-cell>
      <van-cell :title="item" v-for="item in searchHistories" :key="item">
        <van-icon
          slot="right-icon"
          name="close"
          style="line-height: inherit;"
        />
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import { getSuggestions } from '../../api/search'
import { getItem, setItem } from '../../utils/storage'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      suggestions: [],
      //   searchHistories: [] // 存储历史记录
      searchHistories: getItem('search-history') || []// 一开始就要从本地读取历史记录

    }
  },
  methods: {
    // 搜索内容回车/点击跳转
    onSearch (q) {
      // 当按下回车键时就保存历史记录
      // 如果输入框就数据就进行存储，这里取反为空时就返回
      if (!q.trim().length) {
        return
      }
      // 记录历史记录
      const searchHistories = this.searchHistories
      const index = searchHistories.findIndex(item => {
        // 忽略空格、大小写
        return item.trim().toLowerCase() === q.trim().toLowerCase()
      })
      // 如果已存在，则将其移除
      if (index !== -1) {
        searchHistories.splice(index, 1)
      }
      searchHistories.unshift(q)
      // 为了防止刷新丢失历史记录，需要将历史记录保存到本地存储
      setItem('search-history', searchHistories)
    //   this.$router.push({
    //     name: 'search-result',
    //     params: {
    //       q
    //     }
    //   })
    },
    onCancel () {},
    // 高亮显示
    highLight (str) {
      const searchText = this.searchText
      // 根据用户输入的内容创建一个动态的正则表达式
      const reg = new RegExp(searchText, 'gi')
      return str.replace(reg, `<span style="color: red;">${searchText}</span>`)
    }
  },
  watch: {
    // 封装接口，监视搜索文本的变化 -> 发送请求 -> 获取结果 -> 将结果绑定到数据 -> 模板绑定
    async searchText (newValue) {
      if (!newValue.trim().length) { // trim是去除首尾空格的意思
        return
      }
      const { data } = await getSuggestions(newValue)
      //   console.log(data)
      this.suggestions = data.data.options
    }
  }
}

</script>

<style>

</style>
