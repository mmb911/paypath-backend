import express from "express";
import  dotenv from "dotenv";
import  mongoose from "mongoose";
import authRouter from "./routes/auth_route.js";
//import  balanceRouter from "./routes/balance_route";
import balanceRouter from "./routes/balance_route.js";
import transactionRouter from "./routes/transactions_route.js";
//import notifications from "./controllers/notification_controller";
import  userRouter from "./routes/user_route.js";
import cors from "cors";
//import Message from "./models/message_model";
//import Chat from "./models/chat_model";
//import chatRouter from "./controllers/chat_controller";
//import messageRouter from "./controllers/message_controller";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

const startServer = async ()=>{
  //const serviceAccount =JSON.parse(fs.readFileSync(new URL("./firebase-app.json", import.meta.url)));
  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   databaseURL: process.env.databaseURL,
 // });
  
  app.use(express.json());
  app.use(cors());
  app.use(authRouter);
  app.use(transactionRouter);
  app.use(balanceRouter);
  app.use(userRouter);
  console.log("process.env.DATABASE_URL:",process.env.DATABASE_URL);
  

        // useNewUrlParser: true,
      // useUnifiedTopology: true,

  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Successfully connected to MongoDB!");
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      });
  
    })
    .catch((e) => {
      console.log(e);
      console.log("Unable to connect to MongoDB");
    });  
}

startServer();


// const io = require("socket.io")(server, {
//   pingTimeout: 120000,
//   cors: {
//     origin: process.env.PAY_MOBILE_DATABASE,
//   },
// });

// io.on("connection", (socket) => {
//   socket.on("join", ({ chatId }) => {
//     socket.join(chatId);
//   });

//   socket.on("sendMessage", async ({ chatId, sender, content, receiver }) => {
//     try {
//       const message = new Message({ sender, content, receiver, chat: chatId });
//       await message.save();
//       await Chat.findByIdAndUpdate(chatId, { latestMessage: content });
//       io.to(chatId).emit("message", message);
//     } catch (error) {
//       console.error(error);
//     }
//   });
// });
