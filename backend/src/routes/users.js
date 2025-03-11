const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/backend/UsersController');
const {validateTeamMember} = require('../utils/Validators')

router.post('/', UsersController.create);
router.get('/', UsersController.getAll);
router.get('/:user_id', UsersController.getOne);
router.put('/:user_id', UsersController.updateOne);
router.delete('/:user_id', UsersController.deleteOne);
router.post('/member', validateTeamMember, UsersController.addTeamMember);



module.exports = router;