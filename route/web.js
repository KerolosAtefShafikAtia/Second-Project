const express = require('express');
const webRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const authController = require('../controllers/authController');

const adminOpStudentController = require('../controllers/adminOpStudentController');
const adminOpCourseController = require('../controllers/adminOpCourseController');
const studentController = require('../controllers/studentController');

/* -------------- parse of form ------------------- */
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img/uploades/");
    },
    filename: (req, file, cb) => {
        if(file){
            cb(null, Date.now() + path.extname(file.originalname))
        }
    }
});

const upload = multer({
    storage: storage
});

/* -------------- route roles ------------------------ */

webRouter.post('/signin', (req, res) => {
    authController.signin(req, res);
});


//////////////   admin end Points   /////////

webRouter.post('/signup',(req, res) => {
    authController.signup(req, res);
});
webRouter.post('/admin/student/search/:partOfStudentName', authController.verifySigninAdmin, (req, res) => {
    adminOpStudentController.searchStudent(req, res);
});
webRouter.post('/admin/course/store', authController.verifySigninAdmin, (req, res) => {
    adminOpCourseController.store(req, res);
});
webRouter.get('/admin/course/updateForm/:id',authController.verifySigninAdmin, (req, res) => {
    adminOpCourseController.updateForm(req, res);
});
webRouter.post('/admin/course/update',authController.verifySigninAdmin, (req, res) => {
    adminOpCourseController.update(req, res);
});
webRouter.post('/admin/course/destroy/:id', authController.verifySigninAdmin, (req, res) => {
    adminOpCourseController.destroy(req, res);
});
webRouter.post('/admin/student/storeCourseDegree', authController.verifySigninAdmin, (req, res) => {
    adminOpStudentController.storeCourseDegree(req, res);
});
webRouter.post('/admin/student/showCourses/:studentId', authController.verifySigninAdmin, (req, res) => {
    adminOpStudentController.showCourses(req, res);
});
webRouter.put('/admin/course/update/:courseId', authController.verifySigninAdmin, (req, res) => {
    adminOpCourseController.update(req, res);
});
webRouter.delete('/admin/course/destroy/:courseId', authController.verifySigninAdmin, (req, res) => {
    adminOpCourseController.destroy(req, res);
});


//////////////   students end Points   /////////

webRouter.post('/student/showCourses', authController.verifySigninStudent, (req, res) => {
    studentController.showCourses(req, res);
});

webRouter.post('/testSignin', (req, res) => {
    res.send('you are signin and can get your request');
}); 



module.exports = webRouter;