import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB';
import userRoute from './routes/user.route'
import menuRoute from './routes/menu.route'
import restaurantRoute from './routes/restaurant.route'
import orderRoute from './routes/order.route'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import path from 'path'

dotenv.config();
const app = express();

const PORT = process.env.PORT;

// default middleware for mern project
app.use(bodyParser.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}))
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

const DIR_NAME = path.resolve();

app.use(cors(corsOptions)); 
// api
// localhost:8000/api/v1/user/register
app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute)
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

// TODO: Deployment - thoda seekhna hai iske baare mai
// package.json, package-lock.json, .env ko server folder ke bahar laana hai
app.use(express.static(path.join(DIR_NAME, '/client/dist')));
app.use("*", (_, res) => {
    res.sendFile(path.resolve(DIR_NAME, "client", "dist", 'index.html'));
})

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
})