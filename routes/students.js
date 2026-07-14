const express = require("express");
const router = express.Router();

let students = [
  {
    id: 1,
    name: "สมชาย ใจดี",
    major: "วิทยาการคอมพิวเตอร์",
    email: "somchai@example.com",
    phone: "080-000-0001",
    courseIds: [101, 102],
  },
  {
    id: 2,
    name: "สมหญิง รักเรียน",
    major: "เทคโนโลยีสารสนเทศ",
    email: "somying@example.com",
    phone: "080-000-0002",
    courseIds: [102],
  },
];


/* 1. GET: ดึงรายการนักศึกษาทั้งหมด
    - รองรับการกรองข้อมูลตาม major ผ่าน query string
    เช่น /students?major=วิทยาการคอมพิวเตอร์ */

router.get("/", (req, res) => {
  const { major } = req.query;
  let filteredStudents = students;

  if (major) {
    filteredStudents = students.filter((s) => s.major === major);
    res.status(200).json({ message: "สำเร็จ", data: filteredStudents });
  }

  res.status(200).json({ message: "สำเร็จ", data: students });
});

// 2. GET: ดึงข้อมูลนักศึกษารายบุคคลตาม id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "ไม่พบข้อมูลนักศึกษา" });
  }

  res.status(200).json({ message: "สำเร็จ", data: student });
});

// 2.2 GET: ดึงข้อมูลนักศึกษาทั้งหมด
router.get(":id/full", (req, res) => {
  const id = Number(req.params.id);
  //คำสั่ง find = เป็น array ส่งมาทีละตัว
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "ไม่พบข้อมูลนักศึกษา" });
  }

  //คำสั่ง filter = เป็น array วนลูปทุกตัว กรองข้อมูล เงื่อนไขจริงส่งตัวนั้นกลับมา
  const studentCourses = courses.filter((c) =>
    student.courseIds.includes(c.id), //id=101 includes เอาไอดีจาก courseIds มาตรวจดูใน courses ว่ามีไหมเป็นจริงส่งข้อมูลกลับ
  );

  res.status(200).json({
    message: "สำเร็จ",
    //...student = กระจายทุก attibute ใน student ออกมา
    data: { ...student, courses: studentCourses },
  });
});


/* 3. POST: เพิ่มข้อมูลนักศึกษาใหม่
    - ตรวจสอบ name ต้องเป็นข้อความที่มีความยาวอย่างน้อย 2 ตัวอักษร
    - ถ้ามีนักศึกษาชื่อซ้ำกับข้อมูลที่มีอยู่แล้ว ให้ตอบกลับด้วย Status Code 409 (Conflict) พร้อมข้อความแจ้งเตือน
*/
router.post("/", (req, res) => {
  const { name, major } = req.body;

  if (!name || name.length < 2) {
    return res
      .status(400)
      .json({ message: "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร" });
  }

  if (!major) {
    return res.status(400).json({ message: "กรุณาระบุ major ให้ครบถ้วน" });
  }
  
  const checkStudent = students.find((s) => s.name === name);

  
  if (checkStudent) {
    return res.status(409).json({ message: "นักศึกษาชื่อนี้มีอยู่แล้ว" });
  }
  const newStudent = { id: nextId++, name, major };
  students.push(newStudent);

  res.status(201).json({ message: "เพิ่มข้อมูลสำเร็จ", data: newStudent });
});

// 4. PUT: แก้ไขข้อมูลนักศึกษาทั้งระเบียน
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, major } = req.body;
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "ไม่พบข้อมูลนักศึกษา" });
  }

  if (!name || !major) {
    return res
    .status(400)
    .status(400).json({ message: "กรุณาระบุ major ให้ครบถ้วน" });
  }

  /* ถ้ามีชื่อในidหนึ่ง แล้วจะเพิ่มชื่อเหมือนกัน จะขึ้นแจ้งเตือนว่ามีชื่อนี้แล้ว
    และ ถ้าชื่อคนนั้น id ไม่เท่ากับ id ที่จะแก้ จะขึ้นแจ้งเตือนว่ามีชื่อนี้แล้ว

    เช่น id:1 name:สมชาย แล้ว id ที่จะแก้เป็น id:3 name:สมชาย (แจ้ง409)

  */
  const checkStudent = students.find((s) => s.name === name && s.id !== id);

  if (checkStudent) {
    return res.status(409).json({ message: "นักศึกษาชื่อนี้มีอยู่แล้ว" });
  }

  student.name = name;
  student.major = major;

  res.status(200).json({ message: "แก้ไขข้อมูลสำเร็จ", data: student });
});

// 5. DELETE: ลบข้อมูลนักศึกษา
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "ไม่พบข้อมูลนักศึกษา" });
  }

  students.splice(index, 1);

  res.status(200).json({ message: "ลบข้อมูลสำเร็จ" });
});

module.exports = router;
