const router = require('express').Router();
const itemController = require("../controllers/item.controller");
//For Sinistre
router.post("/addTeacher", itemController.addTeacher);
router.post("/addClasses", itemController.addClasses);
router.get("/getTeacher",itemController.getTeachers)
router.get("/getClasses",itemController.getClasses)
router.get("/classeinformation/:id",itemController.classeinformation)
router.get("/ClassesList/:teacher_id/:groupnumber", itemController.ClassesList);
///////////////////////////////////////////////////////////
router.post("/addStudent", itemController.addStudent);
router.post("/addClasseStd", itemController.addClasseStd);
router.post("/PresenceStd", itemController.PresenceStd);
router.get("/getStudent", itemController.getStudent);
router.get("/getStudentbyId/:id", itemController.getStudentbyId);


module.exports = router;
