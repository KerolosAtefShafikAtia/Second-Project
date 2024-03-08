const adminOpCourseModel = require("../models/adminOpCourseModel");
const Joi = require('joi');
const store = (req, res) => {
    const schema = Joi.object({
        courseName: Joi
            .string()
            .min(5)
            .required(),
        courseCategory: Joi
            .string()
            .min(3)
            .required(),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const formattedErrors = error.details.map((detail) => ({
            field: detail.context.label,
            message: detail.message,
        }));
        return res.status(400).json({ errors: formattedErrors });
    }
    adminOpCourseModel.checkCourseNameDuplication(req.body.courseName)
        .then(oneCourse => {
            if (oneCourse.length != 0) {
                return res.status(400).json({ errors: 'course name reserved .' });
            }
            else {
                adminOpCourseModel.store(req.body)
                    .then(error => {
                        if(error){
                            return res.status(500).json({ errors: 'server error .' });
                        }
                        else{
                            return res.status(200).json({ storeNewCourse: 'done' });
                        }                        
                    });                
            }
        });
}
const update = (req, res) => {
    const courseId = req.params.courseId;
    const schema = Joi.object({
        courseName: Joi.string().min(5),
        courseCategory: Joi.string().min(3),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const formattedErrors = error.details.map((detail) => ({
            field: detail.context.label,
            message: detail.message,
        }));
        return res.status(400).json({ errors: formattedErrors });
    }
    adminOpCourseModel.checkCourseById(courseId)
        .then(existingCourse => {
            if (existingCourse.length === 0) {
                return res.status(404).json({ errors: 'Course not found.' });
            } else {
                if (req.body.courseName && req.body.courseName !== existingCourse[0].courseName) {
                    adminOpCourseModel.checkCourseNameDuplication(req.body.courseName)
                        .then(duplicateCourse => {
                            if (duplicateCourse.length !== 0) {
                                return res.status(400).json({ errors: 'Course name reserved.' });
                            } else {
                                adminOpCourseModel.update(courseId, req.body)
                                    .then(error => {
                                        if (error) {
                                            return res.status(500).json({ errors: 'Server error.' });
                                        } else {
                                            return res.status(200).json({ updateCourse: 'Done' });
                                        }
                                    });
                            }
                        });
                } else {
                    adminOpCourseModel.update(courseId, req.body)
                        .then(error => {
                            if (error) {
                                return res.status(500).json({ errors: 'Server error.' });
                            } else {
                                return res.status(200).json({ updateCourse: 'Done' });
                            }
                        });
                }
            }
        });
};
const destroy = (req, res) => {
    const courseId = req.params.courseId;
    adminOpCourseModel.checkCourseById(courseId)
        .then(course => {
            if (course.length === 0) {
                return res.status(404).json({ errors: 'Course not found.' });
            } else {
                adminOpCourseModel.destroy(courseId)
                    .then(error => {
                        if (error) {
                            return res.status(500).json({ errors: 'Server error.' });
                        } else {
                            return res.status(200).json({ deleteCourse: 'Done' });
                        }
                    });
            }
        });
};
module.exports = {
    store,
    update,
    destroy
}