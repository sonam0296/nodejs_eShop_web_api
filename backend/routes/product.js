const router = require("express").Router();
const productCtrl =require("../controller/productCtrl");
const authMiddleware = require("../middleware/auth");

router.post("/add",
// authMiddleware, 
productCtrl.isAddProduct);

router.post("/update/:id",
// authMiddleware, 
productCtrl.isUpdateProduct);

router.get("/",
// authMiddleware, 
productCtrl.getProductList);

router.get("/:id",
// authMiddleware, 
productCtrl.getProductById);

router.delete("/:id",
// authMiddleware, 
productCtrl.deleteProductById);

router.get("/get/count",
// authMiddleware,
productCtrl.getProductCount);

router.get("/get/featured",
// authMiddleware, 
productCtrl.getFeaturedProducts);

router.get("/get/featured/:count",
// authMiddleware, 
productCtrl.getFeaturedProductsByCount);


module.exports = router;