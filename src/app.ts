import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import config from './config';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { orderHandler } from './socket.io/socket.io/orderHandler';




const app: Application = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
        methods: ["GET", "POST"]
    }
});


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

//parser
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router)
app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "My E-commerce Server is Running..",
        environment: config.node_env,
        uptime: process.uptime().toFixed(2) + "sec",
        timeStamp: new Date().toISOString()
    })
});
io.on('connection', (socket) => {
    console.log('⚡ A user connected:', socket.id);
    orderHandler(io, socket);

    socket.on('disconnect', () => {
        console.log('❌ User disconnected');
    });

});






app.use(globalErrorHandler);

app.use(notFound);


export { app, server, io };
