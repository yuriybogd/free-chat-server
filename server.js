require("dotenv").config()

const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})


mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error " + err.message)
})

mongoose.connection.once("open", () => {
  console.log("MongoDB connected: " + process.env.DATABASE)
})

//bring in the models
require("./models/User")
require("./models/Message")
require("./models/Chatroom")

const app = require("./app")

const port = process.env.PORT || 8000

const server = app.listen(port, () => {
  console.log(`Server listening in port ${port}`)
})

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})
const jwt = require("jwt-then")

const Message = mongoose.model("Message")
const User = mongoose.model("User")

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token
    const payload = await jwt.verify(token, process.env.SECRET)
    socket.userId = payload.id
    next()
  } catch (e) {
  }
})

io.on("connection", (socket) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

  socket.on("chatroomMessage", async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });
      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userId,
        message,
      });
      io.to(chatroomId).emit("newMessage", {
        message,
        name: user.name,
        userId: socket.userId,
      });
      await newMessage.save();
    }
  });
});