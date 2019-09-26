/* 用户相关请求模块 */
import request from '../utils/request'
// 这里利用解构赋值来获取login传入的参数里的一些数据，这里再组件中使用的时候传入this.user
export const login = ({ mobile, code }) => {
  /* 将之前封装的axios请求重新拿到这里再次优化 */
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}

// 关注用户
export const followUser = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// 取消关注用户
export const unFollowUser = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
