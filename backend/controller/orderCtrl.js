const { Order } = require("../db/models/order");
const { OrderItem } = require("../db/models/orderItem");

exports.getOrderList = async(req, res)=> {
    const order = await Order.find()
    .populate('user', 'name')
    .sort('dateOrdered');
    if(!order){
        res.status(500).json({success: false})
    }
    res.send(order);
}

exports.getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({path:'orderItems', populate:{path:'product', populate: 'category'}});
    if (!order) {
        res.status(500).json({ success: false, message: "No Order found with this ID" });
    }
    res.send(order);
}

exports.addOrder = async (req, res) => {

    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItems = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        newOrderItems = await newOrderItems.save();

        return newOrderItems._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemsId)=>{
        const orderItem = await OrderItem.findById(orderItemsId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice 
    }))
    const totalPrice = totalPrices.reduce((a,b)=> a + b, 0)
console.log(totalPrice);
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone, 
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();
    if (!order) {
        res.status(400).send("order cannot be created");
        return;
    }
    res.send(order);
} 

exports.updateOrder = async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id,
        {
            status: req.body.status,
        },
        {
            new: true
        })
    if (!order)
        return res.status(400).send("order cannot be created");

    res.send(order);
}

exports.deleteOrderById = async (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(async orderItem=>{
                await OrderItem.findByIdAndDelete(orderItem)
            })
            res.status(200).json({
                success: true,
                message: "Order is Deleted"
            })
        }
        else { 
            res.status(404).json({
                success: false,
                message: "Order Not Found"
            })
        }
    }).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        })
    })
}