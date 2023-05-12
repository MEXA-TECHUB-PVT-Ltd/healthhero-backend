const express = require('express');

const router = express.Router();

const controller = require("../../controllers/Users/userController")
// const auth = require("../../middlewares/auth")


router.post("/register_user" , controller.registerUser);
router.post("/login" , controller.login);
router.put("/updateProfile"  ,  controller.updateProfile);
router.put("/updatePassword" , controller.updatePassword)
router.put("/updateBlockStatus"  ,  controller.updateBlockStatus)
router.get("/view_user_profile"  , controller.viewProfile)
router.get("/getAllUsers"  , controller.getAllUsers)
router.delete("/deleteUser"  , controller.deleteUser)
router.get("/getUsersByMonthAndYear"  , controller.getUsersByMontsAndYear)



router.put("/deleteTemporarily" , controller.deleteTemporarily);
router.put("/recover_record" , controller.recover_record);
router.get("/getAllTrashRecords" , controller.getAllTrashRecords);


module.exports = router;