/* 搜索的请求接口 */
import request from '../utils/request'
export const getSuggestions = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}
