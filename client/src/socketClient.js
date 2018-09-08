import socketClient from 'socket.io-client';
import { notification } from 'antd';
import store from './store';

var socket = socketClient('http://localhost:8812');

var collapse;

var socketConnection = (userId)=> {
  socket = socketClient('http://localhost:8812');
  socket.on('connect', ()=>{
    updateSenderSocketId(socket.id, userId);
  });

  socket.on('chat message', (msg)=>{
    if(!collapse) {
      openNotification(msg.message);
    }
  });
}

var updateSenderSocketId = (socketId, userId)=>{
    let socketdata = {
      userId, socketId
    };
    fetch('http://localhost:8812/users/edit-socketid', {
      method: 'POST',
      headers:{
        'content-type': 'application/json'
      },
      body: JSON.stringify(socketdata)
    })
    .then(res => {
      if(res.status === 200){
        console.log('Send socket id save to database');
      }
    }).catch(err => {
      console.log('React error: edit-socketid - ', err);
    });
}

var openNotification = (msg) => {
  notification.open({
    message: 'New Message',
    description: msg,
  });
}

store.subscribe( ()=> {
  collapse = store.getState().chatReducer.collapse;
})

export  { socketConnection, socket };