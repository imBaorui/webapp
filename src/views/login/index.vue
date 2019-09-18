<template>
  <!-- 开始登录页面的布局 -->
  <!-- 先引入需要使用的组件NavBar -->
  <div>
    <van-nav-bar title="登录" />
    <van-cell-group>
      <van-field required clearable label="手机号" placeholder="请输入手机号" />
      <van-field type="password" label="验证码" placeholder="请输入验证码" required />
    </van-cell-group>
    <div class="login-btn">
      <van-button type="info">登录</van-button>
    </div>
  </div>
</template>

<script>
export default {}
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
