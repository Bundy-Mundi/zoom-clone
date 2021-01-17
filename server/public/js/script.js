const socket = io('/');

// Handles userID
const peer = new Peer(undefined, {
    host: '/',
    port: 3001
}); 

// Video
const myVideo = document.createElement('video');
const videoGrid = document.getElementById("video-grid");
myVideo.muted = true; // Prevents unlimited-times echo
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);

    socket.on('user-connected', userID => {
        connectToNewUser(userID, stream);
        console.log(`${userID} is Connected`);
    })

    // This shows other users' videos
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })
})

// Peer JS Events
peer.on('open', id => {
    socket.emit("join-room", ROOM_ID, id);
})

// Functions
function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}
function connectToNewUser(userID, stream) {
    const call = peer.call(userID, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    // This handles disconnected users' vidoes
    call.on('close', () => {
        video.remove();
    });
}