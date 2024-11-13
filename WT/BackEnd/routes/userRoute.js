const express = require('express')
const router = express.Router();
const userController = require('../controllers/usersController')

router.route('/')
    .post(userController.addUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

router.route('/login')
    .post(userController.loginUser)

router.route('/userInfo')
    .post(userController.getUserInfo)

module.exports = router