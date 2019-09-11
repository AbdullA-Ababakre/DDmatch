// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
 
  result=await db.collection('borrows').add({
    data: {
      borrowUser:event.user,
      borrowTime:event.borrowTime,
      borrowName:event.borrowName,
      borrowPhone:event.borrowPhone,
      borrowCard:event.borrowCard,
      borrowLocation:event.borrowLocation
    }
  });
  return result;
}
