import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

import HandleMessage from "./handleMessage";

//載入socket.io client庫
import io from "socket.io-client";
const socket = io.connect("http://localhost:3000/");

class ChatRoom extends Component {
  state = {
    chats: [
      {
        username: "ChatBot",
        content: "嗨"
      }
    ]
  };

  componentDidMount() {
    this.scrollToBot();

    //接收server回傳的訊息
    socket.on("SendMessage", data => {
      this.setState({
        chats: this.state.chats.concat([
          {
            username: "ChatBot",
            content: data.content
          }
        ])
      });
      console.log("client NewMessage", data);
    });
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot() {
    ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
  }

  submitMessage(e) {
    e.preventDefault();

    if (ReactDOM.findDOMNode(this.refs.message).value === "") return null;

    //傳送訊息
    socket.emit("SendMessage", { username: "User", content: ReactDOM.findDOMNode(this.refs.message).value });

    this.setState(
      {
        chats: this.state.chats.concat([
          {
            username: "user",
            content: ReactDOM.findDOMNode(this.refs.message).value
          }
        ])
      },
      () => {
        ReactDOM.findDOMNode(this.refs.message).value = "";
      }
    );
  }

  render() {
    return (
      <div className="ChatRoom">
        <h4>聊天室</h4>
        <ul className="chats" ref="chats">
          {this.state.chats.map((chat, index) => <HandleMessage key={index} chat={chat} user={"user"} />)}
        </ul>
        <form className="input" onSubmit={e => this.submitMessage(e)}>
          <input type="text" ref="message" />
          <input type="submit" value={"送出"} />
        </form>
      </div>
    );
  }
}

export default ChatRoom;
