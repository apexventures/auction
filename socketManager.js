const io = require('./app').io;

module.exports = (socket)=> {
    console.log('New client connected');

    // for biding
    socket.on('changeBid', (bid) => {
        io.sockets.emit('changeBid', bid)
    });

    // for messages
    socket.on('chat message', msg=>{
        io.to(msg.receiverSocketId).emit('chat message', msg)
    })

    // when the user is disconnected
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
}