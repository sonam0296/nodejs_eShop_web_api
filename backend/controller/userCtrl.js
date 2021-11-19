const { User } = require("../db/models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.getUserList = async (req, res) => {
    const user = await User.find()
    // .select('name email phone');
    if (!user) {
        res.status(500).json({ success: false })
    }
    res.send(user);
}

exports.getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
        res.status(500).json({
            success: false,
            message: 'The user with given ID was not found'
        })
    }
    res.send(user);
}

exports.isRegister = async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        isAdmin: req.body.isAdmin
    })

    users = await user.save()
    if (!user) {
        return res.status(400).send("User cannot be created!!")
    }
    res.send(user);
}

exports.isLogin = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(400).json({ message: "User not Found" });
        return;
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            process.env.SECRET_TOKEN,
            {
                expiresIn: '1d'
            }
        )
        return res.status(200).json({ user: user.email, token: token })
    } else {
        return res.status(400).json({ message: "Password incorrect" })
    }
}

exports.getUserCount = async (req, res) => {
    const userCount = await User.countDocuments({ count: 'count' })
    if (!userCount) {
        res.status(400).json({ success: false, message: "No User found!!" });
    }
    res.send({ count: userCount });
}

exports.deleteUserById = async (req, res) => {
    User.findByIdAndRemove(req.params.id).then((user) => {
        if (user) {
            res.status(200).json({
                success: true,
                message: "User is Deleted"
            })
        }
        else {
            res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }
    }).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        })
    })
}