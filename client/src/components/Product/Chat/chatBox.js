import React, { Component } from 'react';
import Message from './message';
import { Icon } from 'antd';

class ChatBox extends Component {
  render() {
    return (
        <div className={`chatBox ${this.props.collapse}`}>
            <div className='chatBox-header'>
                <span onClick={this.props.clickEvent} className="collapsible">{this.props.chatTitle}</span>
                <Icon 
                    type="close"
                    onClick={this.props.dismissChatBox}
                />
            </div>
            <div className={`content ${this.props.collapse}`}>
                <Message
                    messages={this.props.messages}
                    oldMessages={this.props.oldMessages}
                    receiverId={this.props.productOwnerId}
                />
                <div className='footer'>
                    <form onSubmit={this.props.fetchReceiverSocketId}>
                        <input 
                            name='input'
                            value={this.props.input} 
                            onChange={this.props.onChangeHandler}
                            type='text'
                        />
                    </form>
                </div>
            </div>
        </div>
    )
  }
}

export default ChatBox;