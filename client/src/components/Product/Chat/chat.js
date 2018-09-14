import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../../store';
import { RECEIVER_ID, CHAT_BOX, MESSAGE_REMOVE } from '../../../actions/types';
import { updateChat } from '../../../actions/chatBoxAction';
import { socket } from '../../../socketClient';
import ChatBox from './chatBox';
import './chat.css';


class Chat extends Component {
  constructor(props){
    super(props);

    this.state={
      input:'',
      oldMessages:[],
      messages:[],
      receiverSocketId: '',
      collapse: true
    };
    
    socket.on('chat message', (msg)=>{
      if(msg.productId === this.props.productId) {
        store.dispatch(updateChat(msg));
      }
      // if(this.props.collapse === false && this.props.userIdRedux === msg.receiverId) {
        // this.openNotification(msg.message);
      // }
    });
  }

  componentWillUnmount = () => {
    store.dispatch({
      type: MESSAGE_REMOVE,
      messages: []
    })
  }

  componentDidMount = () => {
    if(store.getState().authentication.accountType !== 'business') {
      store.dispatch({
        type: RECEIVER_ID,
        receiverId: this.props.productOwnerId
      });
      sessionStorage.setItem('receiverId', this.props.productOwnerId);
    }
  }

  fetchReceiverSocketId = (e)=>{
    e.preventDefault();
    let receiverId = {
      receiverId: this.props.receiver
    };
    fetch('/users/receiver-socket-id', {
      method: 'POST',
      headers:{
        'content-type': 'application/json'
      },
      body: JSON.stringify(receiverId)
    })
    .then(res => res.json())
    .then(res => {
      this.setState({ receiverSocketId: res.result.socketId }, ()=>{
        this.submitHandler();
      })
    })
    .catch(err => {
      console.log('React error: fetchReceiverSocketId - ', err);
    });
  }

  submitHandler = (e)=>{
    if (!this.state.input.length) { return }
    let chatData = {
      message: this.state.input,
      productId: this.props.productId,
      time: new Date().toLocaleTimeString(),
      senderId: store.getState().authentication.userDetails,
      receiverId: this.props.receiver,
      receiverSocketId: this.state.receiverSocketId
    };

    this.chatSave();
    store.dispatch(updateChat(chatData));
    this.setState({input:''})
    socket.emit('chat message', chatData);
  }

  chatSave = ()=>{
    const chatData = {
      message: this.state.input,
      productId: this.props.productId,
      time: new Date().toLocaleTimeString(),
      senderId: store.getState().authentication.userDetails,
      receiverId: this.props.receiver,
      status: 'sent'
    };
    fetch('/chat/saveChat', {
      method: 'POST',
      headers:{
        'content-type': 'application/json'
      },
      body: JSON.stringify(chatData)
    })
    .then(res =>{
      if(res.status === 200){
        console.log('save to database');
      }
    }).catch(err =>{
      console.log('React error: saveChat - ',err);
    });
  }

  onChangeHandler = (e)=>{
    this.setState({ [e.target.name]: e.target.value });
  }

  clickEvent =()=> {
    this.setState({ collapse: !this.state.collapse});
    if(this.state.collapse === true) {
      store.dispatch({
        type: CHAT_BOX,
        collapse: false
      })
    } else {
      store.dispatch({
        type: CHAT_BOX,
        collapse: true
      })
    }
  }

  render() {
    const chatTitle = <div>
      {
        this.props.receiverName
        ?
        <span>{this.props.receiverName}</span>
        :
        <span>Product owner</span>
      }
    </div>;
    return (
      <div>
        {
        this.props.chatShow
        ?
          <ChatBox
            collapse={this.state.collapse}
            clickEvent={this.clickEvent}
            chatTitle={chatTitle}
            dismissChatBox={this.props.dismissChatBox}
            messages={this.state.messages}
            oldMessages={this.props.oldMessages}
            productOwnerId={this.props.productOwnerId}
            fetchReceiverSocketId={this.fetchReceiverSocketId}
            input={this.state.input}
            onChangeHandler={this.onChangeHandler}
          />
        :
        null
      }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  receiver: state.chatReducer.receiverId,
  receiverName: state.chatReducer.receiverName,
  collapse: state.chatReducer.collapse,
  userIdRedux: state.authentication.userDetails
});

export default connect(mapStateToProps,{})(Chat);