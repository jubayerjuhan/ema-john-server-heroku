require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5000;
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5yhrs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority `

app.use(cors());
app.use(bodyParser.json());



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_NAME}`).collection("products");
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  // perform actions on the collection object

  app.post('/addallproducts', (req, res) => {
    const products = req.body;
    console.log(req.body)
    productsCollection.insertMany(products)
      .then((result) => console.log(result))
      .catch((err) => res.send(err))
  })

  app.get('/products', (req, res) => {
    try {
      productsCollection.find({})
        .toArray((error, docs) => {
          res.send(docs)
        })
    } catch (error) {
      res.send(error);
    }
  })

  app.get('/products/:id', (req, res) => {
    try {
      const id = req.params.id;
      productsCollection.find({ key: id })
        .toArray((error, docs) => {
          res.send(docs[0])
        })
    } catch (error) {
      res.send(error);
    }
  })

  app.post('/productsbykey', (req, res) => {
    const productkey = req.body;
    console.log(productkey)
    productsCollection.find({ key: { $in: productkey } })
      .toArray((err, products) => {
        res.send(products)
      })
  })
  app.post('/saveorders', (req, res) => {
    const orderData = req.body;
    console.log(orderData)
    ordersCollection.insertOne(orderData)
      .then(result => {
        console.log(result)
        res.send(result);

      })
      .catch(err => {
        console.log(err)
      })
  })


});

app.listen(port, console.log(
  'Listening to port ' + port
));