export default (io) => {
  // socket.io connection
  io.sockets.on('connection', (socket) => {
    socket.on('disconnect', () => {
      console.log('socketIO 連線已斷開');
    });

    socket.send(socket.id);

    // 接收client訊息並回傳
    socket.on('SendMessage', (data) => {
      console.log(`ID: ${socket.id}`, `使用者:${data.username}`, `內容: ${data.content}`);
      socket.emit('ReceiveMessage', { username: 'ChatBot', content: 'server回傳訊息 ' });
    });
  });
};
