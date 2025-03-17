const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/backend/UsersController');
const {validateTeamMember} = require('../utils/validators-util')

router.post('/', UsersController.create);
router.get('/', UsersController.getAll);
router.get('/team', UsersController.getTeamMembers);
router.get('/:userId', UsersController.getOne);
router.put('/:userId', UsersController.updateOne);
router.delete('/:userId', UsersController.deleteOne);
router.post('/team', validateTeamMember, UsersController.addTeamMember);



module.exports = router;