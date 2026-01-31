
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDB } from './lib/db.js';


const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    });
})
