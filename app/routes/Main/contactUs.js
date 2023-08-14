const express = require("express"),
router=express.Router();

const controller= require("../../controllers/Main/contactUs");

router.post("/add",controller.addForm);
router.put("/edit",controller.editForm)
router.delete("/delete",controller.deleteForm)
router.get("/getAll",controller.getAllForm)
router.get("/getById",controller.getFormById)


module.exports=router