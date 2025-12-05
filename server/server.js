import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())


app.listen(PORT, () => {
    console.log(`Server started on: http://localhost:${PORT}`);
})
app.get('/', (req, res) => {
    res.send("Hello World!")
})


mongoose.connect('mongodb://localhost:27017/spotifyDB')
.then(() => {
    console.log("Connected to MongoDB")
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err)
})