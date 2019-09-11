// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  /**
   * 需要传入： 
   * _id ：找到对应的清单
   * status：修改后的状态：todo：待接单；done：已接单
   */
  console.log(event)
  result = await db.collection('umbrellas').doc(event._id)
  .update({
    data: {
      status: event.status, // 更新状态
      receiver: event.receiver // 接单者的openid
    }
  })
  return result
}