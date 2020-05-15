const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/user');


router.put('/', userController.verifyLogin);
router.put('/signup', userController.signup);
router.get('/:id', userController.getProfile);
router.post('/:id', userController.updateProfile);
router.get('/:id/activities', userController.getActivities);

module.exports = router;