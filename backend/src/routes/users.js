const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/backend/UsersController');
const {validateTeamMember} = require('../utils/validators-util')

router.post('/', UsersController.create);
router.get('/', UsersController.getAll);
router.get('/team', UsersController.getTeamMembers);
router.get('/:user_id', UsersController.getOne);
router.put('/:user_id', UsersController.updateOne);
router.delete('/:user_id', UsersController.deleteOne);
router.post('/team', validateTeamMember, UsersController.addTeamMember);



module.exports = router;