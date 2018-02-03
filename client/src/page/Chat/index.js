import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

import HandleMessage from "./handleMessage";

import io from "socket.io-client";
const socket = io().connect("http://localhost:3000/");

class ChatRoom extends Component {
  state = {
    chats: [
      {
        username: "user",
        content: "hello"
      },
      {
        username: "ChatBot",
        content: "hey!"
      }
    ]
  };

  componentDidMount() {
    this.scrollToBot();
    socket.on("ChatMessage", data => {
      console.log("client message", data);
      socket.emit("my client", { client: "client msg to server" });
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
    this.setState(
      {
        chats: this.state.chats.concat([
          {
            username: "user",
            content: <p>{ReactDOM.findDOMNode(this.refs.message).value}</p>
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
