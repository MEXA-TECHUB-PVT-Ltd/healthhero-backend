const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/testVoiceController")

router.post("/add_testvoice" , controller.add_testvoice);
router.put("/update_testvoice" , controller.update_testvoice);
router.delete("/deleteTestVoice" , controller.deleteTestVoice);
router.get("/getTestVoice" , controller.getTestVoice);



module.exports = router;