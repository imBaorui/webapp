<template>
    <div>
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
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
      <van-cell title="hello" v-for="value in 5" :key="value">
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
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      suggestions: []
    }
  },
  methods: {
    onSearch () {},
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
