// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db =cloud.database()
// 云函数入口函
exports.main = async (event, context)=> {
  let id=event.id;
  try{
    return await db.collection('borrows').doc(id).remove({
      success: console.log,
      fail: console.error
    });
  }catch(e){
    console.error(e)
  }
  };