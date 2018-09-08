import React, { Component } from 'react';
import { Button, Avatar } from 'antd';
import { connect } from 'react-redux';
import Chat from './chat';
import store from '../../../store';
import { RECEIVER_ID, CHAT_BOX, MESSAGE_REMOVE } from '../../../actions/types';


class ListOfSenderButton extends Component {
    constructor(props){
        super(props);

        this.state={
            userList:[],
            chatShow: false,
            oldMessages:[]
        };
    }

    componentWillMount = () => {
      this.gettingListofSender();
      this.gettingChat();
    }
    
    gettingListofSender = ()=>{
        let data = { productId: this.props.productId };
        fetch('http://localhost:8812/chat/find-all-sender-ids', {
            method: 'POST',
            headers:{
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res =>{
            this.gettingListofSenderDetails(res.result);
        }).catch(err =>{
            console.log('React error: listOfSenders.js ',err);
        });
    }
    
    clickEvent = (id, name)=>{
        this.setState({ chatShow: false });
        
        if(id !== this.props.receiverId){
            this.gettingChat(id);
            setTimeout(
                ()=>{
                    store.dispatch({
                        type: RECEIVER_ID,
                        receiverId: id,
                        receiverName: name
                    });
                    sessionStorage.setItem('receiverId', id);
                    
                    this.setState({ chatShow: true }, ()=>{
                        store.dispatch({
                            type: CHAT_BOX,
                            collapse: true
                        });
                    });
                    store.dispatch({
                        type: MESSAGE_REMOVE,
                        messages: []
                    });
                }
            );
        } else {
            this.gettingChat(id);
            store.dispatch({
                type: MESSAGE_REMOVE,
                messages: []
            });
            store.dispatch({
                type: RECEIVER_ID,
                receiverId: id,
                receiverName: name
            });
            sessionStorage.setItem('receiverId', id);
            this.setState({ chatShow: true }, ()=>{
                store.dispatch({
                    type: CHAT_BOX,
                    collapse: true
                });
            });
        }
    }

    dismissChatBox = ()=>{
        this.setState({chatShow:false}, ()=>{
            store.dispatch({
                type: CHAT_BOX,
                collapse: false
            })
        });
        store.dispatch({
            type: MESSAGE_REMOVE,
            messages: []
        });
    }

    gettingListofSenderDetails = (id)=>{
        let data = { userList: id };
        fetch('http://localhost:8812/users/get-senders-detail', {
            method: 'POST',
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            this.setState({userList:res.result});
        })
        .catch(error =>{
            console.log('React error: gettingListofSenderDetails ',error);
        });
    }

    chatButtonEvent = ()=>{
        this.gettingChat(this.props.productOwnerId);
        store.dispatch({
            type: CHAT_BOX,
            collapse: true
        });
        store.dispatch({
            type: RECEIVER_ID,
            receiverId: this.props.productOwnerId
        });
        store.dispatch({
            type: MESSAGE_REMOVE,
            messages: []
        });
        this.setState({chatShow:true});

    }

    gettingChat = (id)=>{
    
        let getChatData = {
          productId: this.props.productId,
          logedinUserId: this.props.userIdRedux,
          productOwnerId: id
        };
        fetch('http://localhost:8812/chat/getChat', {
          method:'POST',
          headers:{
            'content-type': 'application/json'
          },
          body: JSON.stringify(getChatData)
        })
        .then(res => res.json())
        .then(res => {
          this.setState({oldMessages:res.messages})
        })
        .catch(err => {
          console.log('React error getChatData - chat.js', err);
        });
    }

    render() {
        let listOrButton = <div>
            {
                this.props.userIdRedux === this.props.productOwnerId ?
                <div className='listOfUser'>
                    <div className='senders'>
                        {
                            this.state.userList.map(user =>{
                                // user._id not be equal to loged-in user
                                return this.props.userIdRedux !== user._id
                                ?
                                <div 
                                    key={user._id} 
                                    onClick={()=> this.clickEvent(user._id, user.name)}
                                    className='sender'
                                >
                                    <Avatar size="small" icon="user" />
                                    <span className='sender-name'>{user.name}</span>
                                </div>
                                : null
                            })
                        }
                    </div> 
                </div> 
                :
                store.getState().authentication.user === 'Success' ?
                <Button 
                    id="chat-button"
                    type="danger"
                    shape="circle"
                    size="large"
                    icon="message"
                    onClick={this.chatButtonEvent}
                />
                : null
            }
        </div>;
        return (
            <div>
                {listOrButton}
                <Chat 
                    dismissChatBox={this.dismissChatBox} 
                    productId={this.props.productId}
                    productOwnerId={this.props.productOwnerId}
                    socket={this.props.socket}
                    chatShow={this.state.chatShow}
                    oldMessages={this.state.oldMessages}
                />  
            </div>
        )
    }
}

const mapStateToProps = state => ({
    collapse: state.chatReducer.collapse,
    receiverId: state.chatReducer.receiverId,
    collapseInfo: state.chatReducer.collapseInfo,
    userIdRedux: state.authentication.userDetails
});
  
export default connect(mapStateToProps,{})(ListOfSenderButton);