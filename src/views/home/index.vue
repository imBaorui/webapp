<template>
  <div class="home">
    <van-nav-bar fixed>
      <!-- 自定义标题内容 -->
      <van-button
        slot="title"
        round
        size="small"
        type="info"
        class="search"
        @click="$router.push('/search')"
      >搜索</van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs v-model="active" color="#fa9521">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <van-pull-refresh v-model="channel.pullDownLoading" @refresh="onRefresh">
          <van-list
            v-model="channel.loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <!-- 具体的内容 -->
            <van-cell
              v-for="article in channel.articles"
              :key="article.art_id.toString()"
              :title="article.title"
              @click="$router.push({
                name:'article',
                params:{
                  articleId:article.art_id.toString()
                }
              })"
            >
              <div slot="label">
                <!-- 文章图片 -->
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <!-- Vant 提供的一个显示图片组件 -->
                    <van-image height="80" :src="img" lazy-load />
                  </van-grid-item>
                </van-grid>
                <!-- /文章图片 -->

                <!-- 描述信息 -->
                <div class="article-info">
                  <div class="meta">
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <span>{{ article.pubdate | relativeTime }}</span>
                  </div>
                </div>
                <!-- 描述信息 -->
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <div slot="nav-right" class="wap-nav" @click="showOrHidden=true">
        <van-icon name="wap-nav" size="24"></van-icon>
      </div>
    </van-tabs>

    <van-popup
      v-model="showOrHidden"
      round
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '95%' }"
    >
      <!-- 关闭按钮 -->
      <van-cell icon="cross" :border="false" @click="showOrHidden = false" />
      <!-- 我的频道 -->
      <div>
        <van-cell title="我的频道">
          <van-button type="danger" size="mini" @click="isEdit=!isEdit">{{ isEdit ? '完成' : '编辑' }}</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item v-for="channel in channels" :key="channel.id" :text="channel.name">
            <van-icon name="close" v-show="isEdit" class="icon" slot="icon" />
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 频道推荐 -->
      <div>
        <van-cell title="频道推荐"></van-cell>
        <van-grid :gutter="10">
          <van-grid-item
            v-for="channel in remainingChannels"
            :key="channel.id"
            :text="channel.name"
            @click="onAddChannel(channel)"
          />
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 引入全部频道的请求模块
import {
  getUserOrDefaultChannels,
  getAllChannels,
  resetUserChannels
} from '../../api/channels'
import { getArticles } from '../../api/article'
import { mapState } from 'vuex'
import { getItem, setItem } from '../../utils/storage'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 控制当前激活的标签页
      channels: [], // 频道列表
      showOrHidden: false,
      allChannels: [], // 存储所有频道列表
      isEdit: false
    }
  },
  computed: {
    ...mapState(['user']),
    currentChannel () {
      // active 是动态的，active 改变也就意味着 currentChannel 也改变了
      return this.channels[this.active]
    },
    /* 获取剩余的频道 */
    remainingChannels () {
      // 剩余频道 = 所有频道 - 我的频道
      const channels = []
      this.allChannels.forEach(channel => {
        /* 如果我的频道不包含当前遍历频道，那它就是剩余的频道
        find 方法：遍历数组，查找满足 item.id === channel.id 的元素，找到就返回该元素
        如果直到遍历结束都没有，则返回 undefined findIndex 获取满足条件的元素，如果有，则返回该元素对应的索引,如果没有满足的元素，则返回 -1 */
        const index = this.channels.findIndex(item => item.id === channel.id)
        if (index === -1) {
          channels.push(channel)
        }
      })
      return channels
    }
  },

  methods: {
    async loadUserOrDefaultChannels () {
      // 开始的时候还没有考虑频道管理这件事儿，所以为了简单，这里直接获取了所有频道列表
      // const { data } = await getAllChannels()
      // 定制频道的内容数据

      // 有了频道管理这个业务
      let channels = []
      // 1. 如果用户已登录，则请求获取后端存储的用户频道列表
      if (this.user) {
        const { data } = await getUserOrDefaultChannels()
        channels = data.data.channels
      } else {
        // 2. 如果用户没有登录，则查看本地存储是否有频道列表
        const localChannels = getItem('channels')
        // 2.1 如果本地存储有，则获取使用
        if (localChannels) {
          channels = localChannels
        } else {
          // 2.2 如果本地存储没有，则请求获取默认推荐的频道列表
          const { data } = await getUserOrDefaultChannels()
          channels = data.data.channels
        }
      }
      channels.forEach(channel => {
        channel.articles = [] // 频道的文章列表
        channel.loading = false // 频道的上拉加载更多的 loading 状态
        channel.finished = false // 频道的加载结束的状态
        channel.timestamp = null // 用于获取下一页数据的时间戳（页码）
        channel.pullDownLoading = false // 频道的下拉刷新 loading 状态
      })
      this.channels = channels
    },
    async onLoad () {
      // 异步更新数据
      const currentChannel = this.currentChannel
      const { data } = await getArticles({
        channelId: currentChannel.id,
        // 第1页数据传递当前最新时间戳
        // 下一页数据传递上一页返回数据结果中的 pre_timestamp
        timestamp: currentChannel.timestamp || Date.now(),
        withTop: 1
      })
      // 2. 将得到的文章列表添加到当前频道.articles 中
      const { pre_timestamp: preTimestamp, results } = data.data
      // currentChannel.articles.concat(results) // 之前合并数组的方式
      currentChannel.articles.push(...results) // es6 也可以这么玩儿
      // 3. 本次 onLoad 数据加载完毕，将 loading 设置为 false
      currentChannel.loading = false
      if (!preTimestamp) {
        currentChannel.finished = true
      } else {
        // 还有数据，将本次得到的 preTimestamp 存储到当前频道，用于加载下一页数据
        currentChannel.timestamp = preTimestamp
      }
    },
    /**
     * 下拉刷新处理函数
     */
    async onRefresh () {
      // 1. 请求获取文章列表
      const currentChannel = this.currentChannel
      const { data } = await getArticles({
        channelId: currentChannel.id,
        timestamp: Date.now(),
        withTop: 1
      })
      // 2. 将数据添加到当前频道.article数据中（顶部）
      currentChannel.articles.unshift(...data.data.results)
      // 3. 关闭当前频道下拉刷新的 loading 状态
      currentChannel.pullDownLoading = false
      // 4. 提示用户刷新成功
      this.$toast('刷新成功')
    },
    // 获取所有频道
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    // 点击添加频道
    async onAddChannel (channel) {
      // 添加到我的频道
      this.channels.push(channel)
      // 持久化
      if (this.user) {
        // 已登录：请求保存到后端
        // [ { id: 频道id, seq: 序号 }, { id: 频道id, seq: 序号 }, ]
        const channels = []
        // 处理提取要重置的频道列表
        // this.channels.slice(1) 不包括第1个频道（推荐）
        this.channels.slice(1).forEach((item, index) => {
          channels.push({
            id: item.id,
            seq: index + 2
          })
        })
        // 请求重置
        await resetUserChannels(channels)
      } else {
        // 未登录：本地存储
        setItem('channels', this.channels)
      }
    }
  },
  created () {
    this.loadUserOrDefaultChannels()
    this.loadAllChannels()
  }
}
</script>

<style lang="less" scoped>
.home {
  .van-tabs {
    /deep/ .van-tabs__content {
      margin-bottom: 50px;
      margin-top: 90px;
    }
    /deep/ .van-tabs__wrap {
      position: fixed;
      top: 46px;
      z-index: 2;
      left: 0;
      right: 0;
    }
  }
  .article-info {
    .meta span {
      margin-right: 10px;
    }
  }
  .wap-nav {
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: 0.8;
  }
  .icon {
    position: absolute;
    top: -5px;
    right: -5px;
  }
  .search {
    width: 100%;
    border: 0;
    background: rgb(250, 210, 34);
  }
}
</style>
