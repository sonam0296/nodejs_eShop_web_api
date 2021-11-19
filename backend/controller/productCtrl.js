const Product = require("../db/models/products");
const { Category } = require("../db/models/category");
const mongoose = require("mongoose");

exports.getProductList = async (req, res) => {

    // access the value from query params i.e localhost:4002/api/v1/poducts?categories=1222,2222
    
    let filter = {};
    if (req.query.categories) {
        filter = {category: req.query.categories.split(',')}
    }

    const products = await Product.find(filter).populate('category');
    // .select('name image description -_id');
    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send(products);
}

exports.getProductById = async (req, res) => {
    const products = await Product.findById(req.params.id).populate('category');
    if (!products) {
        res.status(500).json({ success: false, message: "No Product found with this ID" });
    }
    res.send(products);
}

exports.isAddProduct = async (req, res) => {

    const category = await Category.findById(req.body.category)
    if (!category) {
        res.status(400).send('The category with given ID was not found')
    }

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        category: req.body.category,
        price: req.body.price,
        image: req.body.image,
        images: req.body.images,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    products = await product.save();
    if (!products) {
        res.status(400).json({ message: "The product cannot be created" });
        return;
    }
    res.send(product)

}

exports.isUpdateProduct = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('The product with given ID was not found')
    }
    const category = await Category.findById(req.body.category)
    if (!category) {
        res.status(400).send('The category with given ID was not found')
    }

    const product = await Product.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            brand: req.body.brand,
            category: req.body.category,
            price: req.body.price,
            image: req.body.image,
            images: req.body.images,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {
            new: true
        })
    if (!product)
        return res.status(400).send("Product cannot be updated");

    res.send(product);
}

exports.deleteProductById = async (req, res) => {
    Product.findByIdAndRemove(req.params.id).then((product) => {
        if (product) {
            res.status(200).json({
                success: true,
                message: "Product is Deleted"
            })
        }
        else {
            res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
    }).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        })
    })
}

exports.getProductCount = async (req, res) => {
    const productCount = await Product.countDocuments({ count: 'count' })
    if (!productCount) {
        res.status(400).json({ success: false, message: "No Product found!!" });
    }
    res.send({ count: productCount });
}

// all fetaureed products
exports.getFeaturedProducts = async (req, res) => {
    const featuredProducts = await Product.find({ isFeatured: true })

    if (!featuredProducts) {
        res.status(400).json({ success: false, message: "No Product found!!" });
    }
    res.send(featuredProducts);
}

// featured products with limitation
exports.getFeaturedProductsByCount = async (req, res) => {

    const count = req.params.count ? req.params.count : 0;

    // +count is written because limit takes number as parameter 
    const featuredProducts = await Product.find({ isFeatured: true }).limit(+count)

    if (!featuredProducts) {
        res.status(400).json({ success: false, message: "No Product found!!" });
    }
    res.send(featuredProducts);
}
