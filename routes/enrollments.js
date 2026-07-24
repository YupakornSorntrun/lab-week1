const express = require("express");
const router = express.Router();
const sendError = require("../sendError"); // นำเข้าโมดูล sendError

const enrollments = require("../data/enrollmentsData")
const students = require("../data/studentsData")

// 1.1 GET: ดึงรายการลงทะเบียนทั้งหมด
router.get("/enrollments", (req,res)=> {
    res.status(200).json({ message: "สำเร็จ", data: enrollments });
});

// 1.2 GET: ดึงรายการลงทะเบียนตาม id
router.get("/enrollments/:id", (req,res)=> {
    const id = Number(req.params.id);
    const enrollment = enrollments.find((e) => e.id === id);
    if (!enrollment) {
        //ใช้ sendError แทน res.status().json()
        return sendError(res, 404, "ENROLLMENT_NOT_FOUND", "ไม่พบข้อมูลการลงทะเบียน");
    }
    res.status(200).json({ message: "สำเร็จ", data: enrollment });
});

/* 2. POST: เพิ่มรายการลงทะเบียนใหม่ 
    - POST /api/v1/students/{id}/enrollments — ลงทะเบียนรายวิชาใหม่ให้นักศึกษา
*/
router.post("/students/:id/enrollments", (req, res) => {
    const { courseId, enrollmentDate } = req.body;
    

    // ตรวจสอบว่ามีนักศึกษาที่มี id ตรงกับ studentId หรือไม่
    const studentId = Number(req.params.id);
    const student = students.find((s) => s.id === studentId);  

    if (!student) {
        return sendError(res, 404, "STUDENT_NOT_FOUND", "ไม่พบข้อมูลนักศึกษา");
    }

    // ตรวจสอบว่ามี courseId และ enrollmentDate ถูกส่งมาหรือไม่
    if (!courseId || !enrollmentDate) {
        return sendError(res, 400, "BAD_REQUEST", "กรุณาระบุ courseId และ enrollmentDate");
    }

    // ตรวจสอบว่ามีการลงทะเบียนซ้ำหรือไม่ 
    // e.studentId === studentId && e.courseId === courseId คือการตรวจสอบว่ามีการลงทะเบียนของนักศึกษาคนนี้ในรายวิชานี้แล้วหรือไม่
    const existingEnrollment = enrollments.find((e) => e.studentId === studentId && e.courseId === courseId);
    if (existingEnrollment) {
        return sendError(res, 400, "BAD_REQUEST", "นักศึกษานี้ได้ลงทะเบียนรายวิชานี้แล้ว");
    }

    // สร้างรายการลงทะเบียนใหม่
    const newEnrollment = {
        id: enrollments.length + 1, // กำหนด id ใหม่โดยใช้ความยาวของ array + 1
        studentId: studentId,
        courseId: courseId,
        enrollmentDate: enrollmentDate
    };
    enrollments.push(newEnrollment);
    res.status(201).json({ message: "เพิ่มรายการลงทะเบียนสำเร็จ", data: newEnrollment });
});

/* 3. DELETE: ลบรายการลงทะเบียน
    - DELETE /api/v1/students/{id}/enrollments/{courseId} - ยกเลิกการลงทะเบียน 
*/

router.delete("/students/:id/enrollments/:courseId", (req, res) => {
    const studentId = Number(req.params.id);
    const courseId = Number(req.params.courseId);

    // ตรวจสอบว่ามีนักศึกษาที่มี id ตรงกับ studentId หรือไม่
    const student = students.find((s) => s.id === studentId);
    if (!student) {
        return sendError(res, 404, "STUDENT_NOT_FOUND", "ไม่พบข้อมูลนักศึกษา");
    }

    // ตรวจสอบว่ามีรายการลงทะเบียนที่ตรงกับ studentId และ courseId หรือไม่
    const enrollmentIndex = enrollments.findIndex((e) => e.studentId === studentId && e.courseId === courseId);
    if (enrollmentIndex === -1) {
        return sendError(res, 404, "ENROLLMENT_NOT_FOUND", "ไม่พบข้อมูลการลงทะเบียน");
    }

    // ลบรายการลงทะเบียน
    enrollments.splice(enrollmentIndex, 1);
    res.status(200).json({ message: "ลบรายการลงทะเบียนสำเร็จ" });
});



module.exports = router;