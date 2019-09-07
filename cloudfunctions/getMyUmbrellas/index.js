// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.user == "user") { // 获取自己的发布
    result = await db.collection('umbrellas').where({
      user: event.openid,
      // status: event.status // 状态
    }).get()
  } else if (event.user == "receiver") { // 获取自己的接单
    result = await db.collection('umbrellas').where({
      receiver: event.openid,
      // status: event.status // 状态
    }).get()
  }
  
  return result
}
