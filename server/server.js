const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`${uuidV4()}`);
});
app.get("/:roomID", (req, res)=>{
    res.render('room', { roomID: req.params.roomID });
});

io.on("connection", socket => {
    socket.on('join-room', (roomID, userID) => {
        socket.join(roomID); // Add the socket to the given room
        socket.to(roomID).broadcast.emit("user-connected", userID); // Broadcast the event 'user-connected'
        //console.log(`RoomID: ${roomID}\nUserID: ${userID}`);
    })
})

// Server is for setting up rooms
server.listen(3000);
