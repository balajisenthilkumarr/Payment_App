// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import {Server}  from 'socket.io';
import router from './routes/payements.js';
import authRoutes from './routes/logion.js';
import connectDB from './config/db.js';


export let client1 = null;
export let client2 = null;
export let targetClient = null;

export let tempclient=null;
// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize express app
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
}));

// Initialize socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// let client1 = null;
// let client2 = null

// Handle incoming socket connections
io.on("connection", (socket) => {
  console.log("Socket connected with a client",socket.id);


  if (!client1) {
    client1 = socket.id;
    console.log(`Client 1 assigned: ${client1}`);
  } else if (!client2 && socket.id !== client1) {
    client2 = socket.id;
    console.log(`Client 2 assigned: ${client2}`);
  }


  // let targetClient = null;

  // Determine the target client
  targetClient = socket.id === client1 ? client2 : client1;

       socket.on("payment activated",(data)=>{
         console.log("message from client","hellooooo");
  
  
          tempclient=socket.id;
         socket.emit("payment initiated", "Payment Initiated");
        });

        socket.on("disconnect", () => {
          console.log(`Client disconnected: ${socket.id}`);
      
          if (socket.id === client1) {
            client1 = null;
          } else if (socket.id === client2) {
            client2 = null;
          }
      
          targetClient = client1 || client2;
        });

  //socket.on("sendMessage", (data)=>{
   // console.log("data from clinet",data);
  //  socket.on("payment_activated", (data) => {
  //   console.log("Message from client:", data);
  //  });

   // Assign the first two clients
  
  
  // socket.on("disconnect", () => {
  //   console.log(`Client disconnected: ${socket.id}`);
  //   if (socket.id === client1) {
  //     client1 = null;
  //   } else if (socket.id === client2) {
  //     client2 = null;
  //   }
  // });
 });


  // socket.on("sendMessage", (data) => {
  //     console.log(`A message from client : ${data}`);
     
 
      // // Emit "payment initiated" immediately
      // socket.emit("payment initiated", "The payment initiated on processing");
 
      // // Wait 1 minute (60,000 milliseconds) before emitting "payment received"
      // setTimeout(() => {
      //     socket.emit("payment received", "The payment received successfully");
      // }, 6000);
  // });
//});

// // Socket.IO setup with error handling
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true
//   },
// });

// // Socket connection handling
// io.on("connection", (socket) => {
//   console.log(`New client connected: ${socket.id}`);

//   // Handle user joining
//   socket.on("user:join", (userId) => {
//     if (!userId) {
//       console.error("Join attempt without userId");
//       return;
//     }

//     try {
//       // Store user connection info
//       connectedUsers.set(userId, {
//         socketId: socket.id,
//         connectedAt: new Date(),
//         lastActive: new Date()
//       });

//       // Join user to their own room
//       socket.join(`user_${userId}`);
      
//       console.log(`User ${userId} joined successfully`);
      
//       // Acknowledge successful connection
//       socket.emit("join:success", {
//         message: "Successfully connected to real-time updates"
//       });
//     } catch (error) {
//       console.error(`Error in user:join for userId ${userId}:`, error);
//       socket.emit("join:error", {
//         message: "Failed to establish real-time connection"
//       });
//     }
//   });

//   // Handle payment updates
//   socket.on("payment:update", (paymentData) => {
//     try {
//       const { userId, data } = paymentData;
//       if (userId && connectedUsers.has(userId)) {
//         // Emit to specific user's room
//         io.to(`user_${userId}`).emit("payment:updated", data);
//       }
//     } catch (error) {
//       console.error("Error in payment:update:", error);
//     }
//   });

//   // Handle disconnection
//   socket.on("disconnect", (reason) => {
//     try {
//       // Find and remove disconnected user
//       for (const [userId, userData] of connectedUsers.entries()) {
//         if (userData.socketId === socket.id) {
//           connectedUsers.delete(userId);
//           console.log(`User ${userId} disconnected. Reason: ${reason}`);
//           break;
//         }
//       }
//     } catch (error) {
//       console.error("Error handling disconnect:", error);
//     }
//   });

//   // Handle errors
//   socket.on("error", (error) => {
//     console.error("Socket error:", error);
//   });
// });

// Middleware setup
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(bodyParser.json());

// // Make socket.io available in routes
// app.set('io', io);
// app.set('connectedUsers', connectedUsers);

// Routes
app.use('/api/payment', router);
app.use('/api/auth', authRoutes);

// Connect to database
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Export for use in other files
export { io };