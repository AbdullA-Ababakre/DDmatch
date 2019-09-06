// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('borrows').where({
      borrowName:event.borrowName,
      borrowPhone:event.borrowPhone,
      borrowCard: event.borrowCard
    })
    .get()
  } catch (e) {
    console.error(e)
  }
}
