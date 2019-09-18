// 封装axios请求函数
import axios from 'axios'
// 处理安全整数范围问题
import jsonBigInt from 'json-bigint'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})
export default request

request.defaults.transformResponse = [function (data) {
  try {
    // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data) 转换失败报错
    return jsonBigInt.parse(data)
  } catch (err) {
    // 无法转换的数据直接原样返回
    return data
  }
}]
