import React, { Component } from 'react';
import { connect } from 'react-redux';


class Message extends Component {

  scrollToBottom = ()=> {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount = ()=> {
    this.scrollToBottom();
  }
  
  componentDidUpdate = ()=> {
    this.scrollToBottom();
  }

  render() {
    return (
      <div className='messages-container messages'>
        {
          this.props.oldMessages.map(oldMsg => {
            return oldMsg.sender_id === this.props.userIdRedux
            ?
            <div className='msg-cont send' key={oldMsg._id}>
              <div className={`sender ${oldMsg.status}`}>
                {oldMsg.message}
              </div>
            </div>
            :
            <div className='msg-cont receive' key={oldMsg._id}>
              <div className='receiver'>
                {oldMsg.message}
              </div>
            </div>
          })
        }
        
        {
          this.props.messagesRedux.map((msg, index) => (
            msg.senderId === this.props.receiver
            ?
              msg.senderId === this.props.userIdRedux
              ? 
              <div className='msg-cont send' key={index}>
                <div className={`sender ${msg.status}`}>
                  {msg.message}
                </div> 
              </div>
              : 
              <div className='msg-cont receive' key={index}>
                <div className='receiver'>
                  {msg.message}
                </div>
              </div>
            :
              msg.senderId === this.props.userIdRedux
              ? 
              <div className='msg-cont send' key={index}>
                <div className={`sender ${msg.status}`}>
                  {msg.message}
                </div> 
              </div>
              : 
              null
          ))
        }
        <div className='hiddenDiv' ref={(el) => { this.messagesEnd = el; }}></div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  receiver: state.chatReducer.receiverId,
  userIdRedux: state.authentication.userDetails,
  messagesRedux: state.chatReducer.messages,
  collapse: state.chatReducer.collapse
});

export default connect(mapStateToProps,{})(Message);