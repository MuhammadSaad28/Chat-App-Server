const { Router } = require('express');
const { addMessage, getAllMessages } = require('../controllers/msgController')
const router = Router();
router.post("/addmsg/",addMessage)
router.post("/getmsg/",getAllMessages)


module.exports = router;