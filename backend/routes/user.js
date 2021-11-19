const router = require("express").Router();
const userCtrl =require("../controller/userCtrl");
const authMiddleware = require("../middleware/auth");

router.post("/register", userCtrl.isRegister);

router.post("/login", userCtrl.isLogin);

router.get("/", userCtrl.getUserList);

router.get("/:id", userCtrl.getUserById);

router.get("/get/count", userCtrl.getUserCount);

router.delete("/:id", userCtrl.deleteUserById);

module.exports = router;