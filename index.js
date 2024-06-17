const port = 5000;
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const path = require('path')
const cors = require('cors');



app.use(express.json())
app.use(cors())

// Database Connection With MongoDB 
mongoose.connect("mongodb+srv://kazibilasi:lLEhg5CwQVbV2Iq5@cluster0.wlb5y25.mongodb.net/e-commerce")

// API Creation

app.get("/", (req, res)=>{
    res.send('Express App is Running')
})

// image storage engine

const storage = multer.diskStorage({
    destination : './upload/images',
    filename:(req,file,cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}}`)
    }
})

const upload = multer({storage:storage})
// creating upload endpoint for images
app.use('/images', express.static('upload/images'))
app.post('/upload', upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for creating Products
const Product = mongoose.model("Product", {
   id:{
    type: Number,
    required: true,
   } ,
   name:{
    type:String,
    required:true,
   },
   image:{
    type:String,
    required:true,
   },
   category:{
    type:String,
    required:true,
   },
   new_price:{
    type:Number,
    required:true,
   },
   old_price:{
    type:Number,
    required:true,
   },
   date:{
    type:Date,
    default:Date.now,
   },
   available:{
    type: Boolean,
    default:true,
   }
})


app.post('/addProduct', async (req, res)=>{
    const product = new Product({
        id:req.body.id,
        name: req.body.name,
        image:req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price:req.body.old_price
    })
    console.log(product)
    await product.save()
    console.log('Saved')
    res.json({
        success:true,
        name:req.body.name,
    })
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port" +  port)
    }else{
        console.log("Error: " +error)
    }
})