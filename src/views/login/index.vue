<template>
  <!-- 开始登录页面的布局 -->
  <!-- 先引入需要使用的组件NavBar, Field, CellGroup, Cell -->
  <div>
    <van-nav-bar title="登录" />
    <van-cell-group>
      <van-field v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号" />
      <van-field v-model="user.code" type="password" label="验证码" placeholder="请输入验证码" required />
    </van-cell-group>
    <div class="login-btn">
      <van-button type="info" @click="onlogin">登录</van-button>
    </div>
  </div>
</template>

<script>
// import request from '../../utils/request'
import { login } from '@/api/user'
export default {
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    // 这种方法不介意使用
    // async onlogin () {
    //   const { data } = await request({
    //     method: 'POST',
    //     url: '/app/v1_0/authorizations',
    //     data: this.user
    //   })
    //   // 根据结果进行后续处理
    //   console.log(data)
    // }
    async onlogin () {
      try {
        const { data } = await login(this.user)
        console.log(data)
        this.$toast.success('登录成功')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.login-btn{
    padding: 20px;
    .van-button{
        width: 100%;
        background-color: rgb(95, 95, 94);
        border: 0;
        border-radius: 5px;
    }
}
</style>
