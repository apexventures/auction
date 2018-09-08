var express = require('express');
var router = express.Router();
var mongoos = require('mongoose');


// *** Mongoose model for Bid-Data
const chatSchema = mongoos.Schema({
    _id: mongoos.Schema.Types.ObjectId,
    product_id: { type: String },
    sender_id: { type: String },
    receiver_id: { type: String },
    message: { type: String },
    time: { type: String },
    status: { type: String }
});
const Chat = mongoos.model('Chat', chatSchema);


router.get('/', function(req, res) {
    res.send('Chat router is working');
});


router.post('/saveChat', (req, res)=>{
    const chat = new Chat({
        _id: new mongoos.Types.ObjectId(),
        message: req.body.message,
        time: req.body.time,
        product_id: req.body.productId,
        sender_id: req.body.senderId,
        receiver_id: req.body.receiverId,
        status: req.body.status
    });
    chat.save()
    .then(result =>{
        res.status(200).json({
            result
        })
    }).catch(error => {
        res.status(500).json({
            error
        })
    });
});


router.post('/getChat', (req, res)=> {
    Chat.find({
        $or: [
            { $and: [{sender_id: req.body.logedinUserId}, {receiver_id: req.body.productOwnerId}, {product_id: req.body.productId}] },
            { $and: [{sender_id: req.body.productOwnerId}, {receiver_id: req.body.logedinUserId}, {product_id: req.body.productId}] }
        ]
    }).exec().then(messages => {
        res.status(200).json({
            messages
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    });
});


router.post('/find-all-sender-ids', (req, res)=> {
    Chat.find({ product_id: req.body.productId }).distinct('sender_id').exec().then(result =>{
        res.status(200).json({
            result
        })
    }).catch(error =>{
        res.status(500).json({
            error
        })
    });
});


module.exports = router;