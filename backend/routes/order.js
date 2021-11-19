const router = require("express").Router();
const orderCtrl =require("../controller/orderCtrl");
const authMiddleware = require("../middleware/auth");

router.post("/add", orderCtrl.addOrder);

router.put("/update/:id", orderCtrl.updateOrder);

router.get("/", orderCtrl.getOrderList);

router.get("/:id", orderCtrl.getOrderById);
// 
router.delete("/:id", orderCtrl.deleteOrderById);

module.exports = router;