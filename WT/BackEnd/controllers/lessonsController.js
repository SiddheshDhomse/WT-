const Lessons = require('../models/Lessons');
const asyncHandler = require('express-async-handler');

const addLesson = asyncHandler(async (req, res) => {
    const { lessonId, lessonName, description, subscriptionType } = req.body;

    if (!lessonId || !lessonName || !description || !subscriptionType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const duplicate = await Lessons.findOne({ lessonId: lessonId, subscriptionType: subscriptionType }).lean();

    if (duplicate) {
        return res.status(409).json({ message: 'Lesson with this ID already exists' });
    }

    const lesson = new Lessons({
        lessonId,
        lessonName,
        description,
        subscriptionType,
    });

    await lesson.save();

    res.status(201).json({ message: 'Lesson added successfully', lesson });
});


const getLessonsByType = asyncHandler(async (req, res) => {
    const { type } = req.params;
    const lessons = await Lessons.find({ subscriptionType: type }).exec();

    if (!lessons?.length) {
        return res.status(400).json({ message: `No ${type} Lessons Found` });
    }

    res.json(lessons);
});

// Exported routes
module.exports = {
    addLesson,
    getLessonsByType
}