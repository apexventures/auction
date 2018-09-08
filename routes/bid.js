var express = require('express');
var router = express.Router();
var mongoos = require('mongoose');


// *** Mongoose model for Bid-Data
const bidSchema = mongoos.Schema({
    _id: mongoos.Schema.Types.ObjectId,
    product_id: { type: String },
    product_title: { type: String },
    user_id: { type: String },
    bid_amount: { type: String },
    bid_time: { type: String },
    userDetails: { type: String }
});
const Bid = mongoos.model('Bid', bidSchema);


router.post('/pdt-biddata',(req, res) => {
    
    // Date formate
    var date = new Date();
    date = new Date(date).toUTCString();
    date = date.split(' ').slice(0, 5).join(' ');
    // Date formate

    const bid = new Bid({
        _id: new mongoos.Types.ObjectId(),
        product_id: req.body.product_id,
        product_title: req.body.productTitle,
        user_id: req.body.user_id,
        bid_amount: req.body.bid_amount,
        bid_time: date,
        userDetails: req.body.userDetails
    });
    bid.save()
    .then(result => {
        res.status(200).json({
            message: 'bid save'
        });
    })
    .catch(error => {
        res.status(500).json({
            error
        });
    });
});

router.post('/pdt-biddata-getdata', (req, res) => {
    Bid.find({product_id: req.body.productId}).sort({"bid_amount":-1}).exec()
    .then(bids => {
        res.status(200).json({
            bids
        })
    }).catch(err => {
        res.status(500).json({
            err
        })
    });
});

router.post('/pdt-get-current-bid-data', (req, res) => {
    Bid.find({ product_id: req.body.productId, bid_amount: req.body.currentBid }).exec()
    .then(bids => {
        res.status(200).json({
            bid: bids[0]
        })
    }).catch(err =>{
        res.status(500).json({
            err
        })
    });
});

router.post('/user-bids', (req, res) => {
    Bid.find({ userDetails: req.body.userId }).exec() //distinct('product_id').
    .then(bids => {
        res.status(200).json({
            bids
        })
    }).catch(err => {
        res.status(500).json({
            err
        })
    })
});

router.get('/', function(req, res) {
  res.status(200).json({
      bid: 'Bid router is working'
  })
});

module.exports = router;
