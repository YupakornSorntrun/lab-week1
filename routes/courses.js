const express = require("express");
const router = express.Router();
const sendError = require("../sendError"); // นำเข้าโมดูล sendError

const courses = require("../data/coursesData")

let nextId = 103;

// 1. GET: ดึงรายการรายวิชาทั้งหมด
router.get("/", (req, res) => {
  res.status(200).json({ message: "สำเร็จ", data: courses });
});

// 2. GET: ดึงข้อมูลรายวิชาตาม id

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const course = courses.find((c) => c.id === id);
  /*course = courses.find((c) => c.id === id); 
    คือ การใช้ฟังก์ชัน find() เพื่อค้นหาวัตถุในอาร์เรย์ courses ที่มี id ตรงกับค่าที่ส่งเข้ามาในพารามิเตอร์ id ของ URL โดยจะคืนค่าของวัตถุที่พบหรือ undefined หากไม่พบ 
    
    และ c.id === id คือ การเปรียบเทียบค่าของ id ของวัตถุ course กับค่าที่ส่งเข้ามาในพารามิเตอร์ id ของ URL 
    โดยใช้ตัวดำเนินการเปรียบเทียบแบบเข้มงวด (strict equality operator) ซึ่งจะคืนค่า true หากทั้งสองค่าตรงกันและมีชนิดข้อมูลเดียวกัน*/

  if (!course) {
    // ใช้ sendError แทน res.status().json()
    return sendError(res, 404, "COURSE_NOT_FOUND", "ไม่พบข้อมูลรายวิชา");
  }

  res.status(200).json({ message: "สำเร็จ", data: course });
});


// 3. POST: เพิ่มข้อมูลรายวิชาใหม่
router.post("/", (req, res) => {
  const { courseName, credit } = req.body;

  if (!courseName || !credit) {
    return sendError(res, 400, "VALIDATION_ERROR", "กรุณาระบุ courseName และ credit ให้ครบถ้วน");
  }

  const newCourse = { id: nextId++, courseName, credit };
  courses.push(newCourse);

  res.status(201).json({ message: "เพิ่มข้อมูลสำเร็จ", data: newCourse });
});

// 4. PUT: แก้ไขข้อมูลรายวิชาทั้งระเบียน
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { courseName, credit } = req.body;
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return sendError(res, 404, "COURSE_NOT_FOUND", "ไม่พบข้อมูลรายวิชา");
  }

  if (!courseName || !credit) {
    return sendError(res, 400, "VALIDATION_ERROR", "กรุณาระบุ courseName และ credit ให้ครบถ้วน");
  }

  course.courseName = courseName;
  course.credit = credit;

  res.status(200).json({ message: "แก้ไขข้อมูลสำเร็จ", data: course });
});

// 5. DELETE: ลบข้อมูลรายวิชาตาม id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = courses.findIndex((c) => c.id === id);

  if (index === -1) {
    return sendError(res, 404, "COURSE_NOT_FOUND", "ไม่พบข้อมูลรายวิชา");
  }

  courses.splice(index, 1);
  /*courses.splice(index, 1); 
  คือ การลบวัตถุในอาร์เรย์ courses ที่มี index ตรงกับค่าที่ได้จากการค้นหา 
  โดย splice(index, 1) หมายถึง ลบวัตถุที่อยู่ที่ index นั้นออก 1 ตัว 
  1ตัวในที่นี้คือ จำนวนวัตถุที่จะลบทั้งหมดในอาร์เรย์ */

  res.status(200).json({ message: "ลบข้อมูลสำเร็จ" });
});

module.exports = router;
