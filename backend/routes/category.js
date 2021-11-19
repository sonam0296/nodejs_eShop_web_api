const router = require("express").Router();
const categoryCtrl =require("../controller/categoryCtrl");
const authMiddleware = require("../middleware/auth");

router.post("/add",
// authMiddleware, 
categoryCtrl.addcategory);

router.post("/update/:id",
// authMiddleware, 
categoryCtrl.updateCategory);

router.get("/",
// authMiddleware, 
categoryCtrl.getCategoryList);

router.get("/:id",
// authMiddleware, 
categoryCtrl.getCategoryById);

router.delete("/:id",
// authMiddleware, 
categoryCtrl.deleteCategoryById);

module.exports = router;