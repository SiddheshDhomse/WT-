const express = require('express');
const router = express.Router();
const lessonsAuth = require('../controllers/lessonsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)


router.route('/')
    .post(lessonsAuth.addLesson)

router.route('/:type')
.get(lessonsAuth.getLessonsByType);



module.exports = router;
