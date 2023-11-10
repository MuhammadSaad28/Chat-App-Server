const { Router } = require('express');
const { register, login , setAvatar, getAllUsers } = require('../controllers/userController')
const router = Router();
router.post("/register",register)
router.post("/login",login)
router.put("/setavatar/:id", setAvatar);
router.get("/allusers/:id" , getAllUsers)

module.exports = router;