const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


//nodemailer 
// const nodemailer = require("nodemailer");


const app = express()
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false })) for from
app.use(cors())

require('dotenv').config()
const port = process.env.PORT || 5055

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@cluster0.6gyok.mongodb.net/${process.env.DB_DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db(`${process.env.DB_DB_NAME}`).collection(`${process.env.DB_DB_PRODUCT}`);
  const ordersCollection = client.db(`${process.env.DB_DB_NAME}`).collection(`orders`); //for orders product
// create product
app.post("/addProduct",(req , res)=>{
  const product = req.body
  collection.insertMany(product)
  .then(result =>{
    console.log(result)
  })
})

// read product 

app.get("/products",(req , res)=>{
  collection.find({})
  .toArray((err , doc)=>{
    res.send(doc)
  })
})

// find single data 

app.get("/product/:key",(req , res)=>{
  collection.find({key:req.params.key})
  .toArray((err , doc)=>{
    res.send(doc[0])
  })
})

// find some data 
app.post("/productByKeys",(req , res)=>{
  const productKey = req.body
  collection.find({key:{ $in: productKey}})
  .toArray((err , doc)=>{
    res.send(doc)
  })
})


// post data in orders product 

app.post("/addOrder",(req , res)=>{
  const orderProduct = req.body
  ordersCollection.insertOne({order:orderProduct})
  .then(result =>{
    res.send(result.insertedCount > 0)
  })
})

});


app.listen(port)