/* 
    - เพื่อให้ทุก route ในโปรเจกต์ตอบกลับ error ด้วยโครงสร้างเดียวกัน
    - แก้ไขทุก route ที่มีอยู่ให้เรียกใช้ฟังก์ชันนี้แทนการเขียน res.status().json() ซ้ำ ๆ
*/

function sendError(res, statusCode, code, message) {
  return res.status(statusCode).json({ error: { code, message } });
}

module.exports = sendError;