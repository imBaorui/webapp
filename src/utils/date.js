// 专门处理时间的功能模块
import dayjs from 'dayjs'
import toTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // 全局使用中文包
dayjs.locale('zh-cn') // 配置使用中文
dayjs.extend(toTime)// 注册插件
export const relativeTime = time => {
  return dayjs().from(dayjs(time))
}
