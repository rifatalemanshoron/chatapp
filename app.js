const express = require("express")
const app = express()
const path = require("path")
const PORT = process.env.PORT || 8000
const server =  app.listen(PORT, () => console.log(`STARTE AT: ${PORT}`))

const io = require("socket.io")(server)
//app.use(express.static("./public"))
app.use(express.static(path.join(__dirname, "public")))  //Above can also written like this
//app.use(express.static(path.resolve("./public")))


let socketConnected = new Set();
io.on("connect", onConnect)

function onConnect(socket){
    console.log(socket.id);
    socketConnected.add(socket.id)

    io.emit("clients-total", socketConnected.size);
    
    socket.on("message", (data)=>{
        console.log(data)
        socket.broadcast.emit("chat-message", data);
    })

    socket.on("feedback", data => {
        socket.broadcast.emit("feedback", data);
    })

    socket.on("disconnect", ()=>{
        console.log("Disconnected: ", socket.id);
        socketConnected.delete(socket.id);
        io.emit("clients-total", socketConnected.size);
    })
}
