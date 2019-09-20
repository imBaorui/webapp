<template>
  <!-- 开始登录页面的布局 -->
  <!-- 先引入需要使用的组件NavBar, Field, CellGroup, Cell -->
  <div>
    <van-nav-bar title="登录" />
    <!-- 表单验证 -->
    <!-- ValidationObserver组件会渲染一整个form表单  通过ref调用这个组件的方法validate来进行js验证 -->
    <ValidationObserver tag="form" ref="loginForm">
      <!-- ValidationProvider是验证插件提供的一个全局组件 -->
      <!-- rules='required' 配置验证规则 -->
      <!-- v-slot="{ errors }"获取验证相关的结果参数 -->
      <ValidationProvider tag="div" name="手机号" rules="required|phone" v-slot="{ errors }">
        <van-field v-model="user.mobile" clearable label="手机号" placeholder="请输入手机号" :error-message="errors[0]"/>
      </ValidationProvider>

      <ValidationProvider  tag="div" name="验证码" rules="required" v-slot="{ errors }">
        <van-field v-model="user.code" type="password" label="验证码" placeholder="请输入验证码" :error-message="errors[0]"/>
      </ValidationProvider>
    </ValidationObserver>
    <div class="login-btn">
      <van-button type="info" :loading="isLoginLoading" @click="onlogin">登录</van-button>
    </div>
  </div>
</template>

<script>
// import request from '../../utils/request'
import { login } from '@/api/user'
export default {
  data () {
    return {
      // loading加载
      isLoginLoading: false,
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
        // 表单验证
        const isValid = await this.$refs.loginForm.validate()
        // 如果验证失败就什么都不做
        if (!isValid) {
          return
        }
        // 验证成功就提交表单
        this.isLoginLoading = true // 显示加载态状
        const res = await login(this.user)
        // console.log(data)
        // 调用setUser
        // res.data.data里面有token数据
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登录成功')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        }
      }
      this.isLoginLoading = false
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
