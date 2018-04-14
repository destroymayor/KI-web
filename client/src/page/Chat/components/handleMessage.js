import React from "react";

const HandleMessage = ({ chat, user }) => (
  <li className={`chat ${user === chat.username ? "right" : "left"}`}>
    {user !== chat.username && <span>{chat.username}</span>}
    {chat.content}
  </li>
);

export default HandleMessage;
