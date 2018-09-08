var express = require('express');
var router = express.Router();
// new imports
const mongoose = require('mongoose');


// *** Mongoose User Model
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String },
    discription: { type: String },
    price: { type: String },
    productImg: { type: String },
    creationData: { type: String },
    updateDate: { type: String },
    isActive: {type: String },
    bidEndTime: { type: String },
    currentBid: { type: String },
    userId: { type: String },
    productSocketId: { type: String }
});
const Product = mongoose.model('Product', productSchema);



router.post('/add', (req, res) => {
    let imageFile = req.files.file;
    // set image name
    const fileName = Date.now();
    const getFileName = req.body.fileName;
    const imgName = fileName + getFileName;
    const dirName = __dirname.replace('routes','public')
    // console.log(__dirname);
  
    imageFile.mv(`${dirName}/images/${imgName}`, function(err) {
      if (err) {
        return res.status(500).send(err);
      } else {

        // Date formate
        var date = new Date();
        date = new Date(date).toUTCString();
        date = date.split(' ').slice(0, 5).join(' ');
        // Date formate

          const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            discription: req.body.discription,
            price: req.body.price,
            productImg: imgName,
            creationData: date,
            updateDate: date,
            isActive: true,
            bidEndTime: req.body.bidEndTime,
            currentBid: req.body.price,
            userId: req.body.userId
          });
          product.save()
          .then(result => {
              res.status(200).json({
                  message: 'product save to database',
                  product: result
                })
          }).catch(error => {
              res.status(500).json({
                  error: error
              })
            })
        }
    });
})


router.post('/product-detail', (req, res)=> {
    Product.find({ _id: req.body.productId }).exec().then(product => {
        if (product.length === 1) {
            res.status(200).json({
                product
            })
        } else {
            res.status(500).json({
                error: "Product not found."
            })
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    });
});


router.get('/products-for-admin', (req, res)=> {
    Product.find({}).exec().then(products =>{
        res.status(200).json({
            products
        })
    }).catch(error =>{
        res.status(500).json({
            error
        })
    });
})


router.post('/product-history', (req, res)=> {
    Product.find({ userId: req.body.userId }).exec().then(products =>{
        res.status(200).json({
            products
        })
    }).catch(error =>{
        res.status(500).json({
            error
        })
    });
})


router.post('/currentBid-update', (req, res)=> {
    Product.findByIdAndUpdate(req.body.product_id, { $set: { currentBid: req.body.currentBid }}, { new: true }, function (err, product) {
        if (err) return handleError(err);
        res.send(product);
      });
})


router.get('/', function(req, res) {
  Product.find({}).exec().then(products => {
      res.status(200).json({
          products
      })
  }).catch(err => {
      res.status(500).json({
          error: err
      })
  });
});

module.exports = router;
