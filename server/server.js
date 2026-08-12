// Load env variables FIRST — before anything else 
const dotenv = require('dotenv') 
dotenv.config()

const express = require('express');
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser")
const cors = require("cors")
const app = express();

const authRouter = require('./routes/auth')
const profileRouter = require("./routes/profile");
const skillsRouter = require("./routes/skills");



app.use(express.json());
app.use(cookieParser()); 

//cors is a middleware which allows us to specify which frontend application can access our backend APIs and 
//also allows us to specify whether the frontend application can send cookies or not
app.use(
  cors({
    origin: "http://localhost:5173",
    //when we set credentials to true it allows the frontend application to send cookies to the backend APIs
    credentials: true,
  })
);


const port = process.env.PORT || 3000


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", skillsRouter);

app.get('/', (req, res) => {
  res.send('API is running');
});


connectDB().then(() => {
    console.log("Connected to MongoDB!!");

    app.listen(port, () => {
        console.log(`API is running on port ${port}`);
    });
}).catch((err) => {
    console.error("Failed to connect to DB:", err.message);
});
