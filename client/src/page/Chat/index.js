// 載入socket.io client庫
import SocketIOClient from "socket.io-client";

import React, { Component } from "react";
import "./index.css";

import HandleMessage from "./handleMessage";

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [
        {
          username: "ChatBot",
          content: "嗨"
        }
      ]
    };

    // socketIO config
    this.socket = SocketIOClient(
      process.env.NODE_ENV === "production" ? "http://localhost:5000" : "http://localhost:3000"
    );
  }

  componentDidMount() {
    this.scrollToBot();
    this.ReceiveMessage();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  // scroll控制
  scrollToBot() {
    this.chats.scrollTop = this.chats.scrollHeight;
  }

  // 接收訊息
  ReceiveMessage() {
    this.socket.connect();
    this.socket.on("ReceiveMessage", data => {
      this.setState({
        chats: this.state.chats.concat([
          {
            username: "ChatBot",
            content: data.content
          }
        ])
      });
      console.log("id:", this.socket.io.engine.id, "使用者:", data.username, "內容", data.content);
    });
  }

  // 送出訊息
  submitMessage = e => {
    e.preventDefault();
    if (this.message.value === "") return null;
    // socket.io傳送訊息
    this.socket.emit("SendMessage", { username: "User", content: this.message.value });
    // 將訊息合併至list
    this.setState(
      {
        chats: this.state.chats.concat([
          {
            username: "user",
            content: this.message.value
          }
        ])
      },
      () => {
        this.message.value = "";
      }
    );
  };

  render() {
    return (
      <div className="ChatRoom">
        <h4>聊天室</h4>
        <ul
          className="chats"
          ref={chats => {
            this.chats = chats;
          }}
        >
          {this.state.chats.map((chat, index) => <HandleMessage key={index} chat={chat} user="user" />)}
        </ul>
        <form className="input" onSubmit={e => this.submitMessage(e)}>
          <input
            placeholder="輸入訊息..."
            maxLength="50"
            type="text"
            ref={msg => {
              this.message = msg;
            }}
          />
          <input type="submit" value="送出" />
        </form>
      </div>
    );
  }
}

export default ChatRoom;
