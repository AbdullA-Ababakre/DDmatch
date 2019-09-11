// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {

  result = await db.collection('umbrellas').add({
    data: {
      user: event.user, // 发布者
      start: event.start, // 起点
      end: event.end, // 终点
      link: event.link, // 联系方式
      money: event.money, // 报酬
      sex: event.sex, // 性别
      start_time: event.start_time, // 出发时间
      receiver: "",
      status: "todo" // 状态，新创建的必然是待接单
    }
  }) 
  return result
}