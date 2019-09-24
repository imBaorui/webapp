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

/* 获取搜索结果 */
export const getSearch = ({
  page,
  perPage,
  q
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params: {
      page, // 页数
      per_page: perPage, // 每页数量
      q // 搜索关键字
    }
  })
}
