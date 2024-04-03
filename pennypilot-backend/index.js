import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import path from 'path'
import cors from 'cors'

const port = process.env.PORT || 3000;
const app = express();
app.use(cors({
    allowedHeaders: ['*'],
    origin: '*'
}));

app.get("/", (req,res)=> {
    res.json({message: `Server Started On ${port}`});
})

const server = app.listen(8000, () => {
console.log("Server running on port 8000");
});