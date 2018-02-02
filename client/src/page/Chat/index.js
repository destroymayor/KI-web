import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

import HandleMessage from "./handleMessage";

class ChatRoom extends Component {
  state = {
    chats: [
      {
        username: "Kevin Hsu",
        content: <p>你好</p>
      },
      {
        username: "Alice Chen",
        content: <p>Love it!</p>
      },
      {
        username: "Kevin Hsu",
        content: <p>Check out my Github at</p>
      },
      {
        username: "KevHs",
        content: (
          <p>
            Lorem ipsum dolor sit amet, nibh ipsum. Cum class sem inceptos incidunt sed sed. Tempus wisi enim
            id, arcu sed lectus aliquam, nulla vitae est bibendum molestie elit risus.
          </p>
        )
      },
      {
        username: "Kevin Hsu",
        content: <p>So</p>
      },
      {
        username: "Kevin Hsu",
        content: <p>Chilltime is going to be an app for you to view videos with friends</p>
      },
      {
        username: "Kevin Hsu",
        content: <p>You can sign-up now to try out our private beta!</p>
      },
      {
        username: "Alice Chen",
        content: <p>Definitely! Sounds great!</p>
      }
    ]
  };

  componentDidMount() {
    this.scrollToBot();
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
            username: "Kevin Hsu",
            content: <p>{ReactDOM.findDOMNode(this.refs.msg).value}</p>
          }
        ])
      },
      () => {
        ReactDOM.findDOMNode(this.refs.msg).value = "";
      }
    );
  }

  render() {
    const username = "Kevin Hsu";
    const { chats } = this.state;
    return (
      <div className="ChatRoom">
        <h4>聊天室</h4>
        <ul className="chats" ref="chats">
          {chats.map(chat => <HandleMessage chat={chat} user={username} />)}
        </ul>
        <form className="input" onSubmit={e => this.submitMessage(e)}>
          <input type="text" ref="msg" />
          <input type="submit" value={"送出"} />
        </form>
      </div>
    );
  }
}

export default ChatRoom;
