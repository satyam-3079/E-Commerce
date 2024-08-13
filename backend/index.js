const express = require('express')
const app = express();
const bcrypt = require('bcrypt')

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const multer = require('multer')

const path = require('path')
const cors = require('cors');
const { deflate } = require('zlib');
const dotenv = require('dotenv')

app.use(express.json())
dotenv.config()
const port = process.env.PORT
app.use(cors({
        origin: ['http://localhost:3000','https://e-commmerce-frontend1.vercel.app'],
        credentials:true
}));

mongoose.connect(process.env.MONGO_URL)

app.get("/", (req, res) => {
    res.send("express app is running")
})


const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

app.use('/images', express.static('upload/images'))

app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `https://e-commerce-backend-xgq6.onrender.com/images/${req.file.filename}`
    })
})

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        dedault: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
})

//ADD PRODUCT
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        old_price: req.body.old_price,
    });
    await product.save();
    res.json({
        success: true,
        name: req.body.name
    })
})

//DELETE PRODUCT
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({
        success: 1,
        name: req.body.name
    })
})

//Creating api for getting all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    res.json(products)
})

//Schema for creating User Model

const Users = mongoose.model('Users', {
    username: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,

    },
    cartData: {
        type: Object
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ["admin", "user"]
    }

})

//creating end point for registering user
app.post('/signup', (req, res) => {

    const { password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let check = await Users.findOne({ email: req.body.email })
            if (check) {
                res.status(400).json({ success: false, errors: "existing user found with same details" })
            }
            let cart = {};
            for (let i = 0; i < 300; i++) {
                cart[i] = 0;
            }
            const user = new Users({
                username: req.body.username,
                email: req.body.email,
                password: hash,
                cartData: cart,
                role: "user"
            })
            await user.save();
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, process.env.JWT_SECRET);
            user.token=token
            res.json({
                success: true,
                token,
                user: "user"
            })
        })
    })

})

//creating endpoint for user login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user.role === "admin") {
        res.send({ success: false, error: "wrong details" })
    }
    if (user) {
   
        bcrypt.compare(req.body.password, user.password, async(err, result) => {
            if (result) {
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const token = jwt.sign(data,process.env.JWT_SECRET)
                res.json({ success: true, token, user: "user" });
            }
            else {
                res.json({ success: false, error: "wrong details" })
            }
        });
        
    }
    else {
        res.json({ success: false, error: "Please Signup" })
    }
})

//creating end point for registering user
app.post('/signupasadmin', async (req, res) => {
    let siz = await Users.find({ role: "admin" })
    if (siz.length > 0) {
        res.status(400).json({ success: false, errors: "There can be only one admin" })
    }
    const { password } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let check = await Users.findOne({ email: req.body.email })
            if (check) {
                res.status(400).json({ success: false, errors: "existing user found with same details" })
            }
            const user = new Users({
                username: req.body.username,
                email: req.body.email,
                password: hash,
                role: "admin"
            })
            await user.save();
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, process.env.JWT_SECRET);
            res.json({
                success: true,
                token,
                user: "admin"
            })
        })
    })

})

//creating endpoint for user login
app.post('/loginasadmin', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user.role === "user") {
        res.json({ success: false, error: "wrong details" })
    }
    else {
        if (user) {
            bcrypt.compare(req.body.password, user.password, async (err, result) => {
                if (result) {
                    const data = {
                        user: {
                            id: user.id
                        }
                    }
                    const token = jwt.sign(data, process.env.JWT_SECRET)
                    res.json({ success: true, token, user: "admin" });
                }
                else {
                    res.json({ success: false, error: "wrong details" })
                }
            });

            
        }
        else {
            res.json({ success: false, error: "Please Signup" })
        }
    }

})

//creating end point for new collection data
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newCollection = products.slice(1).slice(-8);
    res.send(newCollection)
})

//creating end point for popular in woman section
app.get('/popularinwoman', async (req, res) => {
    let products = await Product.find({ category: 'women' });
    let popular_in_woman = products.slice(0, 4);
    res.send(popular_in_woman)
})

//creating a middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please Authenticate using valid Token" })
    } else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data.user;
            next()
        } catch (err) {
            res.status(401).send({ errors: 'Please authenticate using a valid token' })
        }
    }
}

//creating end point for adding product in cart
app.post('/addtocart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id })
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })
    res.json({success:true})
})

//creating endpoint to remove product from cart data
app.post('/removefromcart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id })
    if (userData.cartData[req.body.itemId] > 0)
        userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })
    res.json({success:true})
})

//creating endpoint to get cart data
app.post('/getcart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id })
    if (userData)
        res.json(userData.cartData)
})

app.listen(port, (err) => {
    if (!err) {
        console.log("server run on port" + port)
    }
    else {
        console.log("error" + err)
    }
})
