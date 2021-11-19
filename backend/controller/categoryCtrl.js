const { Category } = require("../db/models/category");

exports.getCategoryList = async (req, res) => {
    const category = await Category.find();
    if (!category) {
        res.status(500).json({ success: false })
    }
    res.send(category);
}

exports.getCategoryById = async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) {
        res.status(500).json({
            success: false,
            message: 'The category with given ID was not found'
        })
    }
    res.send(category);
}

exports.addcategory = async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    })
    category = await category.save();
    if (!category) {
        res.status(400).send("Category cannot be created");
        return;
    }
    res.send(category);
}

exports.deleteCategoryById = async (req, res) => {
    Category.findByIdAndRemove(req.params.id).then((category) => {
        if (category) {
            res.status(200).json({
                success: true,
                message: "Category is Deleted"
            })
        }
        else {
            res.status(404).json({
                success: false,
                message: "Category Not Found"
            })
        }
    }).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        })
    })
}

exports.updateCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        {
            new: true
        })
    if (!category)
        return res.status(400).send("Category cannot be created");

    res.send(category);
}
